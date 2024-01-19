import express, { Request, Response } from 'express'
const router = express.Router()
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import {getTrendyProducts,rateProduct,getRateAndReview,getSpecificProduct,handPicked} from '../controllers/productController'


router.get('/trendy', getTrendyProducts)

router.get('/handpicked',handPicked);
router.get('/:productID' , getSpecificProduct);
router.post('/rate/:productID',sessionMiddleware,rateProduct);
router.get('/ratings-and-reviews/:productID', getRateAndReview)

export default router