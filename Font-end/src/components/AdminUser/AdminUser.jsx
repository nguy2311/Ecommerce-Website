import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader} from './style'
import { Button, Form,Space } from 'antd'
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,

} from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent.jsx';
import Loading from '../LoadingComponent/Loading.jsx';
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hook/useMutationHook.js'
import * as message from '../../components/Message/Message.jsx'
import {  useQuery} from '@tanstack/react-query';

import ModalComponent from '../ModalComponent/ModalComponent.jsx';
import * as UserController from '../../controller/UserController.js'

const AdminUser = () => {
  const [RowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isCreatingProduct, setIsCreatingProduct] = useState(true);

  const searchInput = useRef(null);

  const user = useSelector((state) => state?.user)
  const inittial = () => ({
    name : '', 
    email : '', 
    password : '', 
    isAdmin : false, 
    phone : '', 
    address : '',
    avatar : '',
    city :'', 
    sex :'',

  })
  const [stateUser, setStateUser] = useState(inittial())

  const [stateUserDetails, setStateUserDetails] = useState(inittial())

  const [formCreate] = Form.useForm(); // Form cho tạo sản phẩm mới
  const [formUpdate] = Form.useForm(); // Form cho cập nhật sản phẩm

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserController.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )
  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids} = data
      const res = UserController.deleteManyUser(
        ids,
        token)
      return res
    },
  )
  const handleDelteManyUsers = (ids) => {
  mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
    onSettled: () => {
      queryUser.refetch()
    }
  })
}

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = UserController.deleteUser(
        id,
        token)
      return res
    },
  )
  const getAllUser = async () => {
    try {
      const res = await UserController.getAllUser(user?.access_token)
      return res
    } catch (error) {
      console.error(error);
      return null; // Hoặc trả về giá trị mặc định nếu có lỗi
    }
  }

  const fetchGetUserDetails = async (RowSelected) => {
    try {
      const res = await UserController.getDetailsUser(RowSelected);
      if(res?.data){
        setStateUserDetails({
          name : res?.data?.name, 
          email : res?.data?.email, 
          password : res?.data?.password, 
          isAdmin : res?.data?.isAdmin, 
          phone : res?.data?.phone, 
          address : res?.data?.address,
          avatar : res?.data?.avatar,
          city :res?.data?.city, 
          sex :res?.data?.sex,
        })
      }
    setIsLoadingUpdate(false)
    } catch (error) {
      console.error(error);
      return null; 
    }
  }

  useEffect(() => {
    if(!isModalOpen) {
      formUpdate.setFieldsValue(stateUserDetails)
    }else {
      formUpdate.setFieldsValue(inittial())
    }
  }, [formUpdate, stateUserDetails, isModalOpen])

  useEffect(() => {
    if (RowSelected && isOpenDrawer && !isModalOpen ) {
      setIsLoadingUpdate(true)
      fetchGetUserDetails(RowSelected)
    }
  }, [RowSelected, isOpenDrawer,isModalOpen])

 const handleDetailsProduct = () =>{
    setIsOpenDrawer(true);
    setIsCreatingProduct(false);
 }


  const { data : dataUpdated, isLoading : isLoadingUpdated, isSuccess : isSuccessUpdated, isError : isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const{isLoading : isLoadingUser, data : users} = useQuery({queryKey: ['user'], queryFn : getAllUser})
  const queryUser = useQuery({ queryKey: ['user'], queryFn: getAllUser })
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const renderAction = () =>{
    return(
      <div>
        <EditOutlined style={{fontSize : '20px', cursor : 'pointer'}} onClick={handleDetailsProduct}/>
        <DeleteOutlined style={{color : 'red', fontSize : '20px', cursor : 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

  });

  const columns = [
    {
      title: 'Tên nguời dùng',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')

    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'Có phải quản trị viên không',
      dataIndex: 'isAdmin',
      sorter: (a, b) => a.isAdmin.length - b.isAdmin.length,
      filters: [
        {
          text: 'Admin',
          value: true,
        },
        {
          text: 'not admin',
          value: true,
        }
      ],
      // onFilter: (value, record) => {
      //   if (value === true) {
      //     return record.isAdmin
      //   }
      //   return record.isAdmin
      // },
    },

    {
      title: 'Giới tính',
      dataIndex: 'sex',
      sorter: (a, b) => a.sex.length - b.sex.length,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      sorter: (a, b) => a.city.length - b.city.length,
    },

    {
      title: 'Action',
      dataIndex: 'Action',
      render: renderAction,
    },
  ];
  const dataTable = users?.data?.length && users?.data?.map((user) =>{
    return {...user, key: user._id, isAdmin : user.isAdmin?'Có':'Không'};
  })



  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK' ) {
      message.success('Cập nhật người dùng thành công')
      handleCloseDrawer()
    }else if (isSuccessUpdated && dataUpdated?.status === 'ERR' ) {
      message.error('Cập nhật người dùng thất bại')
    }else if (isErrorUpdated) {
      message.error('Cập nhật người dùng thất bại')
    }
  }, [isSuccessUpdated])
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])
  useEffect(() => {
    if (!isOpenDrawer) {
      setRowSelected(''); 
    }
  }, [isOpenDrawer]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])



  const handleCancelDelete = () =>{
    setIsModalOpenDelete(false)
  }

  const handleCloseDrawer = () => {
    setRowSelected('')
    setIsOpenDrawer(false);
    setStateUserDetails(inittial())
    formUpdate.resetFields()
  };
    const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: RowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }
 

  const handleOnchangeDetails = (e) =>{
    setStateUserDetails({...stateUserDetails, [e.target.name] : e.target.value})
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: RowSelected, token: user?.access_token, ...stateUserDetails }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{marginTop : '20px'}}>
        <TableComponent handleDelteMany={handleDelteManyUsers} columns ={columns}  data={dataTable} isLoading = {isLoadingUser} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            }
          };
        }}/>
      </div>
      
      <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer}    onClose = {handleCloseDrawer} width = "50%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated || isLoadingDeletedMany}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={formUpdate}
            onFinish={onUpdateUser} 
            autoComplete="off"
        >

          <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Nhập tên User!' }]}
        >
          <InputComponent value ={stateUserDetails.name} onChange = {handleOnchangeDetails} name = "name"/>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Nhập email' }]}
        >
          <InputComponent value ={stateUserDetails.email} onChange = {handleOnchangeDetails} name = "email"/>
        </Form.Item>
        {/* <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Nhập mật khẩu' }]}
        >
          <InputComponent value ={stateUserDetails.password} onChange = {handleOnchangeDetails} name = "password"/>
        </Form.Item> */}
        <Form.Item
          label="Sô điện thoại"
          name="phone"

        >
          <InputComponent value ={stateUserDetails.phone} onChange = {handleOnchangeDetails} name = "phone"/>
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"

        >
          <InputComponent value ={stateUserDetails.address} onChange = {handleOnchangeDetails} name = "address"/>
        </Form.Item>

        
        <Form.Item
          label="Thành phố"
          name="city"

        >
          <InputComponent value ={stateUserDetails.city} onChange = {handleOnchangeDetails} name = "city"/>
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="sex"

        >
          <InputComponent value ={stateUserDetails.sex} onChange = {handleOnchangeDetails} name = "sex"/>
        </Form.Item>
        {/* <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: 'Please input your image!' }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
              <Button >Select File</Button>
              {stateUserDetails?.avatar && (
                <img src={stateUserDetails?.avatar} style={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: '10px'
                }} alt="avatar" />
              )}
            </WrapperUploadFile>
          </Form.Item> */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
          </Form>
        </Loading>    
      </DrawerComponent>
      <ModalComponent forceRender title="Người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete}  onOk = {handleDeleteUser}>
      <Loading isLoading={isLoadingDeleted}>
        <div>Bạn có chắc chắn xóa người dùng không</div>
      </Loading>          
      </ModalComponent>
    </div>
  )
}

export default AdminUser 