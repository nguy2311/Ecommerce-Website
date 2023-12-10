import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover} from 'antd';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserController from '../../controller/UserController.js'
import { resetUser} from '../../redux/slides/userSlide'
import Loading from '../../components/LoadingComponent/Loading'
import { searchProduct } from '../../redux/slides/productSlide.js';


  const DefaultComponent = ({isHiddenSearch = false, isHiddenCart = false}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userName, setuserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search,setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)
  const user = useSelector((state) => state.user)
  const [inputKey, setInputKey] = useState(Date.now());



  useEffect(() => {
    const updateUserInfo = async () => {
      setLoading(true);
      setUserAvatar(user?.avatar);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };
    setuserName(user?.name);
    updateUserInfo();
  }, [user]);

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setLoading(true)
    await UserController.logoutUser()
    dispatch(resetUser())
    navigate('/')
    setLoading(false)
  }
  const handleNavigateHome = async () => {
    navigate('/')
    setInputKey(Date.now())
    setSearch('')
    dispatch(searchProduct(''))
  }

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      {!user?.isAdmin &&(<WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>)}
      <WrapperContentPopup onClick={() => handleClickNavigate('change-password')}>Đổi mật khẩu</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'change-password') {
      navigate('/change-password')
    }else if(type === 'my-order') {
      navigate('/my-order',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onsearch = (value) => {
    navigate('/')
    setSearch(value)
    dispatch(searchProduct(value))
  }

  return (
    <div >
      <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenCart ?'space-between': 'unset'}}> 
        <Col span={5}>
          <WrapperTextHeader style={{cursor: 'pointer'}} onClick={handleNavigateHome}>NgoQuangHuy</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (        
          <Col span={13}>
          <ButtonInputSearch
            key={inputKey}
            size = "large"
            placeholder="Bạn cần tìm gì ?"
            textButton = "Tìm kiếm"
            border="false" 
            onSearch={onsearch}
          />
          </Col>
     )}   
        <Col span={6} style={{display : 'flex', gap: '54px', alignItems:'center'}}>
        <Loading isLoading={loading}>
          <WrapperHeaderAccout>
            {userAvatar ? (
              <img src={userAvatar} alt="avatar" style={{
                height: '50px',
                width: '50px',
                borderRadius: '50%',
                objectFit: 'cover'
              }} />
            ) : (
              <UserOutlined style={{ fontSize: '30px' }} />
            )}
          
            {userName?(
              <>              
              <Popover placement="bottom" content={content}  trigger="click" >
                <div style={{cursor: 'pointer'}}>{userName}</div>
              </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
              <WrapperTextHeaderSmall>
                Đăng nhập/Đăng ký
              </WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall>
                  Tài khoản
                </WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
            )}
            
          </WrapperHeaderAccout>
        </Loading>
        {!isHiddenCart && !user?.isAdmin &&(
          <div>
            <Badge count = {order?.orderItems.length} size='small'>
              <ShoppingCartOutlined onClick={() => navigate('/cart')} style={{fontSize: '32px',color: '#fff'}}/>
            </Badge>
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>        
          </div>
        )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default DefaultComponent