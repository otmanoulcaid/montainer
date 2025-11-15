import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

const router = Router()
const controller = new UserController()

router.get('/', (req, res) => {
    controller.getUsers()
})
router.get('/:id', (req, res) => {
    controller.getUser()
})

export default router
