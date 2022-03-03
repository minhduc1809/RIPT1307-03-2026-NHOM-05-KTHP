import Header from '@/components/Header';
import { ArrowLeftOutlined, ArrowRightOutlined, ContainerOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card } from 'antd';
import { history, useModel } from 'umi';

const DanhSachPhuongThuc = () => {
  const { record } = useModel('namtuyensinh');
  const { record: recordPhuongThuc } = useModel('phuongthuctuyensinh');
  return (
    <>
      <Header />
      <Card
        bodyStyle={{ fontSize: 16 }}
        title={
          <Breadcrumb>
            <Breadcrumb.Item href="/phuongthucxettuyen">
              <ContainerOutlined />
              <span>Danh sách phương thức xét tuyển</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{recordPhuongThuc?.tenPhuongThuc}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          <h2>Xét tuyển kết hợp theo Đề án tuyển sinh của Học viện</h2>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              record?.danhSachPhuongThuc?.find(
                (item) => item.phuongThucTuyenSinh._id === recordPhuongThuc?._id,
              )?.moTaPhuongThuc ?? '',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => {
              history.push('/phuongthucxettuyen');
            }}
            icon={<ArrowLeftOutlined />}
          >
            Quay lại
          </Button>
          <Button
            type="primary"
            onClick={() => {
              history.push('/dotxettuyen');
              window.scroll({ top: 0 });
            }}
            icon={<ArrowRightOutlined />}
          >
            Tiếp theo
          </Button>
        </div>
      </Card>
      {/* <Footer /> */}
    </>
  );
};

export default DanhSachPhuongThuc;
