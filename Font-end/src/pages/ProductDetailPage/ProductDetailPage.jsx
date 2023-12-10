import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
    <div style={{padding:'10px 120px', background:'#efefef'}}>
      <h5 span style={{cursor: 'pointer', fontSize:'13px', fontFamily: 'inherit'}} onClick={() => {navigate('/')}}>Trang chủ - Chi tiết sản phẩm </h5>
      <ProductDetailComponent idProduct={id}/>
    </div>
  )
}

export default ProductDetailPage