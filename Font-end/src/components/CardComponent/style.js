import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    margin: 10px 30px;
    width : 230px;
    height : 400px;
    & img {
        padding : 15px 15px 0 15px;
        height : 200px;
        width : 200px;
    }
`

export const StyleTypeProduct = styled.div`
    font-family: inherit;
    display: inline-block;
    text-transform: capitalize;
    color: #808080;
    font-size : 12px;
    
`


export const StyleNameProduct = styled.div`
    font-size : 18.5px;
    width: 100%;
    height : 70px;
    font-family: none;

    margin-bottom: 10px;
    color: var(--gl-color-brand-p1);
    text-decoration: none;
`
export const WrapperPriceProduct = styled.div`
    color: rgb(255,66,78);
    font-size : 20px;
    font-weight : 500;
    margin : 15px 0;

    padding-bottom : 20px;

`
export const WrapperDiscountProduct = styled.span`
    margin : 10px;
    background : rgb(255,66,78);
    color: #fff;
    font-size : 12px;
    font-weight : 500;
    font-family: cursive;
    border-radius : 5px;
    padding : 2px;
`