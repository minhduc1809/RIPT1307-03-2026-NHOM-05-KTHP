import {
  BankOutlined,
  CheckSquareOutlined,
  ContainerOutlined,
  DollarOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import DangKyXetTuyen from './DangKyXetTuyen';
import NhapHoc from './NhapHoc';
import XacNhanNhapHoc from './XacNhanNhapHoc';
import { useModel } from 'umi';
import ThanhToan from '@/components/ThanhToan';
import VanBanHuongDan from './HuongDan';

const ChiTietHoSo = (props: {
  location: {
    query: {
      idDot: string;
      idPhuongThuc: string;
    };
  };
}) => {
  const { tab, setTab } = useModel('hosothisinh');
  const onChangeTab = (key: string) => {
    setTab(key);
  };
  return (
    <Card
      bodyStyle={{ paddingTop: 10 }}
      title={
        <Breadcrumb>
          <Breadcrumb.Item href="/hosothisinh/dottuyensinh">
            <ContainerOutlined />
            <span>Đợt {props.location.query.idDot} năm 2022</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item
            href={`/hosothisinh/dottuyensinh/dot?idDot=${props.location.query.idDot}`}
          >
            <ContainerOutlined />
            <span>Danh sách phương thức xét tuyển</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Phương thức {props.location.query.idPhuongThuc}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs onChange={onChangeTab} defaultActiveKey={tab}>
        <Tabs.TabPane
          tab={
            <>
              <FormOutlined /> Đăng ký xét tuyển
            </>
          }
          key="1"
        >
          <DangKyXetTuyen idDot={props.location.query.idDot} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <>
              <CheckSquareOutlined /> Xác nhận nhập học
            </>
          }
          key="2"
        >
          <XacNhanNhapHoc />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <>
              <BankOutlined />
              Nhập học
            </>
          }
          key="3"
        >
          <NhapHoc idDot={props.location.query.idDot} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <>
              <DollarOutlined />
              Thanh toán
            </>
          }
          key="4"
        >
          <ThanhToan />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <>
              <FileTextOutlined />
              Hướng dẫn
            </>
          }
          key="5"
        >
          <VanBanHuongDan />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default ChiTietHoSo;
