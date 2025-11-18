import { UserService } from "../services/user.service.js"

export class UserController {

    constructor() {
        this.service = UserService.getService()
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
