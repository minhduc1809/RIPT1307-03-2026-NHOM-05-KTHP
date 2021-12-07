import TableBase from '@/components/Table';
import { Role } from '@/utils/constants';
import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Select, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormUser from './components/Form';
import FormCapLaiMatKhau from './components/FormCapLaiMatKhau';

const QuanLyTaiKhoan = () => {
  const {
    getUserModel,
    page,
    limit,
    condition,
    loading,
    setCondition,
    setVisibleForm,
    visibleFormCapLaiMatKhau,
    setVisibleFormCapLaiMatKhau,
    setRecord,
  } = useModel('user');
  const columns: IColumn<Login.Profile>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      search: 'search',
      notRegex: true,
    },
    {
      title: 'Mã định danh',
      dataIndex: 'ma_dinh_danh',
      width: 200,
      align: 'center',
      search: 'search',
      notRegex: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngay_sinh',
      width: 200,
      align: 'center',
      render: (val: string) => <div>{val ? val?.split('-')?.reverse()?.join('-') : ''}</div>,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioi_tinh',
      width: 100,
      align: 'center',
      render: (val) => <div>{val ? data?.gioiTinh?.[Number(val)] : ''}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record) => (
        <>
          <Tooltip title="Cấp lại mật khẩu">
            <Button
              onClick={() => {
                setVisibleFormCapLaiMatKhau(true);
                setRecord(record);
              }}
              icon={<ReloadOutlined />}
              shape="circle"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              onClick={() => {
                setVisibleForm(true);
                setRecord(record);
              }}
              icon={<EditOutlined />}
              shape="circle"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        title="Quản lý tài khoản"
        columns={columns}
        getData={getUserModel}
        dependencies={[page, limit, condition]}
        modelName="user"
        loading={loading}
        Form={FormUser}
      >
        <Select
          onChange={(val) => {
            setCondition({ ...condition, vai_tro: val });
          }}
          style={{ width: 200 }}
          value={condition?.vai_tro}
        >
          {Object.keys(Role)?.map((item) => (
            <Select.Option value={item} key={item}>
              {Role[item]}
            </Select.Option>
          ))}
        </Select>
      </TableBase>
      <Modal
        destroyOnClose
        footer={false}
        bodyStyle={{ padding: 0 }}
        visible={visibleFormCapLaiMatKhau}
        onCancel={() => {
          setVisibleFormCapLaiMatKhau(false);
        }}
      >
        <FormCapLaiMatKhau />
      </Modal>
    </>
  );
};

export default QuanLyTaiKhoan;
