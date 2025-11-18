import Server from './src/server.js';

async function main() {
    const server = new Server(3003);
    server.start();
}

main();

// nodemonitoring
