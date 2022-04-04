import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Col, DatePicker, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BlockChungChiTiengAnh = (props: { form: FormInstance; cauHinh: any }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [loaiChungChi, setLoaiChungChi] = useState<string>(
    recordHoSo?.thongTinChungChiTiengAnh?.loai ?? '',
  );

  const cauHinhChungChi =
    props?.cauHinh?.danhSach?.thongTinChungChiNgoaiNgu?.thongTinChungChiTiengAnh?.danhSach?.[
      loaiChungChi
    ] ?? {};

  return (
    <>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiTiengAnh?.loai}
          label="Loại chứng chỉ"
          name={['thongTinChungChiTiengAnh', 'loai']}
        >
          <Select
            onChange={(val) => {
              setLoaiChungChi(val);
              props.form.setFieldsValue({
                thongTinChungChiTiengAnh: {
                  diem: undefined,
                },
              });
            }}
            style={{ width: '100%' }}
            placeholder="Chọn loại chứng chỉ"
          >
            {Object.keys(
              props?.cauHinh?.danhSach?.thongTinChungChiNgoaiNgu?.thongTinChungChiTiengAnh
                ?.danhSach ?? {},
            ).map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      {((loaiChungChi && cauHinhChungChi?.diem) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.diem?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiTiengAnh?.diem}
            label="Điểm thi"
            name={['thongTinChungChiTiengAnh', 'diem']}
          >
            <InputNumber
              step={cauHinhChungChi?.diem?.step}
              min={cauHinhChungChi?.diem?.min}
              max={cauHinhChungChi?.diem?.max}
              placeholder="Nhập điểm thi"
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      )}

      {((loaiChungChi && cauHinhChungChi?.ngayCap) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.ngayCap?.required ? [...rules.required] : []}
            initialValue={
              recordHoSo?.thongTinChungChiTiengAnh?.ngayCap
                ? moment(recordHoSo?.thongTinChungChiTiengAnh?.ngayCap)
                : undefined
            }
            label="Ngày cấp chứng chỉ"
            name={['thongTinChungChiTiengAnh', 'ngayCap']}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(val) =>
                moment(val).isAfter(moment()) ||
                moment(val).isBefore(
                  moment().subtract(cauHinhChungChi?.ngayCap?.namMax ?? 10, 'years'),
                )
              }
            />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.noiCap) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.noiCap?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiTiengAnh?.noiCap}
            label="Đơn vị cấp chứng chỉ"
            name={['thongTinChungChiTiengAnh', 'noiCap']}
          >
            <Input placeholder="Nhập đơn vị cấp chứng chỉ" />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.urlChungChi) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.urlChungChi?.required ? [...rules.fileRequired] : []}
            initialValue={renderFileList(recordHoSo?.thongTinChungChiTiengAnh?.urlChungChi ?? [])}
            label={'Chứng chỉ đính kèm'}
            name="urlChungChiTiengAnh"
          >
            <Upload
              otherProps={{
                accept: 'application/pdf, image/png, .jpg',
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
              limit={cauHinhChungChi?.urlChungChi?.maxLength ?? 5}
            />
          </FormItem>
        </Col>
      )}
    </>
  );
};

export default BlockChungChiTiengAnh;
