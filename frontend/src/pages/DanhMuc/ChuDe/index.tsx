/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';

const LopTinChi = () => {
  const {
    loading,
    loaiChuDe,
    getAllLoaiChuDeModel,
    getChuDeModel,
    danhSachLoaiChuDe,
    setEdit,
    setVisibleForm,
    delChuDeModel,
    setRecord,
    page,
    limit,
    condition,
    setCondition,
    filterInfo,
    setLoaiChuDe,
  } = useModel('chude');
  const access = useAccess();
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');

  const handleEdit = (record: ChuDe.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const { initialState } = useModel('@@initialState');

  const columns: IColumn<ChuDe.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Mã chủ đề',
      dataIndex: '_id',
      align: 'center',
      width: 150,
      search: 'search',
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      search: 'search',
    },
    {
      title: 'Loại chủ đề',
      dataIndex: 'type',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'order',
      align: 'center',
      width: 120,
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTaoId',
      align: 'center',
      width: 200,
      render: (val) => (
        <div>{danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name ?? ''}</div>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: ChuDe.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              disabled={
                access?.quanTri === true &&
                initialState?.currentUser?.hinh_thuc_dao_tao_id !== record?.hinhThucDaoTaoId
              }
              onClick={() => handleEdit(record)}
              type="default"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              disabled={
                access?.quanTri === true &&
                initialState?.currentUser?.hinh_thuc_dao_tao_id !== record?.hinhThucDaoTaoId
              }
              onConfirm={() => delChuDeModel({ id: record._id })}
              title="Bạn có chắc chắn muốn xóa chủ đề này"
            >
              <Button
                disabled={
                  access?.quanTri === true &&
                  initialState?.currentUser?.hinh_thuc_dao_tao_id !== record?.hinhThucDaoTaoId
                }
                type="primary"
                shape="circle"
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (access.adminVaQuanTri) {
      getAllHinhThucDaoTaoModel();
    }
    getAllLoaiChuDeModel();
  }, []);

  const onChangeLoaiChuDe = (value: string) => {
    setLoaiChuDe(value);
  };

  return (
    <TableBase
      columns={columns}
      getData={getChuDeModel}
      loading={loading}
      hascreate
      dependencies={[loaiChuDe, page, limit, condition, filterInfo]}
      modelName="chude"
      title="Chủ đề chung"
      Form={Form}
    >
      {access.adminVaQuanTri && (
        <Select
          value={condition?.hinhThucDaoTaoId ?? -1}
          onChange={(val: number) => {
            setCondition({ ...condition, hinhThucDaoTaoId: val });
          }}
          style={{ marginBottom: 8, width: 250, marginRight: 8 }}
        >
          <Select.Option value={-1} key={-1}>
            Tất cả hình thức đào tạo
          </Select.Option>
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_hinh_thuc_dao_tao}
            </Select.Option>
          ))}
        </Select>
      )}
      <Select
        onChange={onChangeLoaiChuDe}
        value={loaiChuDe}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {[...danhSachLoaiChuDe, 'Tất cả']?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default LopTinChi;
