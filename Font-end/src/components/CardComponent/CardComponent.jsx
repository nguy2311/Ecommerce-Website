
import React from 'react'
import { StyleNameProduct, StyleTypeProduct, WrapperCardStyle, WrapperDiscountProduct, WrapperPriceProduct } from './style';
import { useNavigate } from 'react-router-dom'


const CardComponent = (props) => {
  const {name,type,price,discount,image,id} = props;
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
  return (
    <>
    <WrapperCardStyle
        hoverable
        bodyStyle={{padding:'10px' }}
        cover={<img alt="example" src={image} />}
        onClick={() => handleDetailsProduct(id)}
    >
        <StyleTypeProduct>{type}</StyleTypeProduct>
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperPriceProduct>
            {price.toLocaleString()} VNĐ
                <WrapperDiscountProduct>
                    -{discount}%
                </WrapperDiscountProduct>
        </WrapperPriceProduct>
    </WrapperCardStyle>

    </>
  )
}

export default CardComponent