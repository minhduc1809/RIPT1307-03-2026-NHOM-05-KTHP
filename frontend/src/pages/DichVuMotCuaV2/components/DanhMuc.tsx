import { Descriptions } from 'antd';
import { useModel } from 'umi';

const DanhMuc = () => {
  const { thuTuc } = useModel('dichvumotcuav2');
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>
        Thủ tục số: {thuTuc?.maThuTuc} {thuTuc?.tenThuTuc}
      </h2>
      <b style={{ marginLeft: '18%', color: 'black' }}>1.Thông tin thủ tục</b>
      <div style={{ marginLeft: '18%', marginRight: '18%' }}>
        <Descriptions
          style={{ marginBottom: '15px', marginTop: '5px' }}
          size="small"
          bordered
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Tên thủ tục hành chính">{thuTuc?.tenThuTuc}</Descriptions.Item>
          <Descriptions.Item label="Mã thủ tục">{thuTuc?.maThuTuc}</Descriptions.Item>
          <Descriptions.Item label="Lĩnh vực">{thuTuc?.linhVuc}</Descriptions.Item>
          <Descriptions.Item label="Đơn vị thực hiện">{thuTuc?.donViThucHien}</Descriptions.Item>
          <Descriptions.Item label="Cấp độ">{thuTuc?.capDo}</Descriptions.Item>
          <Descriptions.Item label="Thời hạn giải quyết">
            {thuTuc?.thoiHanGiaiQuyet}
          </Descriptions.Item>
          <Descriptions.Item label="TTHC yêu cầu trả phí, lệ phí">
            {thuTuc?.yeuCauTraPhi}
          </Descriptions.Item>
          <Descriptions.Item label="Cơ quan có thẩm quyền">
            {thuTuc?.coQuanCoThamQuyen}
          </Descriptions.Item>
          <Descriptions.Item label="Phạm vi phục vụ">{thuTuc?.phamViPhucVu}</Descriptions.Item>
          <Descriptions.Item label="Kết quả thực hiện">{thuTuc?.ketQuaThucHien}</Descriptions.Item>
          <Descriptions.Item label="Mẫu biểu">{thuTuc?.mauBieu}</Descriptions.Item>
          <Descriptions.Item label="Lưu ý">{thuTuc?.luuY}</Descriptions.Item>
        </Descriptions>
      </div>
      <b style={{ marginLeft: '18%', color: 'black' }}>2. Hồ sơ</b>
      <p style={{ marginLeft: '18%' }} dangerouslySetInnerHTML={{ __html: thuTuc?.hoSo ?? '' }}></p>
      <b style={{ marginLeft: '18%', color: 'black' }}>3. Quy trình thực hiện</b>
      <p
        style={{ marginLeft: '18%', marginRight: '18%' }}
        dangerouslySetInnerHTML={{ __html: thuTuc?.quyTrinhThucHien ?? '' }}
      ></p>
      <b style={{ marginLeft: '18%', color: 'black' }}>4. Yêu cầu</b>
      <p style={{ marginLeft: '18%', marginRight: '18%' }}>{thuTuc?.yeuCau}</p>
    </div>
  );
};

export default DanhMuc;
