import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import { ELoaiChungChiNgoaiNgu, MaxMinDiemChungChiNgoaiNgu } from '@/utils/constants';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Col, DatePicker, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BlockChungChiNgoaiNgu = (props: { form: FormInstance }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [loaiChungChi, setLoaiChungChi] = useState<string>(
    recordHoSo?.thongTinChungChiNgoaiNgu?.loaiChungChiNgoaiNgu ?? '',
  );
  return (
    <>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiNgoaiNgu?.loaiChungChiNgoaiNgu}
          label="Loại chứng chỉ ngoại ngữ"
          name={['thongTinChungChiNgoaiNgu', 'loaiChungChiNgoaiNgu']}
        >
          <Select
            onChange={(val) => {
              setLoaiChungChi(val);
              props.form.setFieldsValue({
                thongTinChungChiNgoaiNgu: {
                  diemChungChiNgoaiNgu: undefined,
                },
              });
            }}
            style={{ width: '100%' }}
            placeholder="Chọn loại chứng chỉ ngoại ngữ"
          >
            {Object.values(ELoaiChungChiNgoaiNgu).map((item) => (
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
          initialValue={recordHoSo?.thongTinChungChiNgoaiNgu?.diemChungChiNgoaiNgu}
          label="Điểm thi"
          name={['thongTinChungChiNgoaiNgu', 'diemChungChiNgoaiNgu']}
        >
          <InputNumber
            min={MaxMinDiemChungChiNgoaiNgu?.[loaiChungChi]?.min ?? 0}
            max={MaxMinDiemChungChiNgoaiNgu?.[loaiChungChi]?.max ?? 10}
            placeholder="Nhập điểm thi"
            style={{ width: '100%' }}
          />
        </FormItem>
      </Col>

      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={
            recordHoSo?.thongTinChungChiNgoaiNgu?.ngayCapChungChiNgoaiNgu
              ? moment(recordHoSo?.thongTinChungChiNgoaiNgu?.ngayCapChungChiNgoaiNgu)
              : undefined
          }
          label="Ngày cấp chứng chỉ"
          name={['thongTinChungChiNgoaiNgu', 'ngayCapChungChiNgoaiNgu']}
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
          initialValue={recordHoSo?.thongTinChungChiNgoaiNgu?.donViCapChungChiNgoaiNgu}
          label="Đơn vị cấp chứng chỉ"
          name={['thongTinChungChiNgoaiNgu', 'donViCapChungChiNgoaiNgu']}
        >
          <Input placeholder="Nhập đơn vị cấp chứng chỉ" />
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.fileRequired]}
          initialValue={renderFileList(
            recordHoSo?.thongTinChungChiNgoaiNgu?.urlChungChiNgoaiNgu ?? [],
          )}
          label={'Chứng chỉ đính kèm'}
          name="urlChungChiNgoaiNgu"
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

export default BlockChungChiNgoaiNgu;
