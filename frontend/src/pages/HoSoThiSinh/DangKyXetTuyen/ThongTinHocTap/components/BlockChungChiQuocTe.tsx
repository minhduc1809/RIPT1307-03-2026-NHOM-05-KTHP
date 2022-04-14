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

const BlockChungChiQuocTe = (props: { form: FormInstance; cauHinh: any }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [loaiChungChi, setLoaiChungChi] = useState<string>(
    recordHoSo?.thongTinChungChiQuocTe?.loaiChungChiQuocTe ?? '',
  );

  const cauHinhChungChi = props?.cauHinh?.danhSach?.[loaiChungChi];

  return (
    <>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiQuocTe?.loaiChungChiQuocTe}
          label="Loại chứng chỉ quốc tế"
          name={['thongTinChungChiQuocTe', 'loaiChungChiQuocTe']}
        >
          <Select
            onChange={(val) => {
              setLoaiChungChi(val);
              props.form.setFieldsValue({
                thongTinChungChiQuocTe: {
                  diemChungChiQuocTe: undefined,
                },
              });
            }}
            style={{ width: '100%' }}
            placeholder="Chọn loại chứng chỉ quốc tế"
          >
            {Object.keys(props?.cauHinh?.danhSach ?? {}).map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      {((loaiChungChi && cauHinhChungChi?.maDuThiChungChiQuocTe) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.maDuThiChungChiQuocTe?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiQuocTe?.maDuThiChungChiQuocTe}
            label="Mã dự thi"
            name={['thongTinChungChiQuocTe', 'maDuThiChungChiQuocTe']}
          >
            <Input placeholder="Nhập mã dự thi" />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.diemChungChiQuocTe) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.diemChungChiQuocTe?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiQuocTe?.diemChungChiQuocTe}
            label="Điểm thi"
            name={['thongTinChungChiQuocTe', 'diemChungChiQuocTe']}
          >
            <InputNumber
              step={cauHinhChungChi?.diemChungChiQuocTe?.step}
              min={0}
              max={cauHinhChungChi?.diemChungChiQuocTe?.max}
              placeholder="Nhập điểm thi"
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.ngayCapChungChiQuocTe) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.ngayCapChungChiQuocTe?.required ? [...rules.required] : []}
            initialValue={
              recordHoSo?.thongTinChungChiQuocTe?.ngayCapChungChiQuocTe
                ? moment(recordHoSo?.thongTinChungChiQuocTe?.ngayCapChungChiQuocTe)
                : undefined
            }
            label="Ngày cấp chứng chỉ"
            name={['thongTinChungChiQuocTe', 'ngayCapChungChiQuocTe']}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(val) => {
                return (
                  moment(val).isAfter(moment()) ||
                  moment(val).isBefore(
                    moment().subtract(
                      cauHinhChungChi?.ngayCapChungChiQuocTe?.namMax ?? 10,
                      'years',
                    ),
                  )
                );
              }}
            />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.donViCapChungChiQuocTe) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.donViCapChungChiQuocTe?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiQuocTe?.donViCapChungChiQuocTe}
            label="Đơn vị cấp chứng chỉ"
            name={['thongTinChungChiQuocTe', 'donViCapChungChiQuocTe']}
          >
            <Input placeholder="Nhập đơn vị cấp chứng chỉ" />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.urlChungChiQuocTe) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.urlChungChiQuocTe?.required ? [...rules.fileRequired] : []}
            initialValue={renderFileList(
              recordHoSo?.thongTinChungChiQuocTe?.urlChungChiQuocTe ?? [],
            )}
            label={'Chứng chỉ đính kèm'}
            name="urlChungChiQuocTe"
          >
            <Upload
              otherProps={{
                accept: 'application/pdf, image/png, .jpg',
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
              limit={cauHinhChungChi?.urlChungChiQuocTe?.maxLength ?? 5}
            />
          </FormItem>
        </Col>
      )}
    </>
  );
};

export default BlockChungChiQuocTe;
