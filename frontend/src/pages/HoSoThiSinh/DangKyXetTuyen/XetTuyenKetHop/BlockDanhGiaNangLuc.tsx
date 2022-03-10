import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { Col, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BlockDanhGiaNangLuc = () => {
  const { recordHoSo } = useModel('hosoxettuyen');
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
          <Select showSearch placeholder="Chọn đơn vị tổ chức" allowClear style={{ width: '100%' }}>
            {['ĐHQG Hà Nội', 'ĐHQG Thành phố Hồ Chí Minh', 'ĐH Bách khoa Hà Nội'].map((val) => (
              <Select.Option key={val} value={val}>
                {val}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      <Col xs={12} sm={12} md={8} lg={8}>
        <FormItem
          rules={[...rules.required]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Điểm đánh giá năng lực"
          name={['thongTinKetQuaDanhGiaNangLuc', 'diemDanhGiaNangLuc']}
          initialValue={recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.diemDanhGiaNangLuc}
          style={{ width: '100%', marginBottom: '0' }}
        >
          <InputNumber min={0} max={1000000} style={{ width: '100%' }} placeholder="Nhập điểm" />
        </FormItem>
      </Col>
      <Col xs={12} sm={12} md={8} lg={8}>
        <FormItem
          rules={[...rules.required]}
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
            disabledDate={(cur) => moment(cur).isAfter(moment())}
            style={{ width: '100%' }}
          />
        </FormItem>
      </Col>
      <Col xs={24} md={8} lg={8} sm={12}>
        <FormItem
          rules={[...rules.fileRequired]}
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
            limit={5}
          />
        </FormItem>
      </Col>
    </>
  );
};

export default BlockDanhGiaNangLuc;
