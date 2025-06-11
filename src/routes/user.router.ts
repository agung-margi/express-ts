import { Router } from 'express'
import { registerUser } from '../controllers/user.controller'

export const UserRouter: Router = Router()
UserRouter.post('/', registerUser)
