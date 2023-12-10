import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput} from './style.js'
import InputForm from '../../components/InputFormComponent/InputForm.jsx'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.jsx'
import { useSelector } from 'react-redux'
import * as UserController from '../../controller/UserController.js'
import { useMutationHooks } from '../../hook/useMutationHook.js'
import * as message from '../../components/Message/Message.jsx'
import Loading from '../../components/LoadingComponent/Loading.jsx'

import {
  EyeFilled,EyeInvisibleFilled
} from '@ant-design/icons'

import { useNavigate } from 'react-router-dom';



const ChangePassword = () => {
  const user = useSelector((state) => state.user)
  const [password, setPassword] = useState(''); 
  const [resetPassword, setResetPassword] = useState(''); 
  const [confirmResetPassword, setConfirmResetPassword] = useState(''); 
  const [avatar, setAvatar] = useState('')
  // const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)

  const navigate = useNavigate();



  useEffect(() => {
    setAvatar(user?.avatar)
  },[user])

  const handleOnchangePassword = (value) => {
    setPassword(value); 
  }
  const handleOnchangeRestPassword = (value) => {
    setResetPassword(value); 
  }
  const handleOnchangeConfirmRestPassword = (value) => {
    setConfirmResetPassword(value); 
  }


  const mutation = useMutationHooks(
        (data) => {
          const { id, access_token, ...rests } = data
          const res = UserController.ChangePassword(id, rests, access_token)
          return res
        }
    )

  const { data, isLoading, isSuccess, isError } = mutation

  console.log('mutation',mutation)

  useEffect(() => {
      const fetchData = async () => {
          if (isSuccess && data.status === 'OK') {
              message.success(data.message);
              navigate('/')
          } else if (isSuccess && data.status === 'ERR') {
              message.error(data.message);
          }
      };
      fetchData();
  }, [isSuccess, isError]);

  const handleUpdatePass =()=>{
    mutation.mutate({id:user?.id,password,resetPassword, confirmResetPassword, access_token: user?.access_token})
  }

  return (
    <div style={{width: '1000px', margin: '0 auto'}}>
        <WrapperHeader>Đổi mật khẩu</WrapperHeader>
        <Loading isLoading={isLoading}>
          <WrapperContentProfile>
            <WrapperInput>
              {avatar && (
                <img src={avatar} style={{
                    height: '200px',
                    width: '200px',
                    borderRadius: '50%',

                    objectFit: 'cover'
                }} alt="avatar"/>
              )}     
            </WrapperInput>
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
              placeholder="Mật khẩu"
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
              placeholder="Mật khẩu mới"
              type={isShowPassword ? "text" : "password"}
              value={resetPassword} onChange={handleOnchangeRestPassword}
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
              placeholder="Nhập lại mật khẩu mới"
              type={isShowPassword ? "text" : "password"}
              value={confirmResetPassword} onChange={handleOnchangeConfirmRestPassword}
            />
          </div>

            <ButtonComponent 
              onClick = {handleUpdatePass}
              size={20} 
              styleButton={{
                  marginleft : '300px',
                  background : '#fff',
                  height : '30px',
                  width : 'fit-content',
                  border : '1px solid rgb(255,66,78)',
                  borderRadius : '15px',
              }}
              textButton = 'Cập nhật'
              styleTextButton={{color : 'rgb(255,66,78)'}}
            ></ButtonComponent>
          </WrapperContentProfile>
        </Loading>
    </div>
  )
}

export default ChangePassword