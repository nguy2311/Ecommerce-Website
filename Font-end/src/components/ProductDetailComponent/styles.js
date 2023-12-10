import { Col, Image } from "antd";
import styled from "styled-components";
import TypedInputNumber from 'antd/es/input-number'

export const WrapperImageSmall = styled(Image)`
    height : 100px;
    width : 100px;

`
export const WrapperColImage = styled(Col)`
    flex-basis : unset;
    display : flex;
`
export const WrapperNameProduct = styled.h1`
    color : rgb(36,36,36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break : break-word;
`
export const WrapperStatusProduct = styled.h1`
    color : rgb(36,36,36);
    font-size: 15px;
    font-weight: 300;
    line-height: 26px;
    word-break : break-word;
`
export const WrapperPriceProduct = styled.div`
    color: rgb(255,66,78);
    font-size : 20px;
    font-weight : 500;
    height:auto;
    margin : 15px 0;
    padding-bottom : 20px;

`
export const WrapperDiscountProduct = styled.span`
    margin : 10px;
    background : rgb(255,66,78);
    color: #fff;
    font-size : 14px;
    font-weight : 500;
    font-family: cursive;
    border-radius : 5px;
    padding : 2px;
`
export const WrapperPriceTextProduct = styled.span`
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
    padding : 10px;
`

export const WrapperAddressProduct = styled.div`
    span.address{
        margin :0 5px;
        text-decoration : underline;
        font-size : 15px;
        line-height: 24px;
        width : auto;
        font-weight: 500;
        white-space : nowrap;
        overflow : hidden;
        text-overflow : ellipsisl;
    };
    span.changeAddress{
        color : rgb(11,116,229);
        font-size : 16px;
        line-height : 24px;
        font-weight : 500;
        flex-shrink : 0;
    }
`
export const WrapperQualityProduct = styled.div`
    display : flex;
    gap : 4px;
    align-items : center;
    border-radius : 2px;
    width : 100px;

`

export const WrapperInputNumber = styled(TypedInputNumber)`
    .ant-input-number-input-wrap{
        width : 40px !important;
    }
    .ant-input-number-handler-wrap {
    display: none !important;
}
`

export const ProductDetail = styled.div`
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.05);
    border-radius: 0.125rem;
    overflow: hidden;
    background: #fff;
    margin-top: 0.9375rem;
    padding: 0.625rem;

`
export const ProductIn4 = styled.div`
    display: flex;
    margin-bottom: 1.125rem;

`
export const LabelIn4 = styled.h2`
    background: rgba(0,0,0,.02);
    color: rgba(0,0,0,.87);
    font-size: 1.125rem;
    font-weight: 400;
    margin: 0;
    padding: 0.875rem;
    text-transform: capitalize;
`
export const ProductIn4Label = styled.label`
    color: rgba(0,0,0,.4);
    font-size: .875rem;
    box-sizing: border-box;
    width: 8.75rem;
    padding-right: 0.75rem;
`

export const ProductDes = styled.div`
    white-space: pre-wrap;
    color: rgba(0,0,0,.8);
    font-size: .875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.7;
`
export const Comment = styled.div`
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.05);
    border-radius: 0.125rem;
    overflow: hidden;
    background: #fff;
    margin-top: 0.9375rem;
    padding: 0.625rem;

`