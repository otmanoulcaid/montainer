import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const router = Router()
const controller = new AuthController()

router.post('/login', (req, res) => {
    controller.login(req, res);
})
router.post('/logout', (req, res) => {
    controller.logout(req, res);
})
router.get('/me', (req, res) => {
    controller.me(req, res);
})

export default router
