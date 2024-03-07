import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.getAll);

router.post('/categories/', categoryController.create);

router.put('/categories/:categoryId(\\d+)', categoryController.update);

router.delete('/categories/:categoryId(\\d+)', categoryController.deleteCategory);

export default router;