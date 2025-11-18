export class ContainerController {
    async createContainer(req, res) {
        const docker = req.app.locals['dockerService']
        try {
            const obj = req.body
            const container = await docker.createContainer(obj)
            res.json({ created: true, id: container.id })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async deleteContainer(req, res) {
        const docker = req.app.locals['dockerService']
        try {
            const { id } = req.params
            await docker.deleteContainer({ id })
            res.json({ deleted: true })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async startContainer(req, res) {
        const docker = req.app.locals['dockerService']
        try {
            const { id } = req.params
            const result = await docker.startContainer({ id })
            res.json(result)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async stopContainer(req, res) {
        const docker = req.app.locals['dockerService']
        try {
            const { id } = req.params
            const result = await docker.stopContainer({ id })
            res.json(result)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async restartContainer(req, res) {
        const docker = req.app.locals['dockerService']
        try {
            const { id } = req.params
            const result = await docker.restartContainer({ id })
            res.json(result)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async getContainer(req, res) {
        console.log('======== get container ========');
        
        const docker = req.app.locals['dockerService']
        try {
            const { id } = req.params
            const data = await docker.getContainer({ id })
            res.json(data)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async getContainers(req, res) {
        const docker = req.app.locals['dockerService']
        try {
            const data = await docker.getContainers()
            res.json(data)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}
