import { Docker } from 'node-docker-api'

export class DockerService {

    constructor(containerRepository) {
        this.dockerd = new Docker({ socketPath: process.platform === 'win32' ? '\\\\.\\pipe\\docker_engine' : '/var/run/docker.sock' });
        this.repository = containerRepository;
        this.launchContainer();
    }


    async pullImage(image, tag) {
        try {
            console.log(`Pulling image ${image + ':' + tag}...`);
            const stream = await this.dockerd.image.create({}, { fromImage: image + ':' + tag});

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

    async launchContainer() {
        const containers = await this.repository.getContainers();
        for (let data of containers) {
            await this.pullImage(data.image, data.tag || 'latest');

            // Create and start container
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
        return containers.map(c => c.data)
    }
}
