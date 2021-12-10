import { Button, Descriptions } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const HocLieuSo = () => {
  const { infoMonHoc, getInfoMonHocModel, record } = useModel('loptinchi');

  useEffect(() => {
    getInfoMonHocModel(record?.mon_hoc_ids?.[0]);
  }, []);

  return (
    <>
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
          {infoMonHoc?.noi_dung_chi_tiet && (
            <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.noi_dung_chi_tiet ?? '' }} />
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Mục tiêu kiến thức">
          {infoMonHoc?.objective_kien_thuc && (
            <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_kien_thuc ?? '' }} />
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Mục tiêu kỹ năng">
          {infoMonHoc?.objective_ky_nang && (
            <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_ky_nang ?? '' }} />
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Mục tiêu thái độ">
          {infoMonHoc?.objective_thai_do && (
            <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.objective_thai_do ?? '' }} />
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Yêu cầu về cơ sở vật chất">
          {infoMonHoc?.yeu_cau_ve_csvc && (
            <div dangerouslySetInnerHTML={{ __html: infoMonHoc?.yeu_cau_ve_csvc ?? '' }} />
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default HocLieuSo;
