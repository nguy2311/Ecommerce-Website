import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader} from './style'
import { Button, Form,  Select,  Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import {
  EditOutlined,
  DeleteOutlined,

} from '@ant-design/icons';

import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';

import { useMutationHooks } from '../../hook/useMutationHook.js'
import Loading from '../LoadingComponent/Loading.jsx';
import * as message from '../../components/Message/Message.jsx'
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent.jsx';
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent.jsx';

import * as OrderController from '../../controller/OrderController.js'
import { orderContant } from '../../contant'


const AdminOrder = () => {
  const [RowSelected, setRowSelected] = useState('')
  const [OrderItems, setOrderItems] = useState([])
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)


  const searchInput = useRef(null);

  const user = useSelector((state) => state?.user)
  const inittial = () => ({
    orderItems: [],
    shippingAddress :{},
    address: '',
    fullName : '',
    phone : '',
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
  })


  const [stateOrderDetails, setStateOrderDetails] = useState({
    orderItems: [],
    shippingAddress :{},
    address: '',
    fullName : '',
    phone : '',
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
  })

const [formUpdate] = Form.useForm(); // Form cho cập nhật sản phẩm
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = OrderController.updateOrder(
        id,
        { ...rests },
        token
        )
      return res
    },
  )

  const mutationDeleted = useMutationHooks(
    async (data) => {
      const { id, token , orderItems, userId } = data
      const res = await OrderController.cancelOrder(id, token,orderItems, userId)
      return res
    }
  )

  const getAllOrder = async () => {
    try {
      const res = await OrderController.getAllOrder(user?.access_token);
      return res; // Đảm bảo trả về dữ liệu sau khi hoàn thành
    } catch (error) {
      console.error(error);
      return null; // Hoặc trả về giá trị mặc định nếu có lỗi
    }
  }

  const fetchGetOrderDetails = async (RowSelected) => {
    try {
      const res = await OrderController.getDetailsOrder(RowSelected);
      if(res?.data){
        setStateOrderDetails({
          orderItems: res?.data.orderItems,
          shippingAddress : res?.data.shippingAddress,
          address: res?.data.shippingAddress?.address,
          fullName : res?.data.shippingAddress?.fullName,
          phone : res?.data.shippingAddress?.phone,
          paymentMethod: res?.data.paymentMethod,
          itemsPrice: res?.data.itemsPrice,
          shippingPrice: res?.data.shippingPrice,
          totalPrice: res?.data.totalPrice,
          user: res?.data.user,
          isPaid: res?.data.isPaid ,
          isDelivered: res?.data.isDelivered, 
          deliveredAt: res?.data.deliveredAt,
        })
      }
    setIsLoadingUpdate(false)
    } catch (error) {
      console.error(error);
      return null; 
    }
  }

  useEffect(() => {
    if(isOpenDrawer) {
      formUpdate.setFieldsValue(stateOrderDetails)
    }else {
      formUpdate.setFieldsValue(inittial())
    }
  }, [formUpdate, stateOrderDetails])

  useEffect(() => {
    if (RowSelected && isOpenDrawer  ) {
      setIsLoadingUpdate(true)
      fetchGetOrderDetails(RowSelected)
    }
  }, [RowSelected, isOpenDrawer])


 const handleDetailsOrder = () =>{
    setIsOpenDrawer(true);
 }



  const { data : dataUpdated, isLoading : isLoadingUpdated, isSuccess : isSuccessUpdated, isError : isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted

  const{isLoading : isLoadingProduct, data : orders} = useQuery({queryKey: ['orders'], queryFn : getAllOrder})
  const queryProduct = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })

  const renderAction = () =>{
    return(
      <div>
        <EditOutlined style={{fontSize : '20px', cursor : 'pointer'}} onClick={handleDetailsOrder}/>
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
      title: 'Tên khách hàng',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Tình trạng thanh toán',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Tình trạng giao hàng',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      ...getColumnSearchProps('createdAt')
    },
    {
      title: 'Ngày nhận hàng',
      dataIndex: 'deliveredAt',
      sorter: (a, b) => a.deliveredAt.length - b.deliveredAt.length,
      ...getColumnSearchProps('deliveredAt')
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      render: renderAction,
    },
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {

    return { ...order, 
      key: order._id, 
      userName: order?.shippingAddress?.fullName, 
      phone: order?.shippingAddress?.phone, 
      address: order?.shippingAddress?.address, 
      paymentMethod: orderContant.payment[order?.paymentMethod],
      createdAt : order?.createdAt, 
      deliveredAt : order?.deliveredAt,
      isPaid: order?.isPaid ? 'Đã thanh toán' :'Chưa thanh toán',
      isDelivered: order?.isDelivered ? 'Đã nhận hàng' : 'Chưa nhận hàng', 
      totalPrice: order?.totalPrice}
  })


  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK' ) {
      message.success('Cập nhật Đơn hàng thành công')
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error('Cập nhật Đơn hàng thất bại')
    }
  }, [isSuccessUpdated])
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success('Xóa Đơn hàng thành công')
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error('Xóa Đơn hàng thất bại')
    }
  }, [isSuccessDelected])
  useEffect(() => {
    if (!isOpenDrawer) {
      setRowSelected(''); 
      setOrderItems([])
    }
  }, [isOpenDrawer]);



  const handleCancelDelete = () =>{
    setIsModalOpenDelete(false)
  }

  const handleCloseDrawer = () => {
    setRowSelected('')
    setOrderItems([])
    setIsOpenDrawer(false);
    setStateOrderDetails({
      orderItems: [],
      orderItemsSlected: [],
      shippingAddress: {
      },
      address: '',
      fullName : '',
      phone : '',
      paymentMethod: '',
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      user: '',
      isPaid: false,
      paidAt: '',
      isDelivered: false,
      deliveredAt: '',
    })
    formUpdate.resetFields()
  };
 

  


  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: RowSelected, token: user?.access_token, ...stateOrderDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: RowSelected, token: user?.access_token, orderItems: OrderItems, userId: user?._id }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const handleOnchangeDetails = (e) =>{
    setStateOrderDetails({...stateOrderDetails, [e.target.name] : e.target.value})
  }
  const handleOnchangeOptionPaid = (value) => {

    setStateOrderDetails((stateOrderDetails) => ({
      ...stateOrderDetails,
      isPaid: value === 'true', // Chuyển đổi sang kiểu boolean
    }));
  };
  const handleOnchangeOptionDelivered = (value) => {

    setStateOrderDetails((stateOrderDetails) => ({
      ...stateOrderDetails,
      isDelivered: value === 'true', // Chuyển đổi sang kiểu boolean
    }));
  };


  return (
    <div>
      <WrapperHeader>Quản lý Đơn hàng</WrapperHeader>

      <div style={{marginTop : '20px'}}>
        <TableComponent columns ={columns}  data={dataTable} isLoading = {isLoadingProduct} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
              setOrderItems(record.orderItems)
            }
          };
        }}/>
      </div>
      <DrawerComponent title='Chi tiết Đơn hàng' isOpen={isOpenDrawer} onClose = {() => setIsOpenDrawer(false)} width = "50%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={formUpdate}
            onFinish={onUpdateProduct} 
            autoComplete="off"
        >
          <Form.Item
            label="Tên khách hàng"
            name="fullName"
          >
            <InputComponent 
              value ={stateOrderDetails.shippingAddress.fullName} 
              disabled ={true}
              name = "fullName"/>
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"

          >
            <InputComponent disabled ={true} value ={stateOrderDetails.shippingAddress.phone}  name = "phone"/>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Nhập loại sản phẩm' }]}
          >
            <InputComponent disabled ={true} value ={stateOrderDetails.shippingAddress.address}  name = "address"/>
          </Form.Item>
          
          <Form.Item
            label="Phương thức thanh toán"
            name="paymentMethod"
          >
            <InputComponent disabled ={true} value ={stateOrderDetails.paymentMethod} onChange = {handleOnchangeDetails} name = "paymentMethod"/>
          </Form.Item>
          <Form.Item
            label="Tình trạng thanh toán"
            name="isPaid"
          >
            <Select
              style={{ width: '100%', marginTop: '10px' }}
              name="isPaid"
              value={stateOrderDetails.isPaid ? 'true' : 'false'}
              onChange={handleOnchangeOptionPaid}
              options={[
                { value: 'true', label: 'Đã thanh toán' },
                { value: 'false', label: 'Chưa thanh toán' }
              ]}
            />
          <InputComponent disabled ={true} value ={stateOrderDetails.isPaid} onChange = {handleOnchangeDetails} name = "isPaid"/>
        </Form.Item>
        <Form.Item
          label="Tình trạng giao hàng"
          name="isDelivered"
        >
          <Select
            style={{ width: '100%', marginTop: '10px' }}
            name="isDelivered"
            value={stateOrderDetails.isDelivered ? 'true' : 'false'}
            onChange={handleOnchangeOptionDelivered}
            options={[
              { value: 'true', label: 'Đã giao hàng' },
              { value: 'false', label: 'Chưa giao hàng' }
            ]}
          />
          <InputComponent disabled ={true} value ={stateOrderDetails.isDelivered} onChange = {handleOnchangeDetails} name = "isDelivered"/>
        </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
          </Form>
        </Loading>    
      </DrawerComponent>
      <ModalComponent forceRender title="Xoá đơn hàng" open={isModalOpenDelete} onCancel={handleCancelDelete}  onOk = {handleDeleteProduct}>
      <Loading isLoading={isLoadingDeleted}>
        <div>Bạn có chắc chắn xóa đơn hàng không?</div>
      </Loading>          
      </ModalComponent>
    </div>
  )
}



export default AdminOrder