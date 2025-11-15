import { AuthService } from "../services/auth.service.js"

export class AuthController {

    constructor() {
        this.service = new AuthService()
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const token = await this.service.login(username, password)
            res.json({ token })
        } catch (e) {
            res.status(401).json({ error: e.message })
        }
    }

    async logout(req, res) {
        try {
            const { username, password } = req.body
            const token = await this.service.login(username, password)
            res.json({ token })
        } catch (e) {
            res.status(401).json({ error: e.message })
        }
    }
}
