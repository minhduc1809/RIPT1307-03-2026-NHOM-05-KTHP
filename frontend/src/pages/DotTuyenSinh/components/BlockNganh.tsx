import { ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import { Col, Form, Row, Select } from 'antd';
import { useModel } from 'umi';

const BlockNganh = (props: {
  field: { name: number; key: number; isListField?: boolean };
  type?: string;
  fieldName: string;
}) => {
  const { danhSach: danhSachCoSoDaoTao } = useModel('cosodaotao');
  const { danhSach: danhSachNganh } = useModel('nganhchuyennganh');
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24}>
          <Form.Item
            style={{ marginBottom: 8, position: 'relative' }}
            labelCol={{ span: 24 }}
            name={[props.field.name, 'danhSachCoSoDaoTao']}
            label="Cơ sở đào tạo"
            rules={[...rules.required]}
          >
            <Select
              showSearch
              mode="multiple"
              placeholder="Chọn cơ sở đào tạo"
              options={danhSachCoSoDaoTao?.map((item) => ({ value: item._id, label: item.ten }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            style={{ marginBottom: 8, position: 'relative' }}
            labelCol={{ span: 24 }}
            name={[props.field.name, 'nganh']}
            label="Ngành xét tuyển"
            rules={[...rules.required]}
          >
            <Select
              showSearch
              placeholder="Chọn ngành xét tuyển"
              options={danhSachNganh?.map((item) => ({ value: item._id, label: item.ten }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            style={{ marginBottom: 8, position: 'relative' }}
            labelCol={{ span: 24 }}
            name={[props.field.name, 'danhSachToHop']}
            label="Tổ hợp xét tuyển"
            rules={[...rules.required]}
          >
            <Select
              showSearch
              mode="multiple"
              placeholder="Chọn tổ hợp xét tuyển"
              options={Object.keys(ToHopXetTuyen)?.map((item) => ({
                value: item,
                label: `${item} (${ToHopXetTuyen[item]})`,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default BlockNganh;
