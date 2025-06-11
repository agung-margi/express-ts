import { Request, Response } from 'express'
import { createUserValidation } from '../validations/user.validation'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { hashPassword } from '../utils/hashing'
import { createUser } from '../services/user.service'

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
