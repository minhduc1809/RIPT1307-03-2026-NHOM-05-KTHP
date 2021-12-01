import { Descriptions } from 'antd';
import { useModel } from 'umi';

const DanhMuc = (props: { button: any }) => {
  const { record } = useModel('dichvumotcuav2');
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>
        Thủ tục số: {record?.thongTinThuTuc?.maThuTuc} {record?.ten}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <b style={{ marginLeft: '18%', color: 'black' }}>1.Thông tin thủ tục</b>
        {props?.button}
      </div>

      <div style={{ marginLeft: '18%', marginRight: '18%' }}>
        <Descriptions
          style={{ marginBottom: '15px', marginTop: '5px', minWidth: 300 }}
          size="small"
          bordered
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Tên thủ tục hành chính">{record?.ten ?? ''}</Descriptions.Item>
          <Descriptions.Item label="Mã thủ tục">
            {record?.thongTinThuTuc?.maThuTuc}
          </Descriptions.Item>
          <Descriptions.Item label="Lĩnh vực">{record?.thongTinThuTuc?.linhVuc}</Descriptions.Item>
          <Descriptions.Item label="Đơn vị thực hiện">
            {record?.thongTinThuTuc?.donViThucHien}
          </Descriptions.Item>
          <Descriptions.Item label="Cấp độ">{record?.thongTinThuTuc?.capDo}</Descriptions.Item>
          <Descriptions.Item label="Thời hạn giải quyết">
            {record?.thongTinThuTuc?.thoiHanGiaiQuyet}
          </Descriptions.Item>
          <Descriptions.Item label="TTHC yêu cầu trả phí, lệ phí">
            {record?.thongTinThuTuc?.yeuCauTraPhi}
          </Descriptions.Item>
          <Descriptions.Item label="Cơ quan có thẩm quyền">
            {record?.thongTinThuTuc?.coQuanCoThamQuyen}
          </Descriptions.Item>
          <Descriptions.Item label="Phạm vi phục vụ">
            {record?.thongTinThuTuc?.phamViPhucVu}
          </Descriptions.Item>
          <Descriptions.Item label="Kết quả thực hiện">
            {record?.thongTinThuTuc?.ketQuaThucHien}
          </Descriptions.Item>
          <Descriptions.Item label="Mẫu biểu">{record?.thongTinThuTuc?.mauBieu}</Descriptions.Item>
          <Descriptions.Item label="Lưu ý">{record?.thongTinThuTuc?.luuY}</Descriptions.Item>
        </Descriptions>
      </div>
      <b style={{ marginLeft: '18%', color: 'black' }}>2. Hồ sơ</b>
      <p
        style={{ marginLeft: '18%' }}
        dangerouslySetInnerHTML={{ __html: record?.thongTinHoSo ?? '' }}
      />
      <b style={{ marginLeft: '18%', color: 'black' }}>3. Quy trình thực hiện</b>
      <p
        style={{ marginLeft: '18%', marginRight: '18%' }}
        dangerouslySetInnerHTML={{ __html: record?.thongTinQuyTrinh ?? '' }}
      />
      <b style={{ marginLeft: '18%', color: 'black' }}>4. Yêu cầu</b>
      <p
        style={{ marginLeft: '18%', marginRight: '18%' }}
        dangerouslySetInnerHTML={{ __html: record?.thongTinYeuCau ?? '' }}
      />
    </div>
  );
};

export default DanhMuc;
