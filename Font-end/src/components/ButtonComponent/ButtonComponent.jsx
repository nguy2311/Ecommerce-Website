import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ size, styleButton, styleTextButton, textButton, disabled, ...rests }) => {
  return (
    <Button
      size={size}
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : styleButton.background,
      }}
      disabled={disabled}
      {...rests} // Loại bỏ prop không hỗ trợ
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent