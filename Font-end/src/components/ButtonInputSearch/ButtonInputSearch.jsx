import React, { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const {size, placeholder, textButton,
        bordered, backgroundColorInput = '#fff', 
        backgroundColorButton = '#d70018',
        colorButton = '#fff', onSearch} = props

    const [inputValue, setInputValue] = useState('')


    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleSearchClick = () => {
        onSearch(inputValue)
    }

    return (
        <div style={{display : 'flex'}}>
            <InputComponent 
                size={size} 
                placeholder={placeholder} 
                bordered={bordered} 
                style={{backgroundColor: backgroundColorInput}} 
                onChange={handleInputChange}
                {...props}
                />
            <ButtonComponent
                size={size}
                styleButton={{ background: backgroundColorButton, border: !bordered && 'none' }}
                icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
                onClick={handleSearchClick} // Thay đổi đây
                >
                <span style={{ color: colorButton }}>{textButton}</span>
                </ButtonComponent>
        </div>
    )
}

export default ButtonInputSearch