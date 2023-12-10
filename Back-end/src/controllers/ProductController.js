const ProductService = require('../services/ProductService')
const JwtService = require('../services/JwtService')

const createProduct = async (req,res) =>{
    try{
        const { name, manufacturer, image, type, price, countInStock,description,discount,colour,memory,ram,chip,gpu,camera,battery,weight} = req.body;

        if(!name|| !manufacturer|| !image|| !type|| !price || !countInStock ||  !discount || !colour || !weight){
            return res.status(404).json({
                status : 'ERR',
                message : 'Thiếu thông tin'
            })
        }


        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}


const updateProduct = async (req,res) =>{
    try{
        const productID = req.params.id
        const data = req.body
        if(!productID){
            return res.status(404).json({
                status : 'ERR',
                message : 'Sản phẩm đã tồn tại'
            })
        }

        const response = await ProductService.updateProduct(productID,data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const getDetailsProduct = async (req,res) =>{
    try{
        const productID = req.params.id
        if(!productID){
            return res.status(200).json({
                status : 'ERR',
                message : 'The productID is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const deleteProduct = async (req,res) =>{
    try{
        const productID = req.params.id
        if(!productID){
            return res.status(200).json({
                status : 'ERR',
                message : 'The userID is required'
            })
        }
        const response = await ProductService.deleteProduct(productID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}
const deleteMany = async (req,res) =>{
    try{
        const ids = req.body.ids
        if(!ids){
            return res.status(200).json({
                status : 'ERR',
                message : 'The ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const getAllProduct = async (req,res) =>{
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
}