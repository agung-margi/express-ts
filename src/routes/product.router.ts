import { Router } from 'express'
import { createProduct, deleteProduct, getProduct, updateProductbyId } from '../controllers/product.controller'
import { requireAdmin } from '../middleware/auth'

export const ProductRouter: Router = Router()

ProductRouter.post('/', requireAdmin, createProduct)
ProductRouter.get('/', getProduct)
ProductRouter.get('/:id', getProduct)
ProductRouter.put('/:id', updateProductbyId)
ProductRouter.delete('/:id', deleteProduct)
