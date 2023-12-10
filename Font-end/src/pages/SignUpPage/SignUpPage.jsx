import React, { useCallback, useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style'
import InputForm from '../../components/InputFormComponent/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.png'
import { Image, Select} from 'antd'
import {
  EyeFilled,EyeInvisibleFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hook/useMutationHook'
import * as UserServices from '../../controller/UserController'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'


const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const navigate = useNavigate()
  const handleNavigateLogin = useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('Giới tính');

  const mutation = useMutationHooks(
    data => UserServices.signupUser(data)
  )
  const handleOnchangeEmail = (value) => {
    setEmail(value); 
  }
  const handleOnchangePassword = (value) => {
    setPassword(value); 
  }
  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value); 
  }
  const handleOnchangeName = (value) => {
    setName(value); 
  }
  const handleOnchangeAddress = (value) => {
    setAddress(value); 
  }
  const handleOnchangePhone = (value) => {
    setPhone(value); 
  }
  const handleOnchangeCSex = (value) => {
    setSex(value); 
  }

  const { data, isLoading, isSuccess, isError } = mutation
  
  useEffect(() => {
    if (isSuccess && data?.status !=='ERR') {
      message.success()
      handleNavigateLogin()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError, data?.status, handleNavigateLogin])

  const handleNavigateSignup =()=>{
    mutation.mutate({
      email, 
      password,
      confirmPassword,
      name,
      address,
      phone,
      sex
    })
  }

  
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center',background : 'rgba(0,0,0,0.53',height : '100vh'}}>
      <div style={{display:'flex', width : '800px', height:'600px', borderRadius : '6px', background:'#fff'}}>
      <WrapperContainerLeft>
        <h1>Xin chào</h1>
        <p>Đăng nhập và tạo tài khoản</p>
        <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
        

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
            placeholder="confirm password"
            type={isShowPassword ? "text" : "password"}
            value={confirmPassword} onChange={handleOnchangeConfirmPassword}
          />
        </div>
        <InputForm style={{ marginTop: '10px' }} placeholder="Họ và tên"  value={name} onChange={handleOnchangeName}/>

        <InputForm style={{ marginTop: '10px' }} placeholder="Địa chỉ"  value={address} onChange={handleOnchangeAddress}/> 

        <InputForm style={{ marginTop: '10px' }} placeholder="Số điện thoại"  value={phone} onChange={handleOnchangePhone}/> 

        <Select
          style={{ width: 120,marginTop: '10px' }}
          placeholder="Giới tính"
          name="sex"
          value={sex}
          onChange={handleOnchangeCSex}
          options={[ 
            { value: 'Nam', label: 'Nam'},
            { value: 'Nữ', label: 'Nữ'},
            { value: 'Khác', label : 'Khác' },]}
          />
        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
          <ButtonComponent 
            disabled={!email|| !password|| !confirmPassword|| !name|| !address|| !phone|| !sex}
            onClick = {handleNavigateSignup}
            size={20} 
            styleButton={{
                background : 'rgb(255,66,78)',
                height : '48px',
                width : '100%',
                border : 'none',
                borderRadius : '15px',
                margin :'26px 0 10px'
            }}

            textButton = 'Đăng ký'
            styleTextButton={{color : '#fff'}}
            ></ButtonComponent>
          </Loading>
        
        <p>Bạn đã có tài khoản?
          <WrapperTextLight onClick={handleNavigateLogin}>Đăng nhập</WrapperTextLight>
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

export default SignUpPage