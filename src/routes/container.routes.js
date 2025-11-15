import { Router } from 'express'
import { ContainerController } from '../controllers/container.controller.js'

const router = Router()
const controller = new ContainerController()

router.post('/', (req, res) => {
    controller.createContainer(req, res)
})

router.get('/', (req, res) => {
    controller.getContainers(req, res)
})

router.get('/:id', (req, res) => {
    controller.getContainer(req, res)
})

router.delete('/:id', (req, res) => {
    controller.deleteContainer(req, res)
})

router.post('/:id/start', (req, res) => {
    controller.startContainer(req, res)
})

router.post('/:id/stop', (req, res) => {
    controller.stopContainer(req, res)
})

router.post('/:id/restart', (req, res) => {
    controller.restartContainer(req, res)
})

router.get('/stats/live', (req, res) => {
    controller.getStats(req, res)
})

export default router
