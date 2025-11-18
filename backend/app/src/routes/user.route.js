import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

const router = Router()
const controller = new UserController()

router.get('/', (req, res) => {
    controller.getUsers(req, res)
})
router.get('/:id', (req, res) => {
    controller.getUser(req, res)
})

export default router
