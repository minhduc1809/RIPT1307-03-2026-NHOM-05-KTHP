import TableBase from '@/components/Table';
import { PhamVi } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Select, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import Form from './components/Form';
import ViewThongBao from './components/ViewThongBao';

const ThongBao = () => {
  const {
    getThongBaoAdminModel,
    page,
    limit,
    loading,
    condition,
    setCondition,
    setEdit,
    setVisibleForm,
    deleteThongBaoModel,
    setRecord,
    record,
    setPage,
    setPhamVi,
    phamVi,
  } = useModel('thongbao');
  const [visible, setVisible] = useState<boolean>(false);

  const access = useAccess();
  const {
    getLopHanhChinhAdminModel,
    condition: condLopHanhChinh,
    getAllHinhThucDaoTaoModel,
    danhSachHinhThucDaoTao,
  } = useModel('lophanhchinh');
  const { getAllNganhModel } = useModel('nganh');
  const { adminGetLopTinChi, condition: condLopTinChi } = useModel('loptinchi');
  const { getKhoaHocModel } = useModel('khoahoc');
  const { conditionNguoiDungCuThe, getUserMetaDataFilterModel, setConditionNguoiDungCuThe } =
    useModel('user');
  const { getAllDonViModel } = useModel('donvi');
  const canCreate = useCheckAccess('thong-bao:create');
  const canUpdate = useCheckAccess('thong-bao:update');
  const canDelete = useCheckAccess('thong-bao:delete');
  useEffect(() => {
    getUserMetaDataFilterModel(1, 100);
  }, [conditionNguoiDungCuThe]);

  useEffect(() => {
    adminGetLopTinChi(100);
  }, [condLopTinChi]);

  useEffect(() => {
    getLopHanhChinhAdminModel({ page: 1, limit: 100 });
  }, [condLopHanhChinh]);

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
    getAllDonViModel();
    getAllNganhModel();
    getKhoaHocModel({ pageParam: 1, limitParam: 1000 });
    return () => {
      setConditionNguoiDungCuThe({});
    };
  }, []);

  const onCell = (recordThongBao: ThongBao.Record) => ({
    onClick: () => {
      setVisible(true);
      setRecord(recordThongBao);
    },
    style: { cursor: 'pointer' },
  });
  const columns: IColumn<ThongBao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Người gửi',
      dataIndex: 'senderName',
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      search: 'search',
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Đối tượng',
      dataIndex: 'loaiDoiTuong',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{val}</div>,
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTaoId',
      align: 'center',
      width: 200,
      hide: !access.admin,
      onCell,
      render: (val, recordThongBao) => (
        <div>
          {recordThongBao?.phamVi === 'Tất cả'
            ? 'Tất cả'
            : danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (recordThongBao: ThongBao.Record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => {
                setRecord(recordThongBao);
                setVisible(true);
              }}
              shape="circle"
              type="primary"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Sửa">
            <Button
              disabled={!canUpdate}
              onClick={() => {
                setRecord(recordThongBao);
                setEdit(true);
                setVisibleForm(true);
              }}
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              disabled={!canDelete}
              onConfirm={() => {
                deleteThongBaoModel(recordThongBao._id);
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button
                disabled={!canDelete}
                shape="circle"
                type="primary"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];
  return (
    <>
      <TableBase
        scroll={{ x: 1400 }}
        title="Quản lý thông báo"
        columns={columns}
        modelName="thongbao"
        hascreate={canCreate}
        Form={Form}
        widthDrawer="60%"
        formType="Drawer"
        getData={getThongBaoAdminModel}
        dependencies={[page, limit, condition, phamVi]}
      >
        {(access.adminVaQuanTri || access.nhanVien) && (
          <>
            <Select
              onChange={(val) => {
                setCondition({ ...condition, hinhThucDaoTaoId: undefined });
                setPhamVi(val);
                setPage(1);
              }}
              style={{ width: 170, marginRight: 8 }}
              value={phamVi}
            >
              {PhamVi.map((item) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            <Select
              allowClear
              disabled={phamVi === 'Tất cả'}
              placeholder="Lọc theo hình thức đào tạo"
              value={condition?.hinhThucDaoTaoId}
              onChange={(val: number) => {
                setCondition({ ...condition, hinhThucDaoTaoId: val });
              }}
              style={{ marginBottom: 8, width: 250, marginRight: 8 }}
            >
              {danhSachHinhThucDaoTao?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_hinh_thuc_dao_tao}
                </Select.Option>
              ))}
            </Select>
          </>
        )}
      </TableBase>
      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>
        }
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Chi tiết thông báo"
      >
        <ViewThongBao record={record} />
      </Modal>
    </>
  );
};

export default ThongBao;
