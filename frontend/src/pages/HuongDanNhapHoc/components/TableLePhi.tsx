import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Divider, Modal, Table, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormLePhi from './FormLePhi';

const TableLePhi = (props: { modelName: any; fieldName: string }) => {
  const model = useModel(props.modelName);
  const { danhSach: danhSachLePhi } = useModel('price');
  const danhSach = model?.[`danhSach${props.fieldName}`];
  const setDanhSach = model?.[`setDanhSach${props.fieldName}`];
  const visibleForm = model?.[`visibleForm${props.fieldName}`];
  const setVisibleForm = model?.[`setVisibleForm${props.fieldName}`];
  const setEdit = model?.[`setEdit${props.fieldName}`];
  const setRecord = model?.[`setRecord${props.fieldName}`];
  const columns: IColumn<DotNhapHoc.LePhi & ThanhToan.Price & { tenProduct: string }>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên lệ phí',
      dataIndex: 'tenProduct',
      width: 200,
      align: 'center',
      render: (val, record) => (
        <div>
          {val || danhSachLePhi?.find((item) => item._id === record.maLePhi)?.product?.name}
        </div>
      ),
    },
    {
      title: 'Mức giá',
      dataIndex: 'unitAmount',
      width: 200,
      align: 'center',
      render: (val, record) => {
        const populateLePhi = danhSachLePhi?.find((item) => item._id === record.maLePhi);
        return (
          <div>
            {currencyFormat(val || populateLePhi?.unitAmount)}{' '}
            {record?.currency || populateLePhi?.currency}
          </div>
        );
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 200,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      width: 200,
      align: 'center',
    },
    {
      title: 'Thao tác',
      width: 130,
      align: 'center',
      render: (record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord(record);
                setVisibleForm(true);
                setEdit(true);
              }}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Button
              onClick={() => {
                setDanhSach(danhSach?.filter((item: any) => item._id !== record._id));
              }}
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        onClick={() => {
          setEdit(false);
          setVisibleForm(true);
          setRecord(undefined);
        }}
        style={{ marginBottom: 8 }}
        type="primary"
        icon={<PlusCircleFilled />}
      >
        Thêm mới
      </Button>
      <Table
        pagination={false}
        columns={columns}
        dataSource={danhSach?.map((item: any, index: number) => ({ ...item, index: index + 1 }))}
      />
      <Modal
        destroyOnClose
        visible={visibleForm}
        onCancel={() => {
          setVisibleForm(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormLePhi modelName={props.modelName} fieldName={props.fieldName} />
      </Modal>
    </>
  );
};

export default TableLePhi;
