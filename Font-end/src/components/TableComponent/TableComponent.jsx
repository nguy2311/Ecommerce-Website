import { Divider, Table } from 'antd';
import React, { useState } from 'react'

import Loading from '../../components/LoadingComponent/Loading'
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';


const TableComponent = (props) => {
  const { selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns = [], handleDelteMany } = props
  // const { selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns = [], handleDelteMany } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'Action')
    return arr
  }, [columns])
  const today = new Date();
  const date = today.getHours()+'h'+today.getMinutes()+'ph'+today.getSeconds()+'s/'+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
  };
  const handleDeleteAll = () => {
    handleDelteMany(rowSelectedKeys)
  }
  const exportExcel = () => {
    const excel = new Excel();
    console.log('columns',columns)
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs(`${date}.xlsx`);
  };
  


  
  return (
    <Loading isLoading={isLoading}>
      <div>
        <Divider />
        {!!rowSelectedKeys.length && (
        <div style={{
          background: '#fff',
          color: '#d70018',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataSource}
          {...props}
        />
        <button onClick={exportExcel}>Xuất excel</button>
      </div>
    </Loading>
  )
}

export default TableComponent