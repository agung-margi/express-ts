import { logger } from '../utils/logger'
import productModel from '../models/product.model'
import ProductType from '../types/product.type'

export const addProduct = async (payload: ProductType) => {
  return await productModel.create(payload)
}

export const getAllProduct = async () => {
  // return await supaya datanya terambil dari database
  return await productModel
    .find()
    .then((data) => {
      return data
    })
    .catch((error) => {
      logger.info(`ERROR: product-get = ${error.message}`)
    })
}

export const getProductById = async (id: string) => {
  if (!id) {
    throw new Error('Product ID is required')
  } else {
    return await productModel.findOne({ product_id: id })
  }
}
export const updateProductById = async (id: string, payload: ProductType) => {
  if (!id) {
    throw new Error('Product ID is required')
  }
  return await productModel.findOneAndUpdate({ product_id: id }, { $set: payload })
}
