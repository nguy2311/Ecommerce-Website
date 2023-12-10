import React, { useEffect, useState } from 'react'
import { WrapperLabelText, WrapperTextContent, WrapperTextValue } from './style'
import * as ProductController from '../../controller/ProductController'
import { useNavigate } from 'react-router-dom'

const NavBarComponent = () => {
    const [typeProducts, setTypeProducts] = useState([])

    const navigate = useNavigate()
    const fetchAllTypeProduct = async () => {
        const res = await ProductController.getAllTypeProduct()
        if(res?.status === 'OK') {
        setTypeProducts(res?.data)
        }
    }
    useEffect(() => {
        fetchAllTypeProduct()
    }, [])
    const handleNavigatetype = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
    }
    const renderContent =(type, options)=>{
        switch(type){
            case 'text':
                return options.map((option)=>{
                    return (   
                        <WrapperTextValue key={option} style={{cursor : 'pointer'}} onClick={()=>handleNavigatetype(option)}>{option}</WrapperTextValue>
                    )               
                })

            // case 'price':
            //     return options.map((option)=>{
            //         return (   
            //             <WrapperPriceValue>{option}</WrapperPriceValue>
            //         )               
            //     })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLabelText>Danh mục sản phẩm</WrapperLabelText>
            <WrapperTextContent>
                {renderContent('text',typeProducts)}             
            </WrapperTextContent>
            {/* <WrapperTextContent>
                {renderContent('price',['Duoi 40', 'Tu 40 - 100', 'Tren 100'])}             
            </WrapperTextContent> */}
        </div>
    )
}

export default NavBarComponent