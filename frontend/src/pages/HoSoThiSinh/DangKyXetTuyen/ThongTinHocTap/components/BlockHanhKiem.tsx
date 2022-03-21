import { useModel } from 'umi';
import { FormItem } from '@/components/FormItem';
import { hanhKiem } from '@/utils/constants';
import rules from '@/utils/rules';
import { Col, Divider, Select } from 'antd';

const BlockHanhKiem = (props: { arrHanhKiem: { label: string; name: string[] }[] }) => {
  const { recordHoSo } = useModel('hosoxettuyen');

  return (
    <>
      <Divider plain>
        <b>Hạnh kiểm</b>
      </Divider>
      {props?.arrHanhKiem?.map((item) => (
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
      ))}
    </>
  );
};

export default BlockHanhKiem;
