/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';
import FormGuiPhanHoi from './components/FormGuiPhanHoi';

const PhanHoi = () => {
  const access = useAccess();
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
    condition,
    getPhanHoiUserModel,
  } = useModel('phanhoi');

  const handleEdit = (record: PhanHoi.Record) => {
    setRecord(record);
    setVisibleForm(true);
  };

  const columns: IColumn<PhanHoi.Record>[] = [
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
      search: 'search',
      width: 150,
      hide: access.admin ? false : true,
    },
    {
      title: 'Người gửi',
      dataIndex: 'hoTenNguoiPhanHoi',
      align: 'center',
      search: 'search',
      width: 170,
    },
    {
      title: 'Người trả lời',
      dataIndex: 'hoTenNguoiTraLoi',
      align: 'center',
      width: 150,
      hide: !daTraLoi,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'noiDungPhanHoi',
      align: 'center',
      search: 'search',
      // width: 200,
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'noiDungTraLoi',
      align: 'center',
      search: 'search',
      hide: !daTraLoi,
      // width: 200,
    },
    {
      title: 'Thời gian hỏi',
      dataIndex: 'thoiGianHoi',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      width: 150,
    },
    {
      title: 'Thao tác',
      hide: access.admin ? false : true,
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

  const onChangeVaiTro = (value: string) => {
    setVaiTro(value);
  };

  const onChangeTrangThai = (value: string) => {
    const isAnswer = value === 'Đã trả lời';
    setDaTraLoi(isAnswer);
  };

  return (
    <TableBase
      scroll={{ x: 900 }}
      columns={columns}
      getData={access.admin ? getPhanHoiAdminModel : getPhanHoiUserModel}
      loading={loading}
      hascreate={access.admin ? false : true}
      dependencies={[vaiTro, daTraLoi, page, limit, condition]}
      modelName="phanhoi"
      title="Phản hồi"
      Form={access.admin ? Form : FormGuiPhanHoi}
    >
      {access.admin && (
        <Select
          placeholder="Lọc theo vai trò người gửi"
          onChange={onChangeVaiTro}
          value={vaiTro}
          style={{ width: 220, marginBottom: 8, marginRight: 8 }}
        >
          {[
            { value: 'sinh_vien', name: 'Sinh viên' },
            { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
          ]?.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      )}
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
