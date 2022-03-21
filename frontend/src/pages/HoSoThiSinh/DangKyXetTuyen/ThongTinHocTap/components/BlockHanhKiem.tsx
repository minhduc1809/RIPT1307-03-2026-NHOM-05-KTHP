import { useModel } from 'umi';
import { FormItem } from '@/components/FormItem';
import { hanhKiem } from '@/utils/constants';
import rules from '@/utils/rules';
import { Col, Divider, Select } from 'antd';
import moment from 'moment';

const BlockHanhKiem = () => {
  const { recordHoSo } = useModel('hosoxettuyen');

  return (
    <>
      <Divider plain>
        <b>Hạnh kiểm</b>
      </Divider>
      {moment(recordHoSo?.thongTinHocTapTHPT?.namTotNghiep || record?.namTuyenSinh).isAfter(moment( Date.now())) ?
      [
        { label: 'Lớp 10', name: ['thongTinHocTapTHPT', 'truongLop10', 'hanhKiem'] },
        {
          label: 'Lớp 11',
          name: ['thongTinHocTapTHPT', 'truongLop11', 'hanhKiem'],
        },
        {
          label: 'Học kỳ I lớp 12',
          name: ['thongTinHocTapTHPT', 'truongLop12', 'hanhKiem'],
        },
      ].map((item) => (
        <Col key={item.label} xs={12} sm={12} md={8}>
          <FormItem
            initialValue={recordHoSo?.thongTinHocTapTHPT?.[item.name[1]]?.hanhKiem}
            rules={[...rules.required]}
            label={item.label}
            name={item.name}
          >
            <Select showSearch placeholder="Chọn loại hạnh kiểm" allowClear>
              {hanhKiem.map((val) => (
                <Select.Option key={val} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>     
      )) : 
      [
        { label: 'Lớp 10', name: ['thongTinHocTapTHPT', 'truongLop10', 'hanhKiem'] },
        {
          label: 'Lớp 11',
          name: ['thongTinHocTapTHPT', 'truongLop11', 'hanhKiem'],
        }
      ].map((item) => (
        <Col key={item.label} xs={12} sm={12} md={8}>
          <FormItem
            initialValue={recordHoSo?.thongTinHocTapTHPT?.[item.name[1]]?.hanhKiem}
            rules={[...rules.required]}
            label={item.label}
            name={item.name}
          >
            <Select showSearch placeholder="Chọn loại hạnh kiểm" allowClear>
              {hanhKiem.map((val) => (
                <Select.Option key={val} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>     
      ))
      }
    </>
  );
};

export default BlockHanhKiem;
