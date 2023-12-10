
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailComponent/styles';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { increaseAmount,decreaseAmount,removeCartProduct,selectedCart,removeAllCartProduct } from '../../redux/slides/cartSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';

import * as message from '../../components/Message/Message'
import * as ProductController from '../../controller/ProductController'

import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepConponent/StepComponent';

const CartPage = () => {
  const cart = useSelector((state) => state.cart)


  const [listChecked, setListChecked] = useState([])

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if(type === 'increase') {
      if(!limited) {
        dispatch(increaseAmount({idProduct}))
      }
    }else {
      if(!limited) {
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeCartProduct({idProduct}))
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      cart?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedCart({listChecked}))
  },[listChecked])

  const priceMemo = useMemo(() => {
    const result = cart?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[cart])

  const priceDiscountMemo = useMemo(() => {
  const result = cart?.orderItemsSlected?.reduce((total, cur) => {
    const totalDiscount = cur.discount ? cur.discount : 0
    return total + ((cur.price * cur.amount) * (totalDiscount) / 100)
  },0)
  if(Number(result)){
    return result
  }
  return 0
},[cart])


  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo >= 20000 && priceMemo < 500000){
      return 10000
    }else if(priceMemo >= 500000 || cart?.orderItemsSlected?.length === 0) {
      return 0
    } else {
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllCartProduct({listChecked}))
    }
  }

  const handleAddCard = async () => {
  if(!cart?.orderItemsSlected?.length) {
    message.error('Vui lòng chọn sản phẩm')
  } else {
    let allProductsExist = true;
    const cartLength = cart.orderItemsSlected.length;
    for(let i = 0; i < cartLength; i++) {
      const productCheck = await ProductController.getDetailsProduct(cart.orderItemsSlected[i].product);
      if(productCheck.status === 'ERR') {
        allProductsExist = false;
        message.error(`Sản phẩm ${cart.orderItemsSlected[i].name} không còn tồn tại`);
        handleDeleteOrder(cart.orderItemsSlected[i].product)
      }

    }
    if(allProductsExist) {
      navigate('/order')
    }
  } 
}

  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: 'Free ship',
      description : 'Trên 500.000 VND',
    },
  ]
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: 'auto', padding:'20px 0'}}>
      <div style={{height: '100%', width: 'auto', margin: '0 auto'}}>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <h3 style={{fontSize: '20px', paddingBottom : '20px'}}>Giỏ hàng</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <h4>Phí giao hàng</h4>
            <WrapperStyleHeaderDilivery>
              <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000 
                ? 2 : diliveryPriceMemo === 20000 ? 1 
                : cart.orderItemsSlected.length === 0 ? 0:  3}/>
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '370px'}}>
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === cart?.orderItems?.length}></CustomCheckbox>
                  <span> Tất cả ({cart?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Giảm giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {cart?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                <div style={{width: '370px', display: 'flex', alignItems: 'center', gap: 4}}> 
                  <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                  <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>{order?.name}</div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                  </span>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>{order?.discount}%</span>
                  </span>
                  <WrapperCountOrder>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',order?.product, order?.amount === 1)}>
                        <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                    <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',order?.product ,order?.amount === order.countInstock, order?.amount === 1)}>
                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                    </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.price * order?.amount)}</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
                </div>
              </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding:'5px 0'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding:'5px 0'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding:'5px 0'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(diliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent 
                size={20} 
                styleButton={{
                    background : 'rgb(255,66,78)',
                    height : '48px',
                    width : '150px',
                    border : 'none',
                    borderRadius : '15px'
                }}
                onClick = {() => handleAddCard()}
                textButton = 'Mua hàng'
                styleTextButton={{color : '#fff'}}
            ></ButtonComponent>
            
          </WrapperRight>
        </div>
      </div>
    </div>
  )
}

export default CartPage