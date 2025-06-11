import { Request, Response } from 'express'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validations/user.validation'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { comparePassword, hashPassword } from '../utils/hashing'
import { createUser, findUserByEmail } from '../services/user.service'
// import UserType from '../types/user.type'
import { signJWT, verifyJWT } from '../utils/jwt'

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()
  const { error, value } = createUserValidation(req.body)
  if (error) {
    logger.error(`ERROR: user-register = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    value.password = `${await hashPassword(value.password)}`
    // create user to database
    await createUser(value)
    logger.info('Successfully registered user')
    res.status(201).send({ status: true, statusCode: 201, message: 'Successfully registered user' })
  } catch (error) {
    logger.error(`ERROR: user-register = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error as string })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)

  if (error) {
    logger.error(`ERROR: user-create-session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    const user: any = await findUserByEmail(value.email)
    const isValid = await comparePassword(value.password, user.password)
    if (!user || !isValid) {
      logger.error('ERROR: user-create-session = Invalid email or password')
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid email or password' })
    }
    const { user_id: userId, email, name, role } = user

    const accessToken = signJWT({ userId, email, name, role }, { expiresIn: '5s' })
    const refreshToken = signJWT({ userId, email, name, role }, { expiresIn: '1w' })
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken
      }
    })
  } catch (error: any) {
    logger.error('ERROR: user-create-session = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)

  if (error) {
    logger.error(`ERROR: user-refresh-session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const { decoded } = verifyJWT(value.refresh_token)

    const user = await findUserByEmail(decoded._doc.email)
    if (!user) {
      return false
    }

    const accessToken = signJWT(
      {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      { expiresIn: '1h' }
    )
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Refresh session successful',
      data: {
        accessToken
      }
    })
  } catch (error: any) {
    logger.error('ERROR: user-refresh-session = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}
