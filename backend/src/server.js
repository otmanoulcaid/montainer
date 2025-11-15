import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

// Routes
import containerRoutes from './routes/container.routes.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import { statWebsocket } from './routes/stats.route.js';
import { DockerService } from './services/docker.service.js';
import { ContainerRepository } from './repositories/container.repository.js';
import { UserRepository } from './repositories/user.repository.js';
import { authMiddleware } from './middlewares/jwt.middleware.js';
// import { ContainerRepository } from './repositories/container.repository.mock.js';
// import { UserRepository } from './repositories/user.repository.mock.js';

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
        this.app.use(cookieParser());
        this.app.locals['dockerService'] = new DockerService();
    }
    
    routes() {
        this.app.use('/api', authMiddleware);
        this.app.use('/api/V1/container', containerRoutes);
        this.app.use('/api/v1/user', userRoutes);
        this.app.use('/api/v1/auth', authRoutes);
    }

    start(callback) {
        if (callback === undefined)
            callback = () => console.log(`Server is running on http://localhost:${this.port}`);
        const server = this.app.listen(this.port, callback);
        server.dockerService = this.app.locals['dockerService']
        statWebsocket(server)
    }
}
