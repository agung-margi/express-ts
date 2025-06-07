import { Request, Response } from 'express'
import { createProductValidation } from '../validations/product.validation'
import { logger } from '../utils/logger'
import { addProduct, getAllProduct, getProductById } from '../services/product.service'
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

// export const updateProduct = async (req: Request, res: Response) => {
//   console.log('Handler masuk') // 👈 ini log awal

//   const {
//     params: { id }
//   } = req

//   console.log(`Received request to update product with ID: ${id}`)

//   console.log('Body:', req.body)
//   //   const { error, value } = createProductValidation(req.body)

//   // if (error) {
//   //   logger.error(`ERROR: product-create = ${error.details[0].message}`)
//   //     return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
//   //   }
//   //   try {
//   //     console.log(`Updating product with ID: ${id} with data:`, value)
//   //     // await updateProductById(id, value)
//   //     logger.info('Product updated successfully')
//   //     res.status(201).send({ status: true, statusCode: 201, message: 'Product created successfully' })
//   //   } catch (error) {}
// }
