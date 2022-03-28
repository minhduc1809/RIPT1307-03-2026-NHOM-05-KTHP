import TruongTHPT from '@/components/TruongTHPT';
import { Col, Divider, Radio } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useModel } from 'umi';

type Props = {
  form: FormInstance<any>;
  setIsChuyenTruong: any;
  isChuyenTruong: boolean;
  cauHinh: any;
};

const InfoTruongTHPT = (props: Props) => {
  const { recordHoSo } = useModel('hosoxettuyen');

  return (
    <>
      <Divider plain>
        <b>Thông tin về trường THPT mà bạn theo học</b>
      </Divider>
      <div style={{ width: '100%' }}>
        <b style={{ marginRight: '12px' }}>
          Bạn có chuyển trường trong thời gian học tập THPT không ?
        </b>
        <Radio.Group
          onChange={(e) => {
            props?.setIsChuyenTruong(e.target.value);
          }}
          value={props?.isChuyenTruong}
        >
          <Radio value={false}>Không</Radio>
          <Radio value={true}>Có</Radio>
        </Radio.Group>
      </div>
      {!props?.isChuyenTruong ? (
        <Col span={24}>
          <TruongTHPT
            cauHinh={props.cauHinh}
            type="10"
            form={props.form}
            fields={{
              monChuyen: ['thongTinHocTapTHPT', 'truongLop10', 'monChuyen'],
              tinh: ['thongTinHocTapTHPT', 'truongLop10', 'maTinh'],
              quanHuyen: ['thongTinHocTapTHPT', 'truongLop10', 'maQuanHuyen'],
              truongTHPT: ['thongTinHocTapTHPT', 'truongLop10', 'maTruong'],
            }}
            initialValue={{
              maTinh: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTinh,
              maQuanHuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maQuanHuyen,
              maTruong: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTruong,
              monChuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.monChuyen,
            }}
          />
        </Col>
      ) : (
        <>
          <Col span={24}>
            <b style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%' }}>Lớp 10</b>
            <TruongTHPT
              cauHinh={props.cauHinh}
              type="10"
              form={props.form}
              fields={{
                monChuyen: ['thongTinHocTapTHPT', 'truongLop10', 'monChuyen'],
                tinh: ['thongTinHocTapTHPT', 'truongLop10', 'maTinh'],
                quanHuyen: ['thongTinHocTapTHPT', 'truongLop10', 'maQuanHuyen'],
                truongTHPT: ['thongTinHocTapTHPT', 'truongLop10', 'maTruong'],
              }}
              initialValue={{
                maTinh: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTinh,
                maQuanHuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maQuanHuyen,
                maTruong: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTruong,
                monChuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.monChuyen,
              }}
            />
          </Col>
          <Col style={{ marginTop: 20 }} span={24}>
            <b style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%' }}>Lớp 11</b>
            <TruongTHPT
              cauHinh={props.cauHinh}
              type="11"
              form={props.form}
              fields={{
                monChuyen: ['thongTinHocTapTHPT', 'truongLop11', 'monChuyen'],
                tinh: ['thongTinHocTapTHPT', 'truongLop11', 'maTinh'],
                quanHuyen: ['thongTinHocTapTHPT', 'truongLop11', 'maQuanHuyen'],
                truongTHPT: ['thongTinHocTapTHPT', 'truongLop11', 'maTruong'],
              }}
              initialValue={{
                maTinh: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTinh,
                maQuanHuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maQuanHuyen,
                maTruong: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTruong,
                monChuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.monChuyen,
              }}
            />
          </Col>
          <Col style={{ marginTop: 20 }} span={24}>
            <b style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%' }}>Lớp 12</b>
            <TruongTHPT
              cauHinh={props.cauHinh}
              type="12"
              form={props.form}
              fields={{
                monChuyen: ['thongTinHocTapTHPT', 'truongLop12', 'monChuyen'],
                tinh: ['thongTinHocTapTHPT', 'truongLop12', 'maTinh'],
                quanHuyen: ['thongTinHocTapTHPT', 'truongLop12', 'maQuanHuyen'],
                truongTHPT: ['thongTinHocTapTHPT', 'truongLop12', 'maTruong'],
              }}
              initialValue={{
                maTinh: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTinh,
                maQuanHuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maQuanHuyen,
                maTruong: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTruong,
                monChuyen: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.monChuyen,
              }}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default InfoTruongTHPT;
