/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { BieuMau } from '@/services/BieuMau/typings';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewCauTraLoi from './components/ViewCauTraLoi';

const KhaoSat = () => {
  const {
    getBieuMauUserModel,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    getMyCauTraLoiModel,
  } = useModel('bieumau');
  const dot = localStorage.getItem('dot');

  const [visibleViewCauTraLoi, setVisibleViewCauTraLoi] = useState<boolean>(false);

  const onCancelViewCauTraLoi = () => {
    setVisibleViewCauTraLoi(false);
  };

  useEffect(() => {
    getIdBieuMauDaTraLoiModel();
  }, []);

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
      width: 120,
      fixed: 'right',
      render: (record: BieuMau.Record) => {
        const checkHetThoiGianThucHien =
          moment(record.thoiGianBatDau).isAfter(new Date()) ||
          moment(record.thoiGianKetThuc).isBefore(new Date());
        return (
          <>
            {listIdBieuMauDaTraLoi.includes(record._id) ? (
              <>
                <Tooltip title="Xem lại câu trả lời">
                  <Button
                    onClick={() => {
                      getMyCauTraLoiModel(record?._id);
                      setVisibleViewCauTraLoi(true);
                      setRecord(record);
                    }}
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>

                <Divider type="vertical" />
                <Tooltip
                  title={
                    checkHetThoiGianThucHien ? 'Ngoài thời gian cho phép' : 'Thực hiện khảo sát'
                  }
                >
                  <Popconfirm
                    disabled={checkHetThoiGianThucHien}
                    title="Bạn đã thực hiện khảo sát này, bạn có muốn thực hiện lại ?"
                    onConfirm={() => handleEdit(record)}
                  >
                    <Button
                      disabled={checkHetThoiGianThucHien || record.kichHoat === false}
                      type="primary"
                      shape="circle"
                    >
                      <EditOutlined />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </>
            ) : (
              <Tooltip
                title={checkHetThoiGianThucHien ? 'Ngoài thời gian cho phép' : 'Thực hiện khảo sát'}
              >
                <Button
                  disabled={checkHetThoiGianThucHien || record.kichHoat === false}
                  onClick={() => handleEdit(record)}
                  type="primary"
                  shape="circle"
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        getData={() => {
          if (dot) getBieuMauUserModel(dot);
        }}
        loading={false}
        dependencies={[page, limit, dot]}
        modelName="bieumau"
        title="Khảo sát trực tuyến"
        formType="Drawer"
        widthDrawer="60%"
        Form={Form}
      />
      <Modal
        width={800}
        footer={false}
        bodyStyle={{ padding: 0 }}
        visible={visibleViewCauTraLoi}
        onCancel={onCancelViewCauTraLoi}
      >
        <ViewCauTraLoi onCancel={onCancelViewCauTraLoi} />
      </Modal>
    </>
  );
};

export default KhaoSat;
