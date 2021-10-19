import logo from '@/assets/logo.png';
import { ip } from '@/utils/constants';
import { Button, Descriptions, List } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const HocLieuSo = () => {
  const { infoMonHoc, getInfoMonHocModel, record } = useModel('loptinchi');

  useEffect(() => {
    getInfoMonHocModel(record?.mon_hoc_ids?.[0]);
  }, []);

  return (
    <>
      <List
        grid={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }}
        size="small"
        itemLayout="horizontal"
        dataSource={infoMonHoc ? [infoMonHoc] : []}
        renderItem={(item) => (
          <List.Item key={item?.id}>
            <List.Item.Meta
              key={item?.id}
              avatar={<img src={logo} style={{ width: 35, height: 40 }} />}
              title={item?.ten_hoc_phan}
              description={
                <>
                  <div>
                    Mã môn học: {item?.ma_hoc_phan_moi} - Số tín chỉ: {item?.so_tin_chi}
                  </div>
                  <br />
                </>
              }
            />
          </List.Item>
        )}
      />
      <Descriptions bordered labelStyle={{ minWidth: 200, width: 200 }}>
        <Descriptions.Item span={3} label="Học liệu số">
          <Button
            onClick={() => {
              window.open(`https://dhs.ptit.edu.vn${infoMonHoc?.url_danh_sach_hoc_lieu}`);
            }}
            type="primary"
          >
            Vào học
          </Button>
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Nội dung chi tiết">
          <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.noi_dung_chi_tiet ?? '' }} />
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Mục tiêu kiến thức">
          <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_kien_thuc ?? '' }} />
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Mục tiêu kỹ năng">
          <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_ky_nang ?? '' }} />
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Mục tiêu thái độ">
          <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_thai_do ?? '' }} />
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Yêu cầu về cơ sở vật chất">
          <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.yeu_cau_ve_csvc ?? '' }} />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default HocLieuSo;
