import { Router } from 'express'
import { createProduct, getProduct, updateProductbyId } from '../controllers/product.controller'

export const ProductRouter: Router = Router()

ProductRouter.post('/', createProduct)
ProductRouter.get('/', getProduct)
ProductRouter.get('/:id', getProduct)
ProductRouter.put('/:id', updateProductbyId)
