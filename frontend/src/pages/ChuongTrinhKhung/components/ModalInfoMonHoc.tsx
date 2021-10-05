import { Descriptions } from 'antd';
import { useModel } from 'umi';

const InFoMonHoc = () => {
  const { infoMonHoc } = useModel('loptinchi');
  return (
    <Descriptions layout="vertical">
      <Descriptions.Item span={3} label={<b>Nội dung chi tiết</b>}>
        <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.noi_dung_chi_tiet ?? '' }} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>Mục tiêu kiến thức</b>}>
        <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_kien_thuc ?? '' }} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>Mục tiêu kỹ năng</b>}>
        <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_ky_nang ?? '' }} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>Mục tiêu thái độ</b>}>
        <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_thai_do ?? '' }} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>Yêu cầu về cơ sở vật chất</b>}>
        <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.yeu_cau_ve_csvc ?? '' }} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default InFoMonHoc;
