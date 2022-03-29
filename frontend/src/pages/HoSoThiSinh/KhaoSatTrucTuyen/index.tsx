/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const KhaoSat = () => {
  const {
    getBieuMauUserModel,
    setLoaiBieuMau,
    loading,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    getBieuMauAdminModel
  } = useModel('bieumau');

  // useEffect(() => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //   setLoaiBieuMau('Khảo sát');
  //   return () => {
  //     setLoaiBieuMau(undefined);
  //   };
  // }, []);

  // useEffect(() => {
  //   getIdBieuMauDaTraLoiModel();
  // }, []);

  const handleEdit = (record: BieuMau.Record) => {
    setEdit(true);
    setRecord(record);
    setVisibleForm(true);
  };

  const columns: IColumn<BieuMau.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 300,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      align: 'center',
      dataIndex: '_id',
      width: 150,
      render: (val) => (
        <Tag color={listIdBieuMauDaTraLoi.includes(val) ? 'green' : 'red'}>
          {listIdBieuMauDaTraLoi.includes(val) ? 'Đã thực hiện' : 'Chưa thực hiện'}
        </Tag>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      align: 'center',
      render: (val) => {
        return <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>;
      },
      width: 200,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => {
        return <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>;
      },
      width: 200,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: BieuMau.Record) => {
        const checkHetThoiGianThucHien =
          moment(record.thoiGianBatDau).isAfter(new Date()) ||
          moment(record.thoiGianKetThuc).isBefore(new Date());
        return (
          <>
            <Tooltip
              title={checkHetThoiGianThucHien ? 'Ngoài thời gian cho phép' : 'Thực hiện khảo sát'}
            >
              {listIdBieuMauDaTraLoi.includes(record._id) ? (
                <Popconfirm
                  disabled={checkHetThoiGianThucHien}
                  title="Bạn đã thực hiện khảo sát này, bạn có muốn thực hiện lại ?"
                  onConfirm={() => handleEdit(record)}
                >
                  <Button disabled={checkHetThoiGianThucHien} type="primary" shape="circle">
                    <EditOutlined />
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  disabled={checkHetThoiGianThucHien}
                  onClick={() => handleEdit(record)}
                  type="primary"
                  shape="circle"
                >
                  <EditOutlined />
                </Button>
              )}
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <TableBase
      columns={columns}
      //getData={() => getBieuMauUserAdminModel('Trắc nghiệm')}
      getData = {getBieuMauAdminModel}
      loading={false}
      dependencies={[page, limit]}
      modelName="bieumau"
      title="Khảo sát trực tuyến"
      formType="Drawer"
      widthDrawer="60%"
      //scroll={{ x: 1300 }}
      Form={Form}
    />
  );
};

export default KhaoSat;
