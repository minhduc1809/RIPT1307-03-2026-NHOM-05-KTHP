import Header from '@/components/Header';
import { ArrowLeftOutlined, ArrowRightOutlined, ContainerOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Breadcrumb, Button, Card, Spin } from 'antd';
import { history, useModel } from 'umi';
import GlobalFooter from '@/components/GlobalFooter';

const DanhSachPhuongThuc = () => {
  const { record, getDotTuyenSinhByIdModel, loading } = useModel('dottuyensinh');
  const { getPhuongThucTuyenSinhByIdModel, record: recordPhuongThuc } =
    useModel('phuongthuctuyensinh');
  const idDot = localStorage.getItem('dot');
  const phuongThuc = localStorage.getItem('phuongThuc');
  useEffect(() => {
    if (idDot && !record?._id) getDotTuyenSinhByIdModel(idDot);
  }, [idDot]);

  useEffect(() => {
    if (phuongThuc) getPhuongThucTuyenSinhByIdModel(phuongThuc);
  }, [phuongThuc]);

  return (
    <>
      <Header />
      <Spin spinning={loading}>
        <Card
          bodyStyle={{ fontSize: 16 }}
          title={
            <Breadcrumb>
              <Breadcrumb.Item href="/dotxettuyen">
                <ContainerOutlined />
                <span>Danh sách đợt tuyển sinh</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{record?.tenDotTuyenSinh ?? ''}</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          {phuongThuc && (
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <h2>{recordPhuongThuc?.tenPhuongThuc?.toUpperCase()}</h2>
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{
              __html: record?.moTa ?? '',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                history.push(phuongThuc ? '/dotxettuyen' : '/phuongThucXetTuyen');
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
              icon={<ArrowLeftOutlined />}
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              onClick={() => {
                history.push('/dangkyxettuyen');
                window.scroll({ top: 0 });
              }}
              icon={<ArrowRightOutlined />}
            >
              Tiếp theo
            </Button>
          </div>
        </Card>{' '}
      </Spin>
      <GlobalFooter />
    </>
  );
};

export default DanhSachPhuongThuc;
