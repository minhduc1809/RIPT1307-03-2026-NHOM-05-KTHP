import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormHDSD from './FormHDSD';

const TableHDSD = () => {
  const {
    visibleFormHDSD,
    danhSachHDSD,
    setDanhSachHDSD,
    setRecordHDSD,
    setEditHDSD,
    setVisibleFormHDSD,
  } = useModel('dottuyensinh');

  const columns: IColumn<HuongDanSuDung.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      // width: 80,
      align: 'center',
    },

    {
      title: 'Tên hướng dẫn',
      dataIndex: 'tenHuongDan',
      // width: 200,
      align: 'center',
    },
    {
      title: 'Tệp đính kèm',
      dataIndex: 'tepDinhKem',
      align: 'center',
      render: (val: string) => {
        return (
          <a href={val} target="_blank" rel="noreferrer">
            {val?.split('/')?.pop()}
          </a>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      // width: 200,
      render: (record: HuongDanSuDung.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditHDSD(true);
                setVisibleFormHDSD(true);
                setRecordHDSD(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Button
              onClick={() => {
                const listHDSDTemp = [...danhSachHDSD];
                listHDSDTemp.splice(record.index - 1, 1);
                setDanhSachHDSD(listHDSDTemp);
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
      <Table
        otherProps={{
          pagination: false,
          size: 'small',
        }}
        data={danhSachHDSD?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisibleFormHDSD(true);
            setEditHDSD(false);
            setRecordHDSD(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        destroyOnClose
        visible={visibleFormHDSD}
        onCancel={() => {
          setVisibleFormHDSD(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormHDSD />
      </Modal>
    </>
  );
};

export default TableHDSD;
