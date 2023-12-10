import { Menu } from 'antd'
import React, { useState } from 'react'
import { AppstoreOutlined, UserOutlined,ShoppingCartOutlined} from '@ant-design/icons';
import { getItem } from '../../utils';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
// import * as OrderController from '../../controller/OrderController'
// import * as ProductController from '../../controller/ProductController'
// import * as UserController from '../../controller/UserController'
// import Loading from '../../components/LoadingComponent/Loading';
// import { useSelector } from 'react-redux';
// import { useQueries } from '@tanstack/react-query';
// import { useMemo } from 'react';
// import CustomizedContent from './components/CustomizedContent';

const AdminPage = () => {
  // const user = useSelector((state) => state?.user)
  const [keySelected, setKeySelected] = useState('')
  const items = [
    getItem('Quản lý Người dùng', 'users', <UserOutlined />),
    getItem('Quản lý Sản phẩm', 'products', <AppstoreOutlined />),
    getItem('Quản lý Đơn hàng', 'orders', <ShoppingCartOutlined />),
  ];


  const renderPage = (key) => {
    switch (key) {
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      case 'orders':
        return (
          <AdminOrder />
        )
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex',overflowX: 'hidden' }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh'
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage