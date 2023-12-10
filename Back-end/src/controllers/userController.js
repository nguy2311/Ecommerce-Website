const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req,res) =>{
    try{
        const { name, email, password, confirmPassword, phone,sex,address } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if(!name|| !email|| !password|| !confirmPassword|| !phone|| !sex|| !address){
            return res.status(200).json({
                status : 'ERR',
                message : 'Thiếu đầu vào'
            })
        }
        else if(!isCheckEmail){
            return res.status(200).json({
                status : 'ERR',
                message: 'Vui lòng nhập dịa chỉ email'
            })
        }else if(confirmPassword != password){
            return res.status(200).json({
                status : 'ERR',
                message: 'Mật khẩu xác nhận không chính xác'
            })
        }
        // console.log('isCheckEmail',isCheckEmail)

        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Không có email hoặc mật khẩu'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập Email'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json({...newReponse, refresh_token})
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const changePassword = async (req,res) =>{
    try{
        const userID = req.params.id
        const data = req.body
        if(!userID){
            return res.status(200).json({
                status : 'ERR',
                message : 'Người dùng không tồn tại'
            })
        }
        const response = await UserService.changePassword(userID, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const updateUser = async (req,res) =>{
    try{
        const userID = req.params.id
        const data = req.body
        if(!userID){
            return res.status(200).json({
                status : 'ERR',
                message : 'The userID is required'
            })
        }

        const response = await UserService.updateUser(userID,data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}
const logoutUser = async (req,res) =>{
    try{
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status : 'OK',
            message : 'Logout successfully'
        })
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const deleteUser = async (req,res) =>{
    try{
        const userID = req.params.id
        if(!userID){
            return res.status(200).json({
                status : 'ERR',
                message : 'The userID is required'
            })
        }
        const response = await UserService.deleteUser(userID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllUser = async (req,res) =>{
    try{
        const response = await UserService.getAllUser()       
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}
const getDetailsUser = async (req,res) =>{
    try{
        const userID = req.params.id
        if(!userID){
            return res.status(200).json({
                status : 'ERR',
                message : 'The userID is required'
            })
        }
        const response = await UserService.getDetailsUser(userID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}

const refreshToken = async (req,res) =>{
    
    try{
        let token = req.headers.token.split(' ')[1]
        if(!token){
            return res.status(200).json({
                status : 'ERR',
                message : 'The userID is required'
            })
        }
        const response = await JwtService.refeshTokenJwtService(token)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message : e
        })
    }
}


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    deleteMany,
    changePassword
}