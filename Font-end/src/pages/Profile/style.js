import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 18px;
    margin : 4px 0;
    padding : 15px 10px;
`

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 800px;
    padding: 10px;
    border-radius: 20px;
    gap : 30px;
`

export const WrapperLabel = styled.label`
    color: rgba(0,0,0,.4);
    font-size: .875rem;
    box-sizing: border-box;
    width: 8.75rem;
    padding-right: 0.75rem;
`

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap : 10px;
`
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-name {
        display: none
    }.ant-upload-list-item.ant-upload-list-item-error {
    display: none !important;
    }
`