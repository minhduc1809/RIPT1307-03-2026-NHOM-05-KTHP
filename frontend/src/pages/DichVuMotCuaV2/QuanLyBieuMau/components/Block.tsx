import { EFileType, ElementTemplateType, LevelDonViHanhChinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
}) => {
  const { record } = useModel('dichvumotcuav2');
  const [type, setType] = useState<string>(record?.cauHinhBieuMau?.[props.field.name]?.type ?? '');

  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item name={[props.field.name, 'label']} label="Tiêu đề" rules={[...rules.required]}>
            <Input placeholder="Tiêu đề" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={[props.field.name, 'type']} label="Loại" rules={[...rules.required]}>
            <Select onChange={(val: string) => setType(val)} placeholder="Chọn loại">
              {Object.keys(ElementTemplateType)?.map((item) => (
                <Select.Option value={item}>{ElementTemplateType?.[item] ?? ''}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name={[props.field.name, 'note']} label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú" />
          </Form.Item>
        </Col>
      </Row>

      {type === 'INPUT_NUMBER' && (
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item name={[props.field.name, 'min']} label="Giá trị tối thiểu">
              <InputNumber style={{ width: '100%' }} placeholder="Giá trị tối thiểu" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name={[props.field.name, 'max']} label="Giá trị tối đa">
              <InputNumber style={{ width: '100%' }} placeholder="Giá trị tối đa" />
            </Form.Item>
          </Col>
        </Row>
      )}

      {(type === 'UPLOAD_SINGLE' || type === 'UPLOAD_MULTI') && (
        <Form.Item
          name={[props.field.name, 'fileType']}
          label="Loại file"
          rules={[...rules.required]}
        >
          <Select mode="multiple" placeholder="Chọn loại file">
            {Object.keys(EFileType)?.map((item) => (
              <Select.Option value={item}>{EFileType[item]}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {['DROP_LIST_SINGLE', 'DROP_LIST_MULTI', 'RADIO_BUTTON', 'CHECKLIST'].includes(type) && (
        <Form.List
          name={[props.field.name, 'dataSource']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 lựa chọn'));
                }
                return '';
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <>
                    <Form.Item label={`Lựa chọn ${index + 1}`} key={field.key}>
                      <Form.Item name={[`${index}`, 'choice']} rules={[...rules.required]} noStyle>
                        <Input placeholder="Nhập lựa chọn" style={{ width: '90%' }} />
                      </Form.Item>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    </Form.Item>
                  </>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm lựa chọn
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      )}
      {type === 'DON_VI_HANH_CHINH' && (
        <Form.Item name={[props.field.name, 'level']} label="Cấp">
          <Select placeholder="Cấp">
            {LevelDonViHanhChinh?.map((item, index) => (
              <Select.Option value={index + 1} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item valuePropName="checked" name={[props.field.name, 'isRequired']}>
        <Checkbox>Bắt buộc</Checkbox>
      </Form.Item>
    </>
  );
};

export default Block;
