import { WebSocketServer } from 'ws'

export const statWebsocket = (server) => {
    const dockerService = server.dockerService

    const wss = new WebSocketServer({ server, path: '/ws/v1/container/stats' })

    wss.on('connection', ws => {
        console.log('Client connecté au WebSocket Docker stats')

        const interval = setInterval(async () => {
            try {
                const streams = await dockerService.getStats() // [{id, name, stream}]
                ws.send(JSON.stringify(streams))
            } catch (e) {
                ws.send(JSON.stringify({ error: e.message }))
            }
        }, 1000)

        ws.on('close', () => {
            clearInterval(interval)
            console.log('Client déconnecté du WebSocket Docker stats')
        })
    })
}
