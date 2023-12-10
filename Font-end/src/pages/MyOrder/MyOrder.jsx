import React,{ useEffect} from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderController from '../../controller/OrderController'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hook/useMutationHook';
import * as message from '../../components/Message/Message'

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
    const res = await OrderController.getOrderByUserId(state?.id, state?.token)
    return res.data
  }
  const user = useSelector((state) => state.user)

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: state?.id && state?.token
  })
  const { isLoading, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }
  const mutationDelivered = useMutationHooks(
    async (data) => {
      const { id, access_token, ...rests } = data

      const res = await OrderController.updateOrder(id,rests, access_token)

      return res
    }
  );
  const mutation = useMutationHooks(
    async (data) => {
      const { id, token , orderItems, userId } = data
      const res = await OrderController.cancelOrder(id, token,orderItems, userId)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({id : order._id, token:state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }
  const handleDelivered = (id)=>{
    const deliveredAt = new Date();
    mutationDelivered.mutate({id:id, access_token: state?.token, isDelivered : true, isPaid : true, deliveredAt: deliveredAt.toISOString()},{
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }
  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation
  const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, data: dataUpdate } = mutationDelivered

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success('Hủy đơn hàng thành công')
    } else if(isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancle) {
      message.error('Hủy đơn hàng thất bại')
    }
  }, [isErrorCancle, isSuccessCancel])

  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === 'OK') {
      message.success('Bạn đã nhận đơn hàng')
    } else if(isSuccessUpdate && dataUpdate?.status === 'ERR') {
      message.error(dataUpdate?.message)
    }else if (isErrorUpdate) {
      message.error('Nhận hàng thất bại')
    }
  }, [isSuccessUpdate, isErrorUpdate])

  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?._id}> 
              <img src={order?.image} 
                style={{
                  width: '70px', 
                  height: '70px', 
                  objectFit: 'cover',
                  border: '1px solid rgb(238, 238, 238)',
                  padding: '2px',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                width: '400px',
                overflow: 'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap',
                marginLeft: '10px'
              }}>{order?.name}</div>
              <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>Số lượng : {order?.amount}</span>
              <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>Giá : {convertPrice(order?.price)}</span>
            </WrapperHeaderItem>
          })
  }


  return (
    <Loading isLoading={isLoading || isLoadingCancel || isLoadingUpdate}>
      <WrapperContainer>
        <div style={{height: '100%', width: 'auto', margin: '0 auto', padding : '20px 0'}}>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <h4 style={{fontSize: '15px'}}>Đơn hàng của tôi</h4>
        </div>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div style={{padding:'15px 0'}}>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                      <span style={{fontWeight: 'bold', color:'rgb(255, 66, 78)'}}>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</span>
                    </div>
                     <div style={{padding:'15px 0'}}>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                      <span style={{fontWeight: 'bold', color:'rgb(255, 66, 78)' }}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
                    </div>
                  </WrapperStatus>
                    {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(255, 66, 78)',fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>

                      {!order?.isDelivered && (<ButtonComponent 
                        onClick={() => handleCanceOrder(order)}
                        size={40} 
                        styleButton={{
                            background : '#fff',
                            height : '36px',
                            width : 'auto',
                            border : '1px solid rgb(255,66,78)',
                            borderRadius : '15px'
                        }}
                        textButton = {'Hủy đơn hàng'}
                        styleTextButton={{color : 'rgb(255,66,78)'}}
                    ></ButtonComponent>)}
                    {!order?.isDelivered &&(<ButtonComponent 
                        onClick={() => handleDelivered(order?._id)}
                        size={40} 
                        styleButton={{
                            background : '#1677ff',
                            height : '36px',
                            width : 'auto',

                            borderRadius : '15px'
                        }}
                        textButton = {'Đã nhận hàng'}
                        styleTextButton={{color : '#fff'}}
                    ></ButtonComponent>)}
                    <ButtonComponent 
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40} 
                        styleButton={{
                            background : 'rgb(255,66,78)',
                            height : '36px',
                            width : 'auto',
                            borderRadius : '15px'
                        }}
                        textButton = {'Xem chi tiết'}
                        styleTextButton={{color : '#fff'}}
                    ></ButtonComponent>
                    
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage