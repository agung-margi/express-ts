import express, { Router, Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { createProductValidation } from '../validations/product.validation'

export const ProductRouter: Router = express.Router()

ProductRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createProductValidation(req.body)
  if (error) {
    logger.error(`ERROR: product-create = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }
  logger.info('Product created successfully')
  res.status(201).send({ status: true, statusCode: 201, message: 'Product created successfully', data: value })
})

ProductRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('Fetching all products')
  res.status(200).send({
    status: true,
    statusCode: 200,
    message: 'Products fetched successfully',
    data: [
      { id: 1, name: 'Sepatu Lama', price: 100 },
      { id: 2, name: 'Sepatu Promo', price: 200 }
    ]
  })
})
