import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style.js'
import InputForm from '../../components/InputFormComponent/InputForm.jsx'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.jsx'
import { useDispatch, useSelector } from 'react-redux'
import * as UserController from '../../controller/UserController.js'
import { useMutationHooks } from '../../hook/useMutationHook.js'
import * as message from '../../components/Message/Message.jsx'
import Loading from '../../components/LoadingComponent/Loading.jsx'
import { Button} from 'antd'
import { updateUser } from '../../redux/slides/userSlide.js'
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils.js'




const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [sex, setSex] = useState('')
  const [city, setCity] = useState('')
  const [avatar, setAvatar] = useState('')
  // const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)




  const dispatch = useDispatch()

  useEffect(() => {
    setEmail(user?.email)
    setName(user?.name)
    setPhone(user?.phone)
    setAddress(user?.address)
    setCity(user?.city)
    setSex(user?.sex)
    setAvatar(user?.avatar)
  },[user])


  const mutation = useMutationHooks(
        (data) => {
          const { id, access_token, ...rests } = data
          const res = UserController.updateUser(id, rests, access_token)
          return res
        }
    )

  const { isLoading, isSuccess, isError } = mutation



  useEffect(() => {
      const fetchData = async () => {
          if (isSuccess) {
              message.success();
              await handleGetDetailsUser(user?.id, user?.access_token);
          } else if (isError) {
              message.error();
          }
      };

      fetchData();
  }, [isSuccess, isError]);
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserController.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
}


const handleOnchangeEmail = (value) => {
    setEmail(value); 
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
  const handleOnchangeCity = (value) => {
    setCity(value); 
  }

  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
    }
    setAvatar(file.preview)
}
  const handleUpdate =()=>{
    mutation.mutate({id:user?.id,email,name,address,phone,sex,avatar,city, access_token: user?.access_token})
  }

  return (
    <div style={{width: '1000px', margin: '0 auto'}}>
        <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <Loading isLoading={isLoading}>
          <WrapperContentProfile>
            <WrapperInput>
              <WrapperLabel htmlFor='email'>Email</WrapperLabel>
              <InputForm style={{width: '300px'}} id ="email" 
              value={email} onChange={handleOnchangeEmail}/>            
            </WrapperInput>

            <WrapperInput>
              <WrapperLabel htmlFor='name'>Tên</WrapperLabel>
              <InputForm style={{width: '300px'}} id ="name" 
              value={name} onChange={handleOnchangeName}/>             
            </WrapperInput>

            <WrapperInput>
              <WrapperLabel htmlFor='sex'>Giới tính</WrapperLabel>
              <InputForm style={{width: '300px'}} id ="sex" 
              value={sex} onChange={handleOnchangeCSex}/>             
            </WrapperInput>

            <WrapperInput>
              <WrapperLabel htmlFor='phone'>Số điện thoại</WrapperLabel>
              <InputForm style={{width: '300px'}} id ="phone" 
              value={phone} onChange={handleOnchangePhone}/>            
            </WrapperInput>

            <WrapperInput>
              <WrapperLabel htmlFor='address'>Địa chỉ</WrapperLabel>
              <InputForm style={{width: '300px'}} id ="address" 
              value={address} onChange={handleOnchangeAddress}/>       
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel htmlFor='city'>Thành phố</WrapperLabel>
              <InputForm style={{width: '300px'}} id ="city" 
              value={city} onChange={handleOnchangeCity}/>            
            </WrapperInput>
            

            <WrapperInput>
              <WrapperLabel htmlFor='avatar'>Avatar</WrapperLabel>
              <WrapperUploadFile onChange ={handleOnchangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </WrapperUploadFile>
              {avatar && (
                <img src={avatar} style={{
                    height: '120px',
                    width: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                }} alt="avatar"/>
              )}     
            </WrapperInput>

            <ButtonComponent 
              onClick ={handleUpdate}
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

export default ProfilePage