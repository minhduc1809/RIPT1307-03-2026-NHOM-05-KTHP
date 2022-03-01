import TableBase from '@/components/Table';
import { EditOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Modal, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from '../components/FormKhaiBao';
import TableLichSuKhaiBao from '../index';

const KhaiBaoSucKhoeUser = () => {
  const { visibleLichSuKhaiBao, setVisibleLichSuKhaiBao, setBieuMau, visibleForm, setVisibleForm } =
    useModel('khaibaosuckhoe');

  const { getBieuMauUserModel, setLoaiBieuMau, loading, page, limit, setDanhSach } =
    useModel('bieumau');

  useEffect(() => {
    setLoaiBieuMau('Khai báo y tế');
    return () => {
      setLoaiBieuMau(undefined);
      setDanhSach([]);
    };
  }, []);

  return (
    <>
      <TableBase
        title="Khai báo y tế"
        loading={loading}
        modelName="bieumau"
        dependencies={[page, limit]}
        getData={() => {
          getBieuMauUserModel('Khai báo y tế');
        }}
        columns={[
          { title: 'STT', dataIndex: 'index', align: 'center', width: 80 },
          { title: 'Tiêu đề', dataIndex: 'tieuDe', align: 'center' },
          {
            title: 'Đối tượng',
            dataIndex: 'doiTuong',
            align: 'center',
            width: 200,
          },
          {
            title: 'Loại',
            dataIndex: 'loai',
            align: 'center',
            width: 200,
          },
          {
            title: 'Thao tác',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (record) => (
              <>
                <Tooltip title="Thực hiện khai báo">
                  <Button
                    onClick={() => {
                      setVisibleForm(true);
                      setBieuMau(record);
                    }}
                    type="primary"
                    shape="circle"
                  >
                    <EditOutlined />
                  </Button>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="Lịch sử khai báo">
                  <Button
                    onClick={() => {
                      setVisibleLichSuKhaiBao(true);
                      setBieuMau(record);
                    }}
                    shape="circle"
                  >
                    <OrderedListOutlined />
                  </Button>
                </Tooltip>
              </>
            ),
          },
        ]}
      />
      <Drawer
        destroyOnClose
        onClose={() => {
          setVisibleForm(false);
        }}
        bodyStyle={{ padding: 0 }}
        visible={visibleForm}
        width="900px"
      >
        <Form />
      </Drawer>
      <Modal
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleLichSuKhaiBao(false);
            }}
          >
            OK
          </Button>
        }
        destroyOnClose
        width="80%"
        bodyStyle={{ padding: 0 }}
        visible={visibleLichSuKhaiBao}
        onCancel={() => {
          setVisibleLichSuKhaiBao(false);
        }}
      >
        <TableLichSuKhaiBao />
      </Modal>
    </>
  );
};

export default KhaiBaoSucKhoeUser;
