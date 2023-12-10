import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form,  Select,  Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  UploadOutlined 
} from '@ant-design/icons';

import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64, renderOptionsType } from '../../utils';
import { useMutationHooks } from '../../hook/useMutationHook.js'
import * as ProductController from '../../controller/ProductController.js'
import Loading from '../LoadingComponent/Loading.jsx';
import * as message from '../../components/Message/Message.jsx'
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent.jsx';
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent.jsx';



const AdminProduct = () => {
  const [RowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)


  const searchInput = useRef(null);

  const user = useSelector((state) => state?.user)
  const inittial = () => ({
    name : '', 
    manufacturer : '', 
    image : '', 
    type : '', 
    price : '', 
    countInStock : '',
    description : '',
    discount : '',
    colour : '',
    memory : '',
    ram : '',
    gpu : '',
    camera : '',
    battery : '',
    weight : '',
    chip : '',
  })
  const [stateProduct, setStateProduct] = useState({
    name : '', 
    manufacturer : '', 
    image : '', 
    type : '', 
    price : '', 
    countInStock : '',
    description : '',
    discount : '',
    colour : '',
    memory : '',
    ram : '',
    gpu : '',
    camera : '',
    battery : '',
    weight : '',
    chip : '',
  })

  const [stateProductDetails, setStateProductDetails] = useState({
    name : '', 
    manufacturer : '', 
    image : '', 
    type : '', 
    price : '', 
    countInStock : '',
    description : '',
    discount : '',
    colour : '',
    memory : '',
    ram : '',
    gpu : '',
    camera : '',
    battery : '',
    weight : '',
    chip : '',
  })

const [formCreate] = Form.useForm(); // Form cho tạo sản phẩm mới
const [formUpdate] = Form.useForm(); // Form cho cập nhật sản phẩm
const mutation = useMutationHooks(
  (data) => {
    const { 
      name, 
      manufacturer, 
      image, 
      type, 
      price, 
      countInStock,
      description,
      discount,
      colour,
      memory,
      ram,
      chip,
      gpu,
      camera,
      battery,
      weight } =data
    const res = ProductController.createProduct({
      name, 
      manufacturer, 
      image, 
      type, 
      price, 
      countInStock,
      description,
      discount,
      colour,
      memory,
      ram,
      chip,
      gpu,
      camera,
      battery,
      weight})
      return res
  }
)
    const mutationUpdate = useMutationHooks(
      (data) => {
        const { id,
          token,
          ...rests } = data
        const res = ProductController.updateProduct(
          id,
          token,
          { ...rests })
        return res
      },
    )

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductController.deleteProduct(
        id,
        token)
      return res
    },
  )
  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = ProductController.deleteManyProduct(
        ids,
        token)
      return res
    },
  )
  const getAllProducts = async () => {
    try {
      const res = await ProductController.getAllProduct();
      return res; // Đảm bảo trả về dữ liệu sau khi hoàn thành
    } catch (error) {
      console.error(error);
      return null; // Hoặc trả về giá trị mặc định nếu có lỗi
    }
  }

  const fetchGetProductDetails = async (RowSelected) => {
    try {
      const res = await ProductController.getDetailsProduct(RowSelected);
      if(res?.data){
        setStateProductDetails({
          name : res?.data?.name, 
          manufacturer : res?.data?.manufacturer, 
          image : res?.data?.image, 
          type : res?.data?.type, 
          price : res?.data?.price, 
          countInStock : res?.data?.countInStock,
          description : res?.data?.description,
          discount : res?.data?.discount,
          colour : res?.data?.colour,
          memory : res?.data?.memory,
          ram : res?.data?.ram,
          chip : res?.data?.chip,
          gpu : res?.data?.gpu,
          camera : res?.data?.camera,
          battery : res?.data?.battery,
          weight : res?.data?.weight
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
      formUpdate.setFieldsValue(stateProductDetails)
    }else {
      formUpdate.setFieldsValue(inittial())
    }
  }, [formUpdate, stateProductDetails, isModalOpen])

  useEffect(() => {
    if (RowSelected && isOpenDrawer && !isModalOpen ) {
      setIsLoadingUpdate(true)
      fetchGetProductDetails(RowSelected)
    }
  }, [RowSelected, isOpenDrawer,isModalOpen])


 const handleDetailsProduct = () =>{
    setIsOpenDrawer(true);
 }
  const handleDelteManyProducts = (ids) => {
  mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
    onSettled: () => {
      queryProduct.refetch()
    }
  })
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductController.getAllTypeProduct()
    return res
 }


  const { data, isLoading, isSuccess } = mutation
  const { data : dataUpdated, isLoading : isLoadingUpdated, isSuccess : isSuccessUpdated, isError : isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany
  const{isLoading : isLoadingProduct, data : products} = useQuery({queryKey: ['products'], queryFn : getAllProducts})
  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
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
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')

    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: 'Hãng sản xuất',
      dataIndex: 'manufacturer',
      sorter: (a, b) => a.manufacturer.length - b.manufacturer.length,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 50',
          value: '>=',
        },
        {
          text: '<= 50',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 50
        }
        return record.price <= 50
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'countInStock',
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colour',
      sorter: (a, b) => a.colour.length - b.colour.length,
    },
    {
      title: 'Bộ nhớ',
      dataIndex: 'memory',
      sorter: (a, b) => a.memory - b.memory,
    },
    {
      title: 'Ram',
      dataIndex: 'ram',
      sorter: (a, b) => a.ram - b.ram,
    },
    
    {
      title: 'Bộ xử lí',
      dataIndex: 'chip',
      sorter: (a, b) => a.colour.length - b.colour.length,
    },
    {
      title: 'Card đồ họa',
      dataIndex: 'gpu',
      sorter: (a, b) => a.colour.length - b.colour.length,
    },

    {
      title: 'Action',
      dataIndex: 'Action',
      render: renderAction,
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((product) =>{
    return {...product, key: product._id}
  })

  useEffect(()=>{
    if(isSuccess && data.status==='OK'){
      message.success('Tạo sản phẩm thành công')
      handleCancel()
    }else if(isSuccess && data.status==='ERR' ){
      message.error(data?.message)
    }
  },[isSuccess,data?.status,data?.message])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK' ) {
      message.success('Cập nhật sản phẩm thành công')
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error('Cập nhật sản phẩm thất bại')
    }
  }, [isSuccessUpdated,dataUpdated?.status,isErrorUpdated])
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success('Xóa sản phẩm thành công')
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error('Xóa sản phẩm thất bại')
    }
  }, [isSuccessDelected,dataDeleted?.status,isErrorDeleted])
  useEffect(() => {
    if (!isOpenDrawer) {
      setRowSelected(''); // Xóa giá trị RowSelected khi isOpenDrawer = false
    }
  }, [isOpenDrawer]);
  const handleOk = () => {
    onFinish()
  };
    useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success('Xóa sản phẩm thành công')
    } else if (isErrorDeletedMany) {
      message.error('Xóa sản phẩm thất bại')
    }
  }, [isSuccessDelectedMany])


  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name : '', 
      manufacturer : '', 
      image : '', 
      type : '', 
      price : '', 
      countInStock : '',
      description : '',
      discount : '',
      colour : '',
      memory : '',
      ram : '',
      gpu : '',
      camera : '',
      battery : '',
      weight : '',
      chip : '',
    })
    formCreate.resetFields()
  };

  const handleCancelDelete = () =>{
    setIsModalOpenDelete(false)
  }

  const handleCloseDrawer = () => {
    setRowSelected('')
    setIsOpenDrawer(false);
    setStateProductDetails({
      name : '', 
      manufacturer : '', 
      image : '', 
      type : '', 
      price : '', 
      countInStock : '',
      description : '',
      discount : '',
      colour : '',
      memory : '',
      ram : '',
      gpu : '',
      camera : '',
      battery : '',
      weight : '',
      chip : '',
    })
    formUpdate.resetFields()
  };
 
  const handleOnchange = (e) =>{
    setStateProduct({...stateProduct, [e.target.name] : e.target.value})
  }
  const handleOnchangeDetails = (e) =>{
    setStateProductDetails({...stateProductDetails, [e.target.name] : e.target.value})
  }
  const onFinish = () => {
    const params = {
        name : stateProduct.name, 
        manufacturer : stateProduct.manufacturer  , 
        image : stateProduct.image, 
        type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
        price: stateProduct.price, 
        countInStock: stateProduct.countInStock,
        description: stateProduct.description,
        discount: stateProduct.discount,
        colour: stateProduct.colour,
        memory: stateProduct.memory,
        ram: stateProduct.ram,
        chip: stateProduct.chip,
        gpu: stateProduct.gpu,
        camera: stateProduct.camera,
        battery: stateProduct.battery,
        weight: stateProduct.weight
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: RowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: RowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
    }
    setStateProduct({
      ...stateProduct,
      image : file.preview
    })
  }
  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
    }
    setStateProductDetails({
      ...stateProductDetails,
      image : file.preview
    })
  }
  const handleChangeSelect = (value) => {
      setStateProduct({
        ...stateProduct,
        type: value
      })
  }



  return (
    <div>
      <WrapperHeader>Quản lý Sản phẩm</WrapperHeader>
      <div >
        <Button style={{height : '100px', 
          width : '100px', borderRadius : '10px', 
          borderStyle: 'dashed'}} onClick={() =>setIsModalOpen(true)}>
            <FolderAddOutlined  style={{fontSize: '40px'}}/>
        </Button>
      </div>
      <div style={{marginTop : '20px'}}>
        <TableComponent handleDelteMany={handleDelteManyProducts} columns ={columns}  data={dataTable} isLoading = {isLoadingProduct} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            }
          };
        }}/>
      </div>
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <Loading isLoading={isLoading }>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          form={formCreate}
          onFinish={onFinish} 
          autoComplete="off"
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
        >
          <InputComponent value ={stateProduct.name} onChange = {handleOnchange} name = "name"/>
        </Form.Item>

        <Form.Item
          label="Hãng sản xuất"
          name="manufacturer"
          rules={[{ required: true, message: 'Nhập hãng sản xuất' }]}
        >
          <InputComponent value ={stateProduct.manufacturer} onChange = {handleOnchange} name = "manufacturer"/>
        </Form.Item>
        <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptionsType(typeProduct?.data?.data)}
                />
            </Form.Item>
        
        {stateProduct.type === 'add_type' && (
            <Form.Item
              label='Loại sản phẩm mới'
              name="newType"
              rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
            >
              <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
            </Form.Item>
          )}
        <Form.Item
          label="Bộ nhớ"
          name="memory"
          rules={[
            { 
              validator: (_, value) => {
                if (value === undefined || value === '' ) {
                  return Promise.resolve();
                }
                if (!/^-?\d*(\.\d+)?$/.test(value)) {
                  return Promise.reject(new Error('Phải là kiểu dữ liệu số!'));
                }
                if (value <= 0) {
                  return Promise.reject(new Error('Phải là số lớn hơn 0!'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputComponent value ={stateProduct.memory} onChange = {handleOnchange} name = "memory"/>
        </Form.Item>
        <Form.Item
          label="Ram"
          name="ram"
          rules={[
            { 
              validator: (_, value) => {
                if (value === undefined || value === '') {
                  return Promise.resolve();
                }
                if (!/^-?\d*(\.\d+)?$/.test(value)) {
                  return Promise.reject(new Error('Phải là kiểu dữ liệu số!'));
                }
                if (value <= 0) {
                  return Promise.reject(new Error('Phải là số lớn hơn 0!'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputComponent value ={stateProduct.ram} onChange = {handleOnchange} name = "ram"/>
        </Form.Item>

        <Form.Item
          label="Chip"
          name="chip"

        >
          <InputComponent value ={stateProduct.chip} onChange = {handleOnchange} name = "chip"/>
        </Form.Item>
        <Form.Item
          label="GPU"
          name="gpu"

        >
          <InputComponent value ={stateProduct.gpu} onChange = {handleOnchange} name = "gpu"/>
        </Form.Item>
        
        <Form.Item
          label="Camera"
          name="camera"
          rules={[
            { 
              validator: (_, value) => {
                if (value === undefined || value === '') {
                  return Promise.resolve();
                }
                if (!/^-?\d*(\.\d+)?$/.test(value)) {
                  return Promise.reject(new Error('Phải là kiểu dữ liệu số!'));
                }
                if (value <= 0) {
                  return Promise.reject(new Error('Phải là số lớn hơn 0!'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputComponent value ={stateProduct.camera} onChange = {handleOnchange} name = "camera"/>
        </Form.Item>
        <Form.Item
          label="Dung luợng pin"
          name="battery"

        >
          <InputComponent value ={stateProduct.battery} onChange = {handleOnchange} name = "battery"/>
        </Form.Item>
        <Form.Item
          label="Màu sắc"
          name="colour"
          rules={[
            { required: true, message: 'Nhập màu sắc sản phẩm!' }
          ]}
        >
          <InputComponent value ={stateProduct.colour} onChange = {handleOnchange} name = "colour"/>
        </Form.Item>
        <Form.Item
          label="Trọng lượng"
          name="weight"
          rules={[
            { required: true, message: 'Nhập trọng lượng sản phẩm!' },
            { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
            { validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn 0!')) }
          ]}
        >
          <InputComponent value ={stateProduct.weight} onChange = {handleOnchange} name = "weight"/>
        </Form.Item>
        
        <Form.Item
          label="Giá sản phẩm"
          name="price"
          rules={[
            { required: true, message: 'Nhập giá của sản phẩm' },
            { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
            { validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn 0!')) }
          ]}
        >
          <InputComponent value ={stateProduct.price} onChange = {handleOnchange} name = "price"/>
        </Form.Item>
        <Form.Item
          label="Số lượng sản phẩm"
          name="countInStock"
          rules={[{ required: true, message: 'Nhập số lượng sản phẩm' },
            { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
            { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn hoặc bằng 0!')) }
          ]}
        >
          <InputComponent value ={stateProduct.countInStock} onChange = {handleOnchange} name = "countInStock"/>
        </Form.Item>
        <Form.Item
          label="Giảm giá"
          name="discount"
          rules={[{ required: true, message: 'Nhập giá trị giảm giá của sản phẩm' },
            { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
            { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn hoặc bằng 0!')) }]}
          >
          <InputComponent value ={stateProduct.discount} onChange = {handleOnchange} name = "discount"/>
        </Form.Item>
        
        <Form.Item
          label="Mô tả"
          name="description"

        >
          <InputComponent value ={stateProduct.description} onChange = {handleOnchange} name = "description"/>
        </Form.Item>
        <Form.Item
          label="Hình ảnh"
          name="image"
        >
          <WrapperUploadFile onChange ={handleOnchangeAvatar} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </WrapperUploadFile>
          {stateProduct?.image && (
                <img src={stateProduct?.image} style={{
                    height: '120px',
                    width: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                }} alt="avatar"/>
              )} 
        </Form.Item>


        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form.Item>
        </Form>
      </Loading>          
      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer}    onClose = {() => setIsOpenDrawer(false)} width = "50%">
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
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
          >
            <InputComponent value ={stateProductDetails.name} onChange = {handleOnchangeDetails} name = "name"/>
          </Form.Item>

          <Form.Item
            label="Hãng sản xuất"
            name="manufacturer"
            rules={[{ required: true, message: 'Nhập hãng sản xuất' }]}
          >
            <InputComponent  value ={stateProductDetails.manufacturer} onChange = {handleOnchangeDetails} name = "manufacturer"/>
          </Form.Item>
          <Form.Item
            label="Loại sản phẩm"
            name="type"
            rules={[{ required: true, message: 'Nhập loại sản phẩm' }]}
          >
            <InputComponent disabled ={true} value ={stateProductDetails.type} onChange = {handleOnchangeDetails} name = "type"/>
          </Form.Item>
          <Form.Item
            label="Bộ nhớ"
            name="memory"

          >
            <InputComponent disabled ={true} value ={stateProductDetails.memory} onChange = {handleOnchangeDetails} name = "memory"/>
          </Form.Item>
          <Form.Item
            label="Ram"
            name="ram"
          >
            <InputComponent disabled ={true} value ={stateProductDetails.ram} onChange = {handleOnchangeDetails} name = "ram"/>
          </Form.Item>
          <Form.Item
          label="Chip"
          name="chip"

        >
          <InputComponent disabled ={true} value ={stateProductDetails.chip} onChange = {handleOnchangeDetails} name = "chip"/>
        </Form.Item>
        <Form.Item
          label="GPU"
          name="gpu"

        >
          <InputComponent disabled ={true} value ={stateProductDetails.gpu} onChange = {handleOnchangeDetails} name = "gpu"/>
        </Form.Item>
        
        <Form.Item
          label="Camera"
          name="camera"

        >
          <InputComponent disabled ={true} value ={stateProductDetails.camera} onChange = {handleOnchangeDetails} name = "camera"/>
        </Form.Item>
        <Form.Item
          label="Dung luợng pin"
          name="battery"

        >
          <InputComponent disabled ={true} value ={stateProductDetails.battery} onChange = {handleOnchangeDetails} name = "battery"/>
        </Form.Item>
        <Form.Item
          label="Trọng lượng"
          name="weight"
          rules={[
            { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
            { validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn 0!')) }
          ]}

        >
          <InputComponent disabled ={true} value ={stateProductDetails.weight} onChange = {handleOnchangeDetails} name = "weight"/>
        </Form.Item>
          
          <Form.Item
            label="Giá sản phẩm"
            name="price"
            rules={[{ required: true, message: 'Nhập giá của sản phẩm' },
              { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
              { validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn 0!')) }
          ]}
          >
            <InputComponent value ={stateProductDetails.price} onChange = {handleOnchangeDetails} name = "price"/>
          </Form.Item>
          <Form.Item
            label="Số lượng sản phẩm"
            name="countInStock"
            rules={[{ required: true, message: 'Nhập số lượng sản phẩm' },
          { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
        { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn hoặc bằng 0!')) }]}
          >
            <InputComponent value ={stateProductDetails.countInStock} onChange = {handleOnchangeDetails} name = "countInStock"/>
          </Form.Item>
          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[{ required: true, message: 'Nhập giá trị giảm giá của sản phẩm' },
          { pattern: /^-?\d*(\.\d+)?$/, message: 'Phải là kiểu dữ liệu số!' },
        { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject(new Error('Phải là số lớn hơn hoặc bằng 0!')) }]}
          >
            <InputComponent value ={stateProductDetails.discount} onChange = {handleOnchangeDetails} name = "discount"/>
          </Form.Item>
          <Form.Item
            label="Màu sắc"
            name="colour"

          >
            <InputComponent disabled ={true} value ={stateProductDetails.colour} onChange = {handleOnchangeDetails} name = "colour"/>
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"

          >
            <InputComponent value ={stateProductDetails.description} onChange = {handleOnchangeDetails} name = "description"/>
          </Form.Item>
          <Form.Item
            label="Hình ảnh"
            name="image"
          >
            <WrapperUploadFile onChange ={handleOnchangeAvatarDetails} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </WrapperUploadFile>
            {stateProductDetails?.image && (
                  <img src={stateProductDetails?.image} style={{
                      height: '120px',
                      width: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                  }} alt="avatar"/>
                )} 
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
          </Form>
        </Loading>    
      </DrawerComponent>
      <ModalComponent forceRender title="Xoá sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete}  onOk = {handleDeleteProduct}>
      <Loading isLoading={isLoadingDeleted}>
        <div>Bạn có chắc chắn xóa sản phẩm không</div>
      </Loading>          
      </ModalComponent>
    </div>
  )
}

export default AdminProduct 