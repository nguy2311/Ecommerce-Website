import React, { useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WrapperNavBar, WrapperProducts, WrapperTypePage } from './style.js'
import { Col, Pagination } from 'antd'
import { useLocation } from 'react-router-dom'
import * as ProductController from '../../controller/ProductController.js'
import { useDebounce } from '../../hook/useDebounce'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'

const TypePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const {state}  = useLocation()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 6,
        total: 1,
    })
    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductController.getProductType(type, page, limit)
        if(res?.status === 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPanigate({...panigate, total: res?.total})
        }else {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     if(state){
    //         fetchProductType(state, panigate.page, panigate.limit)
    //     }
    // }, [state,panigate.page, panigate.limit])


    const [currentType, setCurrentType] = useState(null);

    useEffect(() => {
        if (state && state !== currentType) {
            setPanigate({ ...panigate, page: 0 });
            setCurrentType(state);
        }
    }, [state]);

    useEffect(() => {
        if (currentType) {
            fetchProductType(currentType, panigate.page, panigate.limit);
        }
    }, [currentType, panigate.page, panigate.limit]);


    const onChange = (current, pageSize) => {
        setPanigate({...panigate, page: current - 1, limit: pageSize})    
    }

  return (
    <Loading isLoading={loading}>
    <div style={{padding:'0 120px', background : '#efefef'}}>
      <WrapperTypePage>
          <WrapperNavBar span={4} >
              <NavBarComponent/>
          </WrapperNavBar>
          <Col span={20}>
            <WrapperProducts >
              {products?.filter((pro) => {
                  if(searchDebounce === '') {
                      return pro
                  }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                      return pro
                  }
              })?.map((product) => {
                  return (
                      <CardComponent
                          key={product._id}
                          image={product.image}
                          name={product.name}
                          price={product.price}
                          type={product.type}
                          discount={product.discount}
                          id={product._id}
                      />
                  )
              })}
            </WrapperProducts>
            <Pagination current={panigate.page + 1} total={panigate?.total} pageSize={6} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />

          </Col>
          
          
      </WrapperTypePage>
      
    </div>
    </Loading>
  )
}

export default TypePage