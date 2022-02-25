import TruongTHPT from '@/components/TruongTHPT';
import { Divider, Radio, Col } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useState } from 'react';

type Props = {
  form: FormInstance<any>;
};

const InfoTruongTHPT = (props: Props) => {
  const [isChuyenTruong, setIsChuyenTruong] = useState<boolean>(false);
  return (
    <>
      {' '}
      <Divider plain>
        <b>Thông tin về trường THPT mà bạn theo học</b>
      </Divider>
      <div style={{ width: '100%' }}>
        <b style={{ marginRight: '12px' }}>
          Bạn có chuyển trường trong thời gian học tập THPT không ?
        </b>
        <Radio.Group
          onChange={(e) => {
            setIsChuyenTruong(e.target.value);
          }}
          value={isChuyenTruong}
        >
          <Radio value={false}>Không</Radio>
          <Radio value={true}>Có</Radio>
        </Radio.Group>
      </div>
      {!isChuyenTruong ? (
        <Col span={24}>
          <TruongTHPT
            form={props.form}
            fields={{
              tinh: ['diaChi', 'maTinh'],
              quanHuyen: ['diaChi', 'maQuanHuyen'],
              xaPhuong: ['diaChi', 'maPhuongXa'],
              diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
            }}
            // setTen={{ setTenTinh, setTenQuanHuyen, setTenXaPhuong }}
          />
        </Col>
      ) : (
        <>
          <Col span={24}>
            <b style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%' }}>Lớp 10</b>
            <TruongTHPT
              form={props.form}
              fields={{
                tinh: ['diaChi', 'maTinh'],
                quanHuyen: ['diaChi', 'maQuanHuyen'],
                xaPhuong: ['diaChi', 'maPhuongXa'],
                diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
              }}
            />
          </Col>
          <Col style={{ marginTop: 20 }} span={24}>
            <b style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%' }}>Lớp 11</b>
            <TruongTHPT
              form={props.form}
              fields={{
                tinh: ['diaChi', 'maTinh'],
                quanHuyen: ['diaChi', 'maQuanHuyen'],
                xaPhuong: ['diaChi', 'maPhuongXa'],
                diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
              }}
            />
          </Col>
          <Col style={{ marginTop: 20 }} span={24}>
            <b style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%' }}>Lớp 12</b>
            <TruongTHPT
              form={props.form}
              fields={{
                tinh: ['diaChi', 'maTinh'],
                quanHuyen: ['diaChi', 'maQuanHuyen'],
                xaPhuong: ['diaChi', 'maPhuongXa'],
                diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
              }}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default InfoTruongTHPT;
