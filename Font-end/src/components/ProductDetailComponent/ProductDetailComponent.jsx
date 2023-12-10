import React, { useEffect, useState } from 'react'
import { Col, Image, Row} from 'antd'

import { Comment, LabelIn4, ProductDes, ProductDetail, ProductIn4, ProductIn4Label, WrapperAddressProduct, 
    WrapperDiscountProduct, 
    WrapperInputNumber, 
    WrapperNameProduct, WrapperPriceProduct, 
    WrapperPriceTextProduct, WrapperQualityProduct, 
    WrapperStatusProduct } from './styles'
import { PlusOutlined,MinusOutlined  } from '@ant-design/icons';
import { addCartProduct,resetCart } from '../../redux/slides/cartSlide'
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductController from '../../controller/ProductController'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../LoadingComponent/Loading'
import { useLocation, useNavigate } from 'react-router-dom'
import * as message from '../Message/Message'
import { convertPrice, initFacebookSDK } from '../../utils'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'

const ProductDetailComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.cart)
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onChange = (value) => { 
        setNumProduct(Number(value))
    }
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id) {
            const res = await ProductController.getDetailsProduct(id)
            return res.data
        }
    }
    useEffect(() => {
            initFacebookSDK()
        }, [])

    useEffect(() => {
        if(errorLimitOrder) {
            message.error('Số lượng sản phẩm trong kho không đủ')
        }
    }, [errorLimitOrder])
    useEffect(() => {
        if(order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetCart())
        }
    }, [order.isSucessOrder])
    
    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})
    const handleChangeCount = (type, limited) => {
        if(type === 'increase') {
            if(!limited) {
                setNumProduct(numProduct + 1)
            }
        }else {
            if(!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }
    const handleAddToCart = () => {
        if(!user?.id) {
            navigate('/sign-in', {state: location?.pathname})
        }else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addCartProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else if (!orderRedux && productDetails?.countInStock === 0) {
            setErrorLimitOrder(true);
        } else if (orderRedux && (orderRedux.amount + numProduct) > orderRedux.countInstock) {
            setErrorLimitOrder(true);
        }
    }
}

    return (
        <Loading isLoading={isLoading}>
        <Row style={{padding:'16px', background : '#fff', borderRadius : '4px'}}>
            <Col span={10} style={{borderRight : '1px solid #e5e5e5', paddingRight : '8px'}}>
                <Image style={{maxWidth :'100%', height : 'auto'}} src={productDetails?.image} alt = "Image product" preview = {false}/>
                <Row style={{paddingTop : '10px', justifyContent :'space-between'}}>                   
                </Row>
            </Col>
            <Col span={14} style={{paddingLeft : '10px', height : 'auto'}}>
                <WrapperNameProduct>{productDetails?.name}</WrapperNameProduct>
                <WrapperStatusProduct>{productDetails?.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}</WrapperStatusProduct>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>
                        {convertPrice(productDetails?.price)}
                    </WrapperPriceTextProduct>
                    <WrapperDiscountProduct>
                        -{productDetails?.discount}%
                    </WrapperDiscountProduct>
                </WrapperPriceProduct>
            {!user?.isAdmin && (<WrapperAddressProduct>
                <span>
                    Giao đến 
                </span>
                <span className='address'>
                    {user?.address}
                </span>
                <span className='changeAddress' onClick={()=> navigate('/profile')} style={{cursor: 'pointer'}}>
                    Đổi địa chỉ
                </span>

            </WrapperAddressProduct>)}

            <LikeButtonComponent
                     dataHref={ process.env.REACT_APP_IS_LOCAL 
                                ? "https://developers.facebook.com/docs/plugins/" 
                                : window.location.href
                            } 
                    />

            {!user?.isAdmin && (<div style={{margin : '10px 0 20px',padding: '10px 0' ,borderTop :'1px solid #e5e5e5',borderBottom :'1px solid #e5e5e5' }}>
                <div style={{marginBottom : '12px'}}>Số lượng</div>
                <WrapperQualityProduct>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',numProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '15px' }} />
                    </button>
                    <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
                                <PlusOutlined style={{ color: '#000', fontSize: '15px' }} />
                    </button>
                </WrapperQualityProduct>
            </div>)}
            
            {!user?.isAdmin && (<div style={{display : 'flex', alignItems :'center', gap : '12px'}}>
                <ButtonComponent 
                    size={20} 
                    styleButton={{
                        background : 'rgb(255,66,78)',
                        height : '48px',
                        width : '150px',
                        border : 'none',
                        borderRadius : '15px'
                    }}
                    onClick={handleAddToCart}
                    textButton = 'Thêm vào giỏ hàng'
                    styleTextButton={{color : '#fff'}}

                ></ButtonComponent>
            </div>)}
        </Col>
        </Row>
        <ProductDetail> 
            <section>
                <LabelIn4>Thông tin sản phẩm</LabelIn4>
                <div style={{'margin': '1.875rem 0.9375rem 0.9375rem', 'display': 'block'}}>
                    <ProductIn4>
                        <ProductIn4Label>Loại sản phẩm</ProductIn4Label>
                        <div style={{'display': 'block'}}>
                            {productDetails?.type}
                        </div>
                    </ProductIn4>
                    <ProductIn4>
                        <ProductIn4Label>Hãng sản xuất</ProductIn4Label>
                        <div style={{'display': 'block'}}>
                            {productDetails?.manufacturer}
                        </div>
                    </ProductIn4>
                    <ProductIn4>
                        <ProductIn4Label>Kho hàng</ProductIn4Label>
                        <div style={{'display': 'block'}}>
                            {productDetails?.countInStock}
                        </div>
                    </ProductIn4>
                    <ProductIn4>
                        <ProductIn4Label>Màu sắc</ProductIn4Label>
                        <div style={{'display': 'block'}}>
                            {productDetails?.colour}
                        </div>
                    </ProductIn4>
                </div>
            </section>  
            <section>
                <LabelIn4>Cấu hình</LabelIn4>
                <div style={{'margin': '1.875rem 0.9375rem 0.9375rem', 'display': 'block'}}>
                    {productDetails?.chip && (<ProductIn4>
                        <ProductIn4Label>Bộ xử lí (chip)</ProductIn4Label>
                        <div style={{'display': 'block'}}>
                            {productDetails?.chip}
                        </div>
                    </ProductIn4>)}
                    {productDetails?.gpu && (<ProductIn4>
                        <ProductIn4Label>GPU</ProductIn4Label>
                        <div style={{ display: 'block' }}>{productDetails.gpu}</div>
                    </ProductIn4>)}
                    {productDetails?.memory &&(<ProductIn4>
                        <ProductIn4Label>Bộ nhớ</ProductIn4Label>
                            <div style={{ display: 'block' }}>{productDetails?.memory}Gb</div>
                    </ProductIn4>)}
                    {productDetails?.ram &&(<ProductIn4>
                        <ProductIn4Label>Ram</ProductIn4Label>
                        { <div style={{ display: 'block' }}>
                            {productDetails?.ram}Gb
                        </div>}
                    </ProductIn4>)}
                    {productDetails?.camera && (<ProductIn4>
                        <ProductIn4Label>Camera</ProductIn4Label>
                        <div style={{ display: 'block' }}>
                            {productDetails?.camera}Mp
                        </div>
                    </ProductIn4>)}
                    {productDetails?.battery && (<ProductIn4>
                        <ProductIn4Label>Dung lượng pin</ProductIn4Label>
                        <div style={{ display: 'block' }}>
                            {productDetails?.battery}
                        </div>
                    </ProductIn4>)}
                    {productDetails?.weight &&(<ProductIn4>
                        <ProductIn4Label>Cân nặng</ProductIn4Label>
                        { <div style={{ display: 'block' }}>
                            {productDetails?.weight}g
                        </div>}
                    </ProductIn4>)}
                </div>
            </section>         
            <section>
                <LabelIn4>Mô tả</LabelIn4>
                <div style={{'margin': '1.875rem 0.9375rem 0.9375rem'}}>
                    <ProductDes>
                        <p>{productDetails?.description}</p>
                    </ProductDes>
                </div>
            </section>
        </ProductDetail>
        <Comment>
            <CommentComponent 
                dataHref={process.env.REACT_APP_LOCAL 
                    ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                    : window.location.href  
                } 
                width="100%" 
                />
        </Comment>
        
        </Loading>
    )
    }

export default ProductDetailComponent