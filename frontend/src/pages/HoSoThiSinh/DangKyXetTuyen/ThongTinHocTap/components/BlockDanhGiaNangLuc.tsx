import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { Col, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BlockDanhGiaNangLuc = (props: { cauHinh: any }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [donVi, setDonVi] = useState<string>(
    recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.truongDanhGiaNangLuc ?? '',
  );
  const itemCauHinh = props?.cauHinh?.danhSach?.thongTinKetQuaDanhGiaNangLuc?.danhSach;
  return (
    <>
      <Col xs={12} sm={12} md={8} lg={8}>
        <FormItem
          initialValue={recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.truongDanhGiaNangLuc}
          labelCol={{ span: 24 }}
          rules={[...rules.required]}
          wrapperCol={{ span: 24 }}
          label={'Đơn vị tổ chức'}
          name={['thongTinKetQuaDanhGiaNangLuc', 'truongDanhGiaNangLuc']}
          style={{ width: '100%', marginBottom: '0' }}
        >
          <Select
            onChange={(val) => setDonVi(val)}
            showSearch
            placeholder="Chọn đơn vị tổ chức"
            allowClear
            style={{ width: '100%' }}
          >
            {Object.keys(itemCauHinh).map((val) => (
              <Select.Option key={val} value={val}>
                {val}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      {itemCauHinh?.[donVi]?.diemDanhGiaNangLuc && (
        <Col xs={12} sm={12} md={8} lg={8}>
          <FormItem
            rules={itemCauHinh?.[donVi]?.diemDanhGiaNangLuc?.required ? [...rules.required] : []}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Điểm đánh giá năng lực"
            name={['thongTinKetQuaDanhGiaNangLuc', 'diemDanhGiaNangLuc']}
            initialValue={recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.diemDanhGiaNangLuc}
            style={{ width: '100%', marginBottom: '0' }}
          >
            <InputNumber
              min={itemCauHinh?.[donVi]?.diemDanhGiaNangLuc?.min ?? 0}
              max={itemCauHinh?.[donVi]?.diemDanhGiaNangLuc?.max ?? 1000000}
              style={{ width: '100%' }}
              placeholder="Nhập điểm"
            />
          </FormItem>
        </Col>
      )}
      {itemCauHinh?.[donVi]?.ngayDuThiDanhGiaNangLuc && (
        <Col xs={12} sm={12} md={8} lg={8}>
          <FormItem
            rules={
              itemCauHinh?.[donVi]?.ngayDuThiDanhGiaNangLuc?.required ? [...rules.required] : []
            }
            initialValue={
              recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.ngayDuThiDanhGiaNangLuc
                ? moment(recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.ngayDuThiDanhGiaNangLuc)
                : undefined
            }
            name={['thongTinKetQuaDanhGiaNangLuc', 'ngayDuThiDanhGiaNangLuc']}
            label="Ngày thi"
          >
            {/* startof date */}
            <DatePicker
              placeholder="DD/MM/YYYY"
              format="DD/MM/YYYY"
              disabledDate={(cur) =>
                moment(cur).isAfter(moment()) ||
                moment(cur).isBefore(
                  moment().subtract(
                    itemCauHinh?.[donVi]?.ngayDuThiDanhGiaNangLuc?.namMax ?? 10,
                    'years',
                  ),
                )
              }
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      )}
      {itemCauHinh?.[donVi]?.urlGiayXacNhanDanhGiaNangLuc && (
        <Col xs={24} md={8} lg={8} sm={12}>
          <FormItem
            rules={
              itemCauHinh?.[donVi]?.urlGiayXacNhanDanhGiaNangLuc?.required
                ? [...rules.fileRequired]
                : []
            }
            initialValue={renderFileList(
              recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.urlGiayXacNhanDanhGiaNangLuc ?? [],
            )}
            label={'Giấy xác nhận'}
            name="urlGiayXacNhanDanhGiaNangLuc"
          >
            <Upload
              otherProps={{
                accept: 'application/pdf, image/png, .jpg',
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
              limit={itemCauHinh?.[donVi]?.urlGiayXacNhanDanhGiaNangLuc?.maxLength ?? 5}
            />
          </FormItem>
        </Col>
      )}
    </>
  );
};

export default BlockDanhGiaNangLuc;
