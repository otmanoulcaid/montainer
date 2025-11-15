import Server from './src/server.js';

async function main() {
    const server = new Server(3000);
    server.start();
}

main();

// nodemonitoring
