import mongoose from 'mongoose'
import config from '../configs/environment'
import { logger } from './logger'

mongoose
  .connect(`${config.db}`)
  .then(() => {
    logger.info('Database connected successfully')
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${error.message}`)
    process.exit(1) // Exit the process with failure
  })
