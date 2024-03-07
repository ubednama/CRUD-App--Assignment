import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.post('/products/', productController.create);

router.get('/products', productController.findAll);

router.get('/:categoryId/products', productController.getAllByCategoryId);

router.put('/products/:productId', productController.update);

router.delete('/products/:productId', productController.deleteProduct);

export default router;