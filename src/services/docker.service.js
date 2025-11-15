import { Docker } from 'node-docker-api'
import { ContainerRepository } from '../repositories/container.repository.js';

export class DockerService {

    constructor(containerRepository) {
        this.dockerd = new Docker({ socketPath: process.platform === 'win32' ? '\\\\.\\pipe\\docker_engine' : '/var/run/docker.sock' });
        this.repository = new ContainerRepository();
        this.launchContainers();
    }


    async pullImage(image, tag) {
        try {
            console.log(`Pulling image ${image + ':' + tag}...`);
            const stream = await this.dockerd.image.create({}, { fromImage: image + ':' + tag });

            // Wait for the pull to complete
            await new Promise((resolve, reject) => {
                stream.on('data', (chunk) => process.stdout.write(chunk.toString()));
                stream.on('end', resolve);
                stream.on('error', reject);
            });

        } catch (err) {
            console.error('Error pulling image:', err);
        }
    }

    async launchContainers() {
        try {
            await this.repository.loadContainers('src/data/container.data.json');
            const containers = await this.repository.getContainers();

            for (let data of containers) {
             try {
                 await this.pullImage(data.image, data.tag || 'latest');
                 const container = await this.dockerd.container.create({
                     Image: data.image,
                     name: data.name,
                     HostConfig: {
                         PortBindings: {
                             [`${data.port}/tcp`]: [{ HostPort: `${data.port}` }]
                            }
                        }
                    });
                    await container.start();
                    console.log(`Container ${data.name} started`);
                } catch (error) {
                   console.log(error.message);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    getDaemon() {
        return this.dockerd
    }

    async createContainer(obj) {
        const container = await this.dockerd.container.create(obj)
        await container.start();

        // Insert into MongoDB
        await this.repository.insertContainer({
            dockerId: container.id,
            name: obj.name || null,
            image: obj.Image,
            createdAt: new Date()
        })

        return container
    }

    async deleteContainer({ id }) {
        const container = this.dockerd.container.get(id)

        await container.delete({ force: true })

        // Remove from MongoDB
        await this.repository.deleteContainer(id)
        return { deleted: true }
    }

    async stopContainer({ id }) {
        const container = this.dockerd.container.get(id)
        await container.stop()
        return { stopped: true }
    }

    async startContainer({ id }) {
        const container = this.dockerd.container.get(id)
        await container.start()
        return { started: true }
    }

    async restartContainer({ id }) {
        const container = this.dockerd.container.get(id)
        await container.restart()
        return { restarted: true }
    }

    async getContainer({ id }) {
        const container = this.dockerd.container.get(id)
        const info = await container.status()
        return info.data
    }

    async getContainers() {
        const containers = await this.dockerd.container.list({ all: true })
        return containers.map(c => ({
            id: c.data.Id,
            name: c.data.Names[0].replace('/', ''),
            image: c.data.Image,
            hostPort: c.data.Ports[0]?.PublicPort,
            containerPort: c.data.Ports[0]?.PrivatePort,
            state: c.data.State,
            status: c.data.Status
        }))
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }

    async getStats() {
        const containers = await this.dockerd.container.list({ all: true });
        const result = [];

        for (const c of containers) {
            const stream = await c.stats({ stream: false });

            const statsJSON = await new Promise((resolve, reject) => {
                let data = '';
                stream.on('data', chunk => data += chunk.toString());
                stream.on('end', () => resolve(JSON.parse(data)));
                stream.on('error', err => reject(err));
            });

            let netInput = 0, netOutput = 0;
            if (statsJSON.networks) {
                for (const iface of Object.values(statsJSON.networks)) {
                    netInput += iface.rx_bytes || 0;
                    netOutput += iface.tx_bytes || 0;
                }
            }

            const cpu = (statsJSON.cpu_stats?.cpu_usage?.total_usage || 0) / 1e9;

            result.push({
                id: c.id,
                name: c.data.Names?.[0]?.replace('/', '') || c.id,
                cpu: cpu.toFixed(2) + ' s',
                memory: this.formatBytes(statsJSON.memory_stats?.usage || 0),
                memoryLimit: this.formatBytes(statsJSON.memory_stats?.limit || 0),
                network: {
                    Input: this.formatBytes(netInput),
                    Output: this.formatBytes(netOutput)
                }
            });
        }
        return result;
    }
}
