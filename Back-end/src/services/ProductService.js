const Product = require("../models/ProductModel")




const createProduct = (newProduct)=>{
    return new Promise(async(resolve,reject) =>{

        const { name, manufacturer, image, type, price, countInStock,description,discount,colour,memory,ram,chip,gpu,camera,battery,weight} = newProduct

        try{
            const checkProduct = await Product.findOne({
                name: name
            })
            if(checkProduct != null){
                resolve({
                    status : 'ERR',
                    message: 'Sản phẩm đã tồn tại'
                })
            }
            
            const createdProduct = await Product.create({
                name, 
                manufacturer, 
                image, 
                type, 
                price, 
                countInStock,
                description,
                discount,
                colour,
                memory, 
                ram,
                chip,
                camera,
                battery,
                gpu,
                weight
            })
            if(createdProduct){
                resolve({
                    status : "OK",
                    message : "SUCCESS",
                    data : createdProduct
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data : product

            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS',

            })
        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({_id : ids})
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit ,page,sort, filter ) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count()
            let allProduct = []
            if (filter) {
                const label = filter[0];
                const totalProductFillter = (await Product.find({[label]: { $regex: new RegExp(filter[1], 'i') }})).length
                const allObjectFilter = await Product.find({
                    [label]: { $regex: new RegExp(filter[1], 'i') }
                    }).limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 })
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProductFillter,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProductFillter / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit) {
                allProduct = await Product.find().sort({createdAt: -1, updatedAt: -1})
            }else {
                allProduct = await Product.find().limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}