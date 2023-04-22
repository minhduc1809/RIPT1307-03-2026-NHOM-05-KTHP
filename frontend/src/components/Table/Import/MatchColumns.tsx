import rules from '@/utils/rules';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const MatchColumns = (props: { onChange: () => void; onBack: any }) => {
  const { onChange, onBack } = props;
  const { headLine, columns, matchedColumns, setMatchedColumns } = useModel('import');
  const [form] = Form.useForm();
  const fileTitles = Object.values(headLine ?? {});

  useEffect(() => {
    if (matchedColumns) form.setFieldsValue(matchedColumns);
  }, []);

  const onFinish = (values: any): void => {
    setMatchedColumns(values);
    if (onChange) onChange();
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={[12, 12]}>
        <Col span={24} className="fw500">
          Ghép cột thông tin với cột dữ liệu tương ứng
        </Col>
        {columns.map((col) => (
          <Col span={24} md={12} key={col.dataIndex as string}>
            <Form.Item
              name={col.dataIndex as string}
              label={col.title}
              rules={[...(col.importRequired ? rules.required : [])]}
              initialValue={fileTitles.includes(col.title as string) ? col.title : undefined}
            >
              <Select
                options={Object.entries(headLine ?? {}).map(([colName, title]) => ({
                  value: title,
                  key: colName,
                  label: `Cột ${colName}: ${title}`,
                }))}
                style={{ width: '100%' }}
                allowClear={!col.importRequired}
                placeholder="Cột thông tin trên tập dữ liệu"
              />
            </Form.Item>
          </Col>
        ))}

        <Col span={24}>
          <Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
              Quay lại
            </Button>
            <Button htmlType="submit" type="primary">
              Tiếp theo <ArrowRightOutlined />
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default MatchColumns;
