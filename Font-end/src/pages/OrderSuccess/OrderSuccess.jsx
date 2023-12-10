
import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'



import { convertPrice } from '../../utils';
import { orderContant } from '../../contant';



import { useLocation } from 'react-router-dom';


const OrderSuccess = () => {
  const location = useLocation()
  const {state} = location

console.log(state)
  return (
    <div style={{width: '100%', height: '100vh', background: '#f5f5fa'}}>
      <div style={{ width: '1270px', margin: '0 auto', height: 'auto'}}>
        <div style={{ display: 'flex', justifyContent: 'center' ,padding:'20px 0'}}>
          <h4 style={{fontSize: '15px'}}>Đặt hàng thành công</h4>
        </div>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{state?.fullName}</div>
              <div className='address-info'><span>Địa chỉ: </span> {`${state?.address} ${state?.city}`}</div>
              <div className='phone-info'><span>Điện thoại: </span> {state?.phone}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
              <div className='delivery-fee'><span>Phí giao hàng: </span> {convertPrice(state?.diliveryPriceMemo)}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[state?.payment]}</div>
              <div className='status-payment'>{state?.payment === 'paypal' ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        
        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '670px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Thành tiền</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          {state?.orders?.map((order) => {
            return (
              <WrapperProduct>
                <WrapperNameProduct>
                  <img src={order?.image} 
                    style={{
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px'
                    }}
                  />
                  <div style={{
                    width: '300px',
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px',
                    height: '70px',
                  }}>{order?.name}</div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem>{order?.amount}</WrapperItem>
                <WrapperItem>{convertPrice(order?.price*order?.amount)}</WrapperItem>
                <WrapperItem>{order?.discount ? convertPrice((order?.price*order?.amount )* order?.discount / 100) : '0 VND'}</WrapperItem>
                
              </WrapperProduct>
            )
          })}
          
          <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>{convertPrice(state?.priceMemo)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem>{convertPrice(state?.diliveryPriceMemo)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem><WrapperItem>{convertPrice(state?.totalPriceMemo)}</WrapperItem></WrapperItem>
          </WrapperAllPrice>
      </WrapperStyleContent>
      </div>
    </div>
  )
}

export default OrderSuccess