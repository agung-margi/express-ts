import { Router } from 'express'
import { createSession, registerUser, refreshSession } from '../controllers/user.controller'

export const UserRouter: Router = Router()
UserRouter.post('/', registerUser)
UserRouter.post('/login', createSession)
UserRouter.post('/refresh', refreshSession)
