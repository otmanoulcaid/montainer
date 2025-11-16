import { AuthService } from "../services/auth.service.js";

export class AuthController {

    constructor() {
        // On injecte userService dans AuthService
        this.service = new AuthService();
    }

    async login(req, res) {
        try {
            const { matricule, password } = req.body;
            const result = await this.service.login(matricule, password, res);
            res.json(result);  // { message, user }
        } catch (e) {
            res.status(401).json({ error: e.message });
        }
    }

    async logout(req, res) {
        try {
            const result = this.service.logout(res);
            res.json(result); // { message: "Déconnexion réussie" }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    me(req, res) {
        try {
            this.service.verifyTokenFromCookie(req);
            res.status(204).end()
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
