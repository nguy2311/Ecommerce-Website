import React, { useEffect,  useState } from 'react'
import TypeProduct from '../../components/TypeProductComponent/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1  from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import slider4 from '../../assets/images/slider4.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import {useQuery} from '@tanstack/react-query'
import * as ProductController from '../../controller/ProductController'

import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hook/useDebounce'

const HomePage = () =>{

  const [typeProducts, setTypeProducts] = useState([])
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)

  const [limit, setLimit] = useState(6)
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductController.getAllProduct(search, limit)
    return res
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductController.getAllTypeProduct()
    if(res?.status === 'OK') {
      setTypeProducts(res?.data)
      }
  }
   useEffect(() => {
    fetchAllTypeProduct()
  }, [])

const { isLoading, data: products} = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })

  return (
    <Loading isLoading={isLoading }>
    <div style={{padding: '0 120px'}}> 
      <WrapperTypeProduct>
        {typeProducts.map((item) => {
            return (
              <TypeProduct name={item} key={item}/>
            )
          })}
      </WrapperTypeProduct>
    </div>
    <div className='body' style={{width:'100%', backgroundColor : '#efefef'}}>
      <div id="container" style={{ padding : '0 80px', height: 'auto', width : '100%'}}>
          <SliderComponent arrImages = {[slider1, slider2, slider3, slider4]}/>
          <WrapperProducts>
            {products?.data?.map((product) => { return(
              <CardComponent 
                key = {product._id} 
                name = {product.name} 
                type = {product.type} 
                price = {product.price} 
                memory = {product.memory} 
                discount = {product.discount} 
                image = {product.image}
                colour = {product.colour}
                id = {product._id}
                />
            )})}
          </WrapperProducts>
          <div style={{width : '100%',display: 'flex', justifyContent : 'center', marginTop:'15px'}}>
            <WrapperButtonMore 
              type ="outline"
                styleButton={{background : '#d70018' , width : '100px',height:'35px',borderRadius: '15px',
                color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#d70018'}` }}
                textButton = 'Xem thêm'
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{color : "#fff", fontWeight : 500}}
                onClick={() => setLimit((prev) => prev + 6)}
              
            />
          </div>
      </div>
    </div>
    
    </Loading>

  )
}
  
export default HomePage