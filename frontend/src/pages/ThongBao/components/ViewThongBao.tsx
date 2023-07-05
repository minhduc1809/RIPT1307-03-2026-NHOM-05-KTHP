import { type ThongBao } from '@/services/ThongBao/typing';
import { getNameFile } from '@/utils/utils';
import { Avatar, Button, Card, Col, Row, Divider } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useAccess } from 'umi';
import './style.less';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

export const OneSignalDataToPath = (oneSignalData: any, sinhVien: boolean, nhanVien: boolean) => {
  let path = '';
  switch (oneSignalData?.notifType) {
    case 'LOP_HANH_CHINH':
      path = sinhVien
        ? '/hoctap/lophanhchinh'
        : oneSignalData?.idLopHanhChinh
        ? `/lophanhchinh/${oneSignalData?.idLopHanhChinh}`
        : '';
      break;
    case 'DAILY_NOTIF_ALL':
      path = '/calendar';
      break;
    case 'LOP_TIN_CHI':
    case 'DIEM_DANH':
      path = oneSignalData?.idLopTinChi
        ? (sinhVien ? '/hoctap/loptinchi/' : '/loptinchi/danhsachlop/') + oneSignalData?.idLopTinChi
        : '';
      break;
    case 'LICH_TUAN':
      path = '/vanphongso/lichtuan';
      break;
    case 'THAC_MAC_DIEM':
      path = '/hoctap/gochoctap';
      break;
      // case 'DICH_VU_MOT_CUA':
      //   // path = sinhVien ? '/dichvumotcuasv' : '/vanphongsonhanvien/lichsu';
      //   path = sinhVien
      //     ? '/dichvumotcuasv'
      //     : oneSignalData?.maDichVu === MaDichVuVps.BAO_CAO_SU_CO
      //     ? '/vanphongso/baocaosuco'
      //     : oneSignalData?.maDichVu === MaDichVuVps.MUON_PHONG_HOC
      //     ? '/vanphongso/phonghop/dondangky'
      //     : '/vanphongso/xecong/dondangky';

      break;
    default:
      path = '';
  }
  return path;
};

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void }) => {
  const access = useAccess();
  const { record, afterViewDetail } = props;
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    // const path = OneSignalDataToPath(record?.oneSignalData, access.sinhVien, access.nhanVien);
    // setPathname(path);
  }, [record?._id]);

  const redirectNotif = () => {
    if (pathname) {
      if (afterViewDetail) afterViewDetail();
      history.push({ pathname, query: {} });
    }
  };

  return (
    <Card title={record?.title}>
      <Card.Meta
        avatar={record?.imageUrl ? <Avatar src={record?.imageUrl} size="large" /> : false}
        description={
          <>
            <div>{record?.description}</div>
            <UserOutlined /> {record?.senderName ?? ''} <Divider type="vertical" />
            <CalendarOutlined /> {moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}
          </>
        }
      />
      <br />
      <div dangerouslySetInnerHTML={{ __html: record?.content ?? '' }} className="notif-content" />
      <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
        {/* {record?.urlFile?.length ? (
          <>
            <Col span={24}>File đính kèm: </Col>
            {record?.urlFile?.map((item) => (
              <Col span={24} key={item}>
                <a href={item}>{getNameFile(item)}</a>
              </Col>
            ))}
          </>
        ) : null} */}

        {pathname && afterViewDetail ? (
          <Col span={24}>
            <Button type="primary" onClick={redirectNotif}>
              Xem chi tiết
            </Button>
          </Col>
        ) : null}
      </Row>
    </Card>
  );
};

export default ViewThongBao;
