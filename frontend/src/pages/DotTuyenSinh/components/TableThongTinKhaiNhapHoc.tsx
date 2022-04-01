import Table from '@/components/Table/Table';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormKhaiThongTinNhapHoc from './FormThongTinKhaiNhapHoc';

const TableKhaiThongTinNhapHoc = () => {
  const modelDotTuyenSinh = useModel('dottuyensinh');
  const {
    setVisibleFormThongTinKhaiXacNhan,
    visibleFormThongTinKhaiXacNhan,
    setdanhSachThongTinKhaiXacNhan,
    danhSachThongTinKhaiXacNhan,
    setEditGiayTo,
    setRecordThongTinKhaiXacNhan,
  } = modelDotTuyenSinh;

  const visibleForm = (show: boolean) => {
    setVisibleFormThongTinKhaiXacNhan(show);
  };

  const columns: IColumn<KetQuaXetTuyen.ThongTinKhaiXacNhan>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'tieuDe',
      align: 'center',
      search: 'search',
      render: (val, recordThongTin) => (
        <div>
          {val}
          {recordThongTin?.textHuongDan?.length || recordThongTin?.urlHuongDan?.length ? (
            <Tooltip placement="bottom" title="Xem hướng dẫn">
              <QuestionCircleOutlined
                style={{ marginLeft: '5px' }}
                onClick={() => {
                  Modal.info({
                    title: (
                      <div>
                        <div>{recordThongTin?.textHuongDan ?? ''}</div>
                        {recordThongTin?.urlHuongDan?.length && <div>File hướng dẫn đính kèm:</div>}
                        {recordThongTin?.urlHuongDan?.map((item, indexChungChi) => (
                          <a key={item} href={item} target="_blank" rel="noreferrer">
                            <Tag
                              style={{ marginTop: 8 }}
                              color={Setting.primaryColor}
                            >{`Xem tập tin ${indexChungChi + 1}  `}</Tag>
                          </a>
                        ))}
                      </div>
                    ),
                  });
                }}
              />
            </Tooltip>
          ) : (
            <div />
          )}
        </div>
      ),
    },

    {
      title: 'Hướng dẫn',
      dataIndex: 'textHuongDan',
      align: 'center',
      width: 200,
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 80,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditGiayTo(true);
                visibleForm(true);
                setRecordThongTinKhaiXacNhan(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => {
                const listThongTinTemp = [...danhSachThongTinKhaiXacNhan];
                listThongTinTemp.splice(record.index - 1, 1);
                setdanhSachThongTinKhaiXacNhan(listThongTinTemp);
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        otherProps={{
          pagination: false,
          size: 'small',
        }}
        data={danhSachThongTinKhaiXacNhan?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns?.filter((item) => item.hide !== true)}
      >
        <Button
          style={{ marginBottom: 8 }}
          type="primary"
          onClick={() => {
            visibleForm(true);
            setEditGiayTo(false);
            setRecordThongTinKhaiXacNhan(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        destroyOnClose
        visible={visibleFormThongTinKhaiXacNhan}
        onCancel={() => {
          visibleForm(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormKhaiThongTinNhapHoc />
      </Modal>
    </>
  );
};

export default TableKhaiThongTinNhapHoc;
