import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display : flex;
    align-item : center;
    gap: 24px;
    justify-content : flex-start;
    padding : 15px;
    margin : 10px;

`

export const WrapperButtonMore = styled(ButtonComponent)`
    &: hover{
        background : '#d70018' ;

        span{
            color:#fff;
        }
    }
    width : 100%;
    text-align : center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'};
`

export const WrapperProducts = styled.div`
    margin-Top : 20px;
    display : flex;
    align-Items : center; 
    justify-Content: center;
    flex-Wrap : wrap;

`
