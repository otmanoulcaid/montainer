import Server from './src/server.js';
// import express from 'express';

// function exp01() {
//     const app = express();
    
//     // 1/3. configuration
//     app.use(express.static('public')); // preciser le chemin des ressources statiques
    
//     // 1.2 gestion des routes
//     app.get('/app/test', (req, res) => {
//         res.send('<h1>Test de notre applicaton</h1>');
//     });
    
//     //1.3 demarage de serveur
//     app.listen(3000, () => {
//         console.log('Server is running on http://localhost:3000');
//     });
// }

function main() {
    const server = new Server(3000);
    server.start();
    // exp01();
}

main();

// nodemonitoring
