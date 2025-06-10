import { Request, Response } from 'express'
import { createProductValidation, updateProductValidation } from '../validations/product.validation'
import { logger } from '../utils/logger'
import {
  addProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProductById
} from '../services/product.service'
// import ProductType from '../types/product.type'
import { v4 as uuidv4 } from 'uuid'

export const createProduct = async (req: Request, res: Response) => {
  req.body.product_id = uuidv4()
  const { error, value } = createProductValidation(req.body)
  if (error) {
    logger.error(`ERROR: product-create = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    await addProduct(value)
    logger.info('Product created successfully')
    res.status(201).send({ status: true, statusCode: 201, message: 'Product created successfully' })
  } catch (error) {
    logger.error(`ERROR: product-create = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: (error as any).message })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  if (id) {
    const product = await getProductById(id)
    if (!product) {
      logger.error(`ERROR: product-get = Product with ID ${id} not found`)
      return res.status(404).send({ status: false, statusCode: 404, message: 'Product not found', data: {} })
    }
    res.status(200).send({ status: true, statusCode: 200, data: product })
    logger.info('Successfully fetched product')
  } else {
    const products = await getAllProduct()
    logger.info('Successfully fetched products')
    return res.status(200).send({ status: true, statusCode: 200, data: products })
  }
}

export const updateProductbyId = async (req: Request, res: Response) => {
  console.log('Handler masuk') // 👈 ini log awal

  const {
    params: { id }
  } = req
  const { error, value } = updateProductValidation(req.body)

  if (error) {
    logger.error(`ERROR: product-update = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    await updateProductById(id, value)
    logger.info('Product updated successfully')
    res.status(200).send({ status: true, statusCode: 200, message: 'Product updated successfully' })
  } catch (error) {
    logger.error(`ERROR: product-update = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error as any })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  try {
    const result = await deleteProductById(id)
    if (result) {
      logger.info('Delete Product Successfully')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Delete Product Successfully' })
    } else {
      logger.error(`ERROR: product-delete = Product with ID ${id} not found`)
      return res.status(404).send({ status: false, statusCode: 404, message: 'Product not found' })
    }
  } catch (error) {
    logger.error(`ERROR: product-delete = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: (error as any).message })
  }
}
