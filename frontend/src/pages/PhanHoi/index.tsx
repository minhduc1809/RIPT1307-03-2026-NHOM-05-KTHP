/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const PhanHoi = () => {
  const {
    loading,
    setVisibleForm,
    setRecord,
    page,
    limit,
    setDaTraLoi,
    setVaiTro,
    getPhanHoiAdminModel,
    daTraLoi,
    vaiTro,
  } = useModel('phanhoi');

  const handleEdit = (record: PhanHoi.Record) => {
    setRecord(record);
    setVisibleForm(true);
  };

  const columns: ColumnProps<PhanHoi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: `Mã ${vaiTro === 'sinh_vien' ? 'sinh viên' : 'giảng viên'}`,
      dataIndex: 'maSv',
      align: 'center',
      width: 150,
    },
    {
      title: 'Người gửi',
      dataIndex: 'hoTenNguoiPhanHoi',
      align: 'center',
      width: 200,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'noiDungPhanHoi',
      align: 'center',
      // width: 200,
    },
    {
      title: 'Thời gian hỏi',
      dataIndex: 'thoiGianHoi',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      width: 200,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record) => (
        <>
          <Tooltip title={daTraLoi ? 'Xem nội dung trả lời' : 'Trả lời'}>
            <Button onClick={() => handleEdit(record)} type="primary" shape="circle">
              {daTraLoi ? <EyeOutlined /> : <EditOutlined />}
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  if (daTraLoi) {
    columns.splice(3, 0, {
      title: 'Người trả lời',
      dataIndex: 'hoTenNguoiTraLoi',
      align: 'center',
      width: 200,
    });
  }

  const onChangeVaiTro = (value: string) => {
    setVaiTro(value);
  };

  const onChangeTrangThai = (value: string) => {
    const isAnswer = value === 'Đã trả lời';
    setDaTraLoi(isAnswer);
  };

  return (
    <TableBase
      columns={columns}
      getData={getPhanHoiAdminModel}
      loading={loading}
      dependencies={[vaiTro, daTraLoi, page, limit]}
      modelName="phanhoi"
      title="Phản hồi"
      Form={Form}
    >
      <Select
        placeholder="Lọc theo vai trò người gửi"
        onChange={onChangeVaiTro}
        value={vaiTro}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {[
          { value: 'sinh_vien', name: 'Sinh viên' },
          { value: 'giang_vien', name: 'Giảng viên' },
        ]?.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Lọc theo trạng thái"
        onChange={onChangeTrangThai}
        value={daTraLoi ? 'Đã trả lời' : 'Chưa trả lời'}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {['Đã trả lời', 'Chưa trả lời']?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default PhanHoi;
