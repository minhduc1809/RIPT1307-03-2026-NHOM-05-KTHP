import { Popconfirm, Button, Form } from 'antd';
import TableNguyenVong from './components/TableNguyenVong';
import { useModel } from 'umi';
import { ArrowLeftOutlined, CheckOutlined, SaveOutlined } from '@ant-design/icons';

const DangKyNguyenVong = () => {
  const { danhSachNguyenVong, setCurrent } = useModel('hosothisinh');
  return (
    <Form style={{ backgroundColor: '#fff', padding: 24 }} onFinish={(values) => {}}>
      <TableNguyenVong />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
        <Popconfirm
          title={
            <>
              <p>Các thông tin vừa nhập sẽ bị mất nếu bạn chưa lưu.</p>
              <p>Bạn có muốn quay lại bước 2?</p>
            </>
          }
          okText="Có"
          cancelText="Không"
          onConfirm={() => {
            setCurrent(1);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }}
        >
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Bước 2/4
          </Button>
        </Popconfirm>
        <Button
          style={{ float: 'right', marginBottom: 8 }}
          type="primary"
          icon={<SaveOutlined />}
          htmlType="submit"
          // onClick={e => this.handleSubmit(e, true)}
        >
          Lưu
        </Button>
        <Button
          disabled={danhSachNguyenVong.length === 0}
          type="primary"
          icon={<CheckOutlined />}
          htmlType="submit"
        >
          Bước 4/4
        </Button>
      </div>
      {/* </Spin> */}
    </Form>
  );
};

export default DangKyNguyenVong;
