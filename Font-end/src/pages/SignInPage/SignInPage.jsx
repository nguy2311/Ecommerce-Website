import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputFormComponent/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import {EyeFilled,EyeInvisibleFilled} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

import * as UserServices from '../../controller/UserController'
import { useMutationHooks } from '../../hook/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const dispatch = useDispatch();
  
  
  const mutation = useMutationHooks(
    data => UserServices.loginUser(data)
  )
  const { data, isLoading, isSuccess } = mutation




  useEffect(() => {
    if (isSuccess && data?.status !=='ERR') {
      if(location?.state) {
        navigate(location?.state)
      }else {
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token);
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id,data?.access_token)
        }
      }
    }
  }, [isSuccess])
  
  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserServices.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token,refreshToken }))
  }


  const handleNavigateSignUp =() => {
    navigate('/sign-up')
  }


  const handleOnchangeEmail = (value) => {
    setEmail(value); 
  }
  const handleOnchangePassword = (value) => {
    setPassword(value); 
  }
  const handleNavigateSignin =()=>{
    mutation.mutate({
      email,
      password
    })
  }

  
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center',background : 'rgba(0,0,0,0.53',height : '100vh'}}>
      <div style={{display:'flex', width : '800px', height:'445px', borderRadius : '6px', background:'#fff'}}>
      <WrapperContainerLeft>
        <h1>Xin chào</h1>
        <p>Đăng nhập và tạo tài khoản</p>
        <InputForm style ={{marginBottom : '10px'}} placeholder ="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
        <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password} onChange={handleOnchangePassword}
            />
          </div>
        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
        <Loading isLoading={isLoading}>
          <ButtonComponent 
              disabled={!email|| !password}
              onClick = {handleNavigateSignin}
              size={20} 
              styleButton={{
                background : 'rgb(255,66,78)',
                height : '48px',
                width : '100%',
                border : 'none',
                borderRadius : '15px',
                margin :'26px 0 10px'
              }}
              
              textButton = 'Đăng nhập'
              styleTextButton={{color : '#fff'}}
          ></ButtonComponent>
        </Loading>
          
        
        
      <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
      <p>Chưa có tài khoản?
        <WrapperTextLight onClick={handleNavigateSignUp} >Tạo tài khoản</WrapperTextLight>
      </p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imageLogo} preview = {false} alt = 'image-logo' height='203px' width = '203px'/>
        <h4>Mua sắm ở NQH</h4>
      </WrapperContainerRight>
    </div>
    </div>
  
  )
}

export default SignInPage