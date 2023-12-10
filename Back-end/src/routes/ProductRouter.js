const express = require("express")
const ProductController = require('../controllers/ProductController')
const { authMiddleware} = require("../middleware/authMiddleware")
const router = express.Router()

router.post('/create', ProductController.createProduct)
router.put('/update-product/:id',authMiddleware,ProductController.updateProduct)
router.get('/details/:id',ProductController.getDetailsProduct)
router.delete('/delete-product/:id',ProductController.deleteProduct)
router.get('/get-all-product',ProductController.getAllProduct)
router.post('/delete-many',authMiddleware,ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllType)


module.exports = router