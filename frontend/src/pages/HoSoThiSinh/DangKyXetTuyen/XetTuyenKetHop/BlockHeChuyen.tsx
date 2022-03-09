import { FormItem } from '@/components/FormItem';
import { EMonHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { Col, Select } from 'antd';
import { useModel } from 'umi';

const BlockHeChuyen = (props: { isChuyenTruong: boolean }) => {
  const { recordHoSo, isTruongChuyenLop10, isTruongChuyenLop11, isTruongChuyenLop12 } =
    useModel('hosoxettuyen');
  return (
    <>
      {[
        {
          label: 'Lớp 10',
          name: ['truongLop10', 'monChuyen'],
          initialValue: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.monChuyen,
          isChuyen: isTruongChuyenLop10,
        },
        {
          label: 'Lớp 11',
          name: ['truongLop11', 'monChuyen'],
          initialValue: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.monChuyen,
          isChuyen: props.isChuyenTruong ? isTruongChuyenLop11 : isTruongChuyenLop10,
        },
        {
          label: 'Lớp 12',
          name: ['truongLop12', 'monChuyen'],
          initialValue: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.monChuyen,
          isChuyen: props.isChuyenTruong ? isTruongChuyenLop12 : isTruongChuyenLop10,
        },
      ].map((item) => (
        <Col key={item.name[0]} xs={24} sm={12} md={12} lg={8}>
          <FormItem
            rules={item.isChuyen ? [...rules.required] : []}
            initialValue={item.initialValue}
            label={item.label}
            name={item.name}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn môn chuyên"
              options={Object.values(EMonHoc)
                .filter((mon) => mon !== '')
                .map((mon) => ({ value: mon, label: mon }))}
            />
          </FormItem>
        </Col>
      ))}
    </>
  );
};

export default BlockHeChuyen;
