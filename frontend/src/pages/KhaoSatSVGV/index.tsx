import TableBase from '@/components/Table';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const KhaoSat = () => {
  const {
    getBieuMauUserModel,
    setLoaiBieuMau,
    loaiBieuMau,
    loading,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
  } = useModel('bieumau');

  useEffect(() => {
    setLoaiBieuMau('Khảo sát');
  }, []);

  const handleEdit = (record: BieuMau.Record) => {
    setEdit(true);
    setRecord(record);
    setVisibleForm(true);
  };

  const columns: ColumnProps<BieuMau.Record>[] = [
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
              <Button
                disabled={checkHetThoiGianThucHien}
                onClick={() => handleEdit(record)}
                type="primary"
                shape="circle"
              >
                <EditOutlined />
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <TableBase
      columns={columns}
      getData={getBieuMauUserModel}
      loading={loading}
      dependencies={[loaiBieuMau, page, limit]}
      modelName="bieumau"
      title="Khảo sát"
      formType="Drawer"
      widthDrawer="60%"
      // scroll={{ x: 1200 }}
      Form={Form}
    ></TableBase>
  );
};

export default KhaoSat;
