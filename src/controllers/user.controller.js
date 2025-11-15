import { UserRepository } from "../repositories/user.repository.js"
import { UserService } from "../services/user.service.js"

export class UserController {

    constructor() {
        this.repo = new UserRepository()
        this.service = new UserService(this.repo)
    }

    async getUsers(req, res) {
        try {
            const users = await this.service.getUsers()
            res.json(users)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async getUser(req, res) {
        try {
            const { id } = req.params
            const user = await this.service.getUser({ id })
            res.json(user)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}
