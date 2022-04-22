import type { IColumn } from '@/utils/interfaces';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Button, Divider, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import FormChiTieu from './FormChiTieu';
import FormKhoiTaoChiTieu from './FormKhoiTaoChiTieu';

const TableChiTieu = (props: { idCoSo?: string }) => {
  const { record } = useModel('dottuyensinh');

  const {
    getChiTieuByIdDotTuyenSinhIdCoSoModel,
    record: recordChiTieu,
    loading,
    setRecord,
    setEdit,
    visibleForm,
    setVisibleForm,
    setRecordChiTieuChiTiet,
    putChiTieuModel,
  } = useModel('chitieu');

  const { record: recordCoSo } = useModel('cosodaotao');

  const [visibleFormKhoiTao, setVisibleFormKhoiTao] = useState<boolean>(false);

  useEffect(() => {
    if (record?._id && props?.idCoSo) {
      getChiTieuByIdDotTuyenSinhIdCoSoModel(record?._id, props?.idCoSo);
    } else {
      setRecord(undefined);
    }
  }, [record?._id, props?.idCoSo, recordCoSo?._id]);

  const columns: IColumn<ChiTieu.ChiTieuChiTiet>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Ngành',
      width: 200,
      dataIndex: 'danhSachNganhChuyenNganh',
      align: 'center',
      render: (val: NganhChuyenNganh.Record[]) => (
        <div style={{ textAlign: 'left' }}>
          {val?.map((item) => (
            <div key={item._id}>
              - {item?.ten} ({item?.ma})
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Đối tượng',
      width: 250,
      dataIndex: 'danhSachThongTinDoiTuong',
      align: 'center',
      render: (val: DoiTuongTuyenSinh.Record[]) => (
        <div style={{ textAlign: 'left' }}>
          {val?.map((item) => (
            <div key={item._id}>- {item?.tenDoiTuong}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tổ hợp',
      width: 150,
      align: 'center',
      dataIndex: 'danhSachToHopXetTuyen',
      render: (val: string[]) => <div>{val?.join(', ')}</div>,
    },
    {
      title: 'Chỉ tiêu số lượng',
      width: 100,
      align: 'center',
      dataIndex: 'chiTieuSoLuong',
    },
    {
      title: 'Phần trăm trội',
      width: 100,
      align: 'center',
      dataIndex: 'phanTramTroi',
    },
    {
      title: 'Chỉ tiêu điểm',
      width: 100,
      align: 'center',
      dataIndex: 'chiTieuDiem',
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (recordChiTieuChiTiet: ChiTieu.ChiTieuChiTiet) => (
        <div>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecordChiTieuChiTiet(recordChiTieuChiTiet);
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
              onConfirm={() => {
                putChiTieuModel({
                  dotTuyenSinh: record?._id ?? '',
                  coSoDaoTao: props?.idCoSo ?? '',
                  danhSachChiTieuChiTiet:
                    recordChiTieu?.danhSachChiTieuChiTiet
                      ?.filter((item) => item?._id !== recordChiTieuChiTiet?._id)
                      ?.map((item) => ({
                        ...item,
                        danhSachNganhChuyenNganh: item?.danhSachNganhChuyenNganh?.map(
                          (nganh) => nganh._id,
                        ),
                      })) ?? [],
                });
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button shape="circle" type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button
        onClick={() => {
          setEdit(false);
          setVisibleForm(true);
          setRecordChiTieuChiTiet(undefined);
        }}
        icon={<PlusCircleFilled />}
        style={{ marginRight: 8, marginBottom: 8 }}
        type="primary"
      >
        Thêm chỉ tiêu
      </Button>
      <Button onClick={() => setVisibleFormKhoiTao(true)} icon={<PlayCircleOutlined />}>
        Khởi tạo mặc định
      </Button>
      <h4 style={{ display: 'inline-block', margin: '0 0px 8px 50px', float: 'right' }}>
        Tổng số:
        <Input
          style={{ width: '90px', fontWeight: 600, fontSize: 14, marginLeft: 10 }}
          value={recordChiTieu?.danhSachChiTieuChiTiet?.length ?? 0}
          readOnly
          // ref={this.setTableBaseRef}
        />
      </h4>
      <Table
        loading={loading}
        dataSource={
          recordChiTieu?.danhSachChiTieuChiTiet?.map((item, index) => ({
            ...item,
            index: index + 1,
          })) ?? []
        }
        columns={columns}
      />
      <Modal
        footer={false}
        destroyOnClose
        visible={visibleForm}
        onCancel={() => {
          setVisibleForm(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        <FormChiTieu idCoSo={props?.idCoSo ?? ''} />
      </Modal>
      <Modal
        footer={false}
        destroyOnClose
        visible={visibleFormKhoiTao}
        onCancel={() => {
          setVisibleFormKhoiTao(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        <FormKhoiTaoChiTieu
          onCancel={() => setVisibleFormKhoiTao(false)}
          idCoSo={props?.idCoSo ?? ''}
        />
      </Modal>
    </>
  );
};

export default TableChiTieu;
