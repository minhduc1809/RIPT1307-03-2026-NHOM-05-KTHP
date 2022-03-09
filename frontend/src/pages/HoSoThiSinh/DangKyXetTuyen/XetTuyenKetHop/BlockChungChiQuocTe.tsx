import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import { ELoaiChungChiQuocTe, MaxMinDiemChungChiQuocTe } from '@/utils/constants';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Col, DatePicker, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BlockChungChiQuocTe = (props: { form: FormInstance }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [loaiChungChi, setLoaiChungChi] = useState<string>(
    recordHoSo?.thongTinChungChiQuocTe?.loaiChungChiQuocTe ?? '',
  );
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
            {Object.values(ELoaiChungChiQuocTe).map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiQuocTe?.maDuThiChungChiQuocTe}
          label="Mã dự thi"
          name={['thongTinChungChiQuocTe', 'maDuThiChungChiQuocTe']}
        >
          <Input placeholder="Nhập mã dự thi" />
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiQuocTe?.diemChungChiQuocTe}
          label="Điểm thi"
          name={['thongTinChungChiQuocTe', 'diemChungChiQuocTe']}
        >
          <InputNumber
            min={MaxMinDiemChungChiQuocTe?.[loaiChungChi]?.min ?? 0}
            max={MaxMinDiemChungChiQuocTe?.[loaiChungChi]?.max ?? 10}
            placeholder="Nhập điểm thi"
            style={{ width: '100%' }}
          />
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
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
            disabledDate={(val) => moment(val).isAfter(moment())}
          />
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiQuocTe?.donViCapChungChiQuocTe}
          label="Đơn vị cấp chứng chỉ"
          name={['thongTinChungChiQuocTe', 'donViCapChungChiQuocTe']}
        >
          <Input placeholder="Nhập đơn vị cấp chứng chỉ" />
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.fileRequired]}
          initialValue={renderFileList(recordHoSo?.thongTinChungChiQuocTe?.urlChungChiQuocTe ?? [])}
          label={'Chứng chỉ đính kèm'}
          name="urlChungChiQuocTe"
        >
          <Upload
            otherProps={{
              accept: 'application/pdf, image/png, .jpg',
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
            limit={5}
          />
        </FormItem>
      </Col>
    </>
  );
};

export default BlockChungChiQuocTe;
