import express from 'express';
import cors from 'cors';

// Routes
import containerRoutes from './routes/container.routes.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import { statWebsocket } from './routes/stats.route.js';
import { DockerService } from './services/docker.service.js';
import { ContainerRepository } from './repositories/container.repository.js';

export default class Server {
    constructor(port) {
        this.port = port || 3000;
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(express.static('public')); // chemin des ressources statiques
        this.app.use(express.json());           // parser le corps des requêtes JSON
        this.app.use(cors());
        const repo = new ContainerRepository()
        this.app.locals['dockerService'] = new DockerService(repo) // activer CORS
    }

    routes() {
        this.app.use('/api/containers', containerRoutes);
        // this.app.use('/api/users', userRoutes);
        // this.app.use('/api/auth', authRoutes);
        statWebsocket(this.app);
    }

    start(callback) {
        if (callback === undefined)
            callback = () => console.log(`Server is running on http://localhost:${this.port}`);
        this.app.listen(this.port, callback);
    }
}
