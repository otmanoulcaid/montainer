import { WebSocketServer } from 'ws'

export const statWebsocket = (server) => {
    const docker = server.locals['dockerService']

    const wss = new WebSocketServer({ server, path: '/api/containers/stats/live' })

    wss.on('connection', ws => {
        console.log('Client connecté au WebSocket Docker stats')

        const interval = setInterval(async () => {
            try {
                const streams = await docker.getStats() // [{id, name, stream}]

                // Ici tu peux ajouter CPU/Mem si getStats les fournit
                const data = streams.map(s => ({
                    id: s.id,
                    name: s.name
                }))

                ws.send(JSON.stringify(data))
            } catch (e) {
                ws.send(JSON.stringify({ error: e.message }))
            }
        }, 2000)

        ws.on('close', () => {
            clearInterval(interval)
            console.log('Client déconnecté du WebSocket Docker stats')
        })
    })
}
