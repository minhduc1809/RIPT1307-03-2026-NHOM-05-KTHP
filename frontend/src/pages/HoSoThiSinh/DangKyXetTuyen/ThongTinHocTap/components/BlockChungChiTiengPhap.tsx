import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Col, DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BlockChungChiTiengPhap = (props: { form: FormInstance; cauHinh: any }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [loaiChungChi, setLoaiChungChi] = useState<string>(
    recordHoSo?.thongTinChungChiTiengPhap?.loai ?? '',
  );

  const cauHinhChungChi =
    props?.cauHinh?.danhSach?.thongTinChungChiNgoaiNgu?.thongTinChungChiTiengPhap?.danhSach?.[
      loaiChungChi
    ];
  return (
    <>
      <Col xs={24} md={8} lg={6} sm={12}>
        <FormItem
          rules={[...rules.required]}
          initialValue={recordHoSo?.thongTinChungChiTiengPhap?.loai}
          label="Loại chứng chỉ"
          name={['thongTinChungChiTiengPhap', 'loai']}
        >
          <Select
            onChange={(val) => {
              setLoaiChungChi(val);
              props.form.setFieldsValue({
                thongTinChungChiTiengPhap: {
                  bac: undefined,
                },
              });
            }}
            style={{ width: '100%' }}
            placeholder="Chọn loại chứng chỉ"
          >
            {Object.keys(
              props?.cauHinh?.danhSach?.thongTinChungChiNgoaiNgu?.thongTinChungChiTiengPhap
                ?.danhSach,
            ).map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>

      {((loaiChungChi && cauHinhChungChi?.bac) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.bac?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiTiengPhap?.bac}
            label="Bậc"
            name={['thongTinChungChiTiengPhap', 'bac']}
          >
            <Select style={{ width: '100%' }} placeholder="Chọn bậc">
              {cauHinhChungChi?.bac?.enum.map((item: string) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      )}

      {((loaiChungChi && cauHinhChungChi?.ngayCap) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.ngayCap?.required ? [...rules.required] : []}
            initialValue={
              recordHoSo?.thongTinChungChiTiengPhap?.ngayCap
                ? moment(recordHoSo?.thongTinChungChiTiengPhap?.ngayCap)
                : undefined
            }
            label="Ngày cấp chứng chỉ"
            name={['thongTinChungChiTiengPhap', 'ngayCap']}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(val) => moment(val).isAfter(moment())}
            />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.noiCap) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.noiCap?.required ? [...rules.required] : []}
            initialValue={recordHoSo?.thongTinChungChiTiengPhap?.noiCap}
            label="Đơn vị cấp chứng chỉ"
            name={['thongTinChungChiTiengPhap', 'noiCap']}
          >
            <Input placeholder="Nhập đơn vị cấp chứng chỉ" />
          </FormItem>
        </Col>
      )}
      {((loaiChungChi && cauHinhChungChi?.urlChungChi) || !loaiChungChi) && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            rules={cauHinhChungChi?.urlChungChi?.required ? [...rules.fileRequired] : []}
            initialValue={renderFileList(recordHoSo?.thongTinChungChiTiengPhap?.urlChungChi ?? [])}
            label={'Chứng chỉ đính kèm'}
            name="urlChungChiTiengPhap"
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

export default BlockChungChiTiengPhap;
