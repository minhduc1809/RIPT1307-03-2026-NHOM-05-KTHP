import { EditOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Drawer, Modal, Table, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from '../components/FormKhaiBao';
import TableLichSuKhaiBao from '../index';

const KhaiBaoSucKhoeUser = () => {
  const {
    getBieuMauKhaiBaoYTeModel,
    bieuMau,
    visibleForm,
    setVisibleForm,
    visibleLichSuKhaiBao,
    setVisibleLichSuKhaiBao,
  } = useModel('khaibaosuckhoe');

  useEffect(() => {
    getBieuMauKhaiBaoYTeModel();
  }, []);

  return (
    <Card title="Khai báo sức khỏe">
      <Table
        pagination={false}
        dataSource={[{ ...bieuMau, index: 1 }]}
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
            render: () => (
              <>
                <Tooltip title="Thực hiện khai báo">
                  <Button
                    onClick={() => {
                      setVisibleForm(true);
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
        width="60%"
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
    </Card>
  );
};

export default KhaiBaoSucKhoeUser;
