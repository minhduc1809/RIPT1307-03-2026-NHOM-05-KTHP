import { EFileType, ElementTemplateType, LevelDonViHanhChinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { CloseCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
  relate?: boolean;
  indexBlock?: number;
  indexDataSource?: number;
}) => {
  const { record } = useModel('dichvumotcuav2');
  const [type, setType] = useState<string>(
    props?.relate
      ? record?.cauHinhBieuMau?.[props?.indexBlock ?? 0]?.dataSource?.[props?.indexDataSource ?? 0]
          ?.relatedElement?.[props.field.name]?.type ?? ''
      : record?.cauHinhBieuMau?.[props.field.name]?.type ?? '',
  );
  const [objectRelate, setObjectRelate] = useState<any>({});
  useEffect(() => {
    const objectRelateTemp = {};
    if (
      ['DROP_LIST_SINGLE', 'DROP_LIST_MULTI', 'RADIO_BUTTON', 'CHECKLIST']?.includes(
        record?.cauHinhBieuMau?.[props.field.name]?.type ?? '',
      )
    ) {
      record?.cauHinhBieuMau?.[props.field.name]?.dataSource?.forEach((item, index) => {
        objectRelateTemp[index] = item.relatedElement?.length > 0;
      });
    }

    setObjectRelate(objectRelateTemp);
  }, []);
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={[props.field.name, 'label']}
            label="Tiêu đề"
            rules={[...rules.required]}
          >
            <Input placeholder="Tiêu đề" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={[props.field.name, 'type']}
            label="Loại"
            rules={[...rules.required]}
          >
            <Select
              showSearch
              filterOption={(value, option) => includes(option?.props.children, value)}
              onChange={(val: string) => setType(val)}
              placeholder="Chọn loại"
            >
              {Object.keys(ElementTemplateType)?.map((item) => (
                <Select.Option value={item}>{ElementTemplateType?.[item] ?? ''}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item labelCol={{ span: 24 }} name={[props.field.name, 'note']} label="Ghi chú">
            <Input.TextArea rows={1} placeholder="Ghi chú" />
          </Form.Item>
        </Col>
      </Row>

      {type === 'INPUT_NUMBER' && (
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              name={[props.field.name, 'min']}
              label="Giá trị tối thiểu"
            >
              <InputNumber style={{ width: '100%' }} placeholder="Giá trị tối thiểu" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              name={[props.field.name, 'max']}
              label="Giá trị tối đa"
            >
              <InputNumber style={{ width: '100%' }} placeholder="Giá trị tối đa" />
            </Form.Item>
          </Col>
        </Row>
      )}

      {(type === 'UPLOAD_SINGLE' || type === 'UPLOAD_MULTI') && (
        <Form.Item
          labelCol={{ span: 24 }}
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
                      <Form.Item name={[`${index}`, 'label']} rules={[...rules.required]} noStyle>
                        <Input placeholder="Nhập lựa chọn" style={{ width: '90%' }} />
                      </Form.Item>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                      <Form.Item valuePropName="checked">
                        <Checkbox
                          checked={objectRelate?.[index]}
                          onChange={(val) => {
                            const newObject = {};
                            newObject[`${index}`] = val.target.checked;
                            setObjectRelate({ ...objectRelate, ...newObject });
                          }}
                        >
                          Liên quan tới khối khác
                        </Checkbox>
                      </Form.Item>
                      {objectRelate?.[index] && (
                        <Form.List
                          name={[`${index}`, 'relatedElement']}
                          // initialValue={record?.cauHinhBieuMau ?? []}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (!names || names.length < 1) {
                                  return Promise.reject(new Error('Ít nhất 1 khối'));
                                }
                                return '';
                              },
                            },
                          ]}
                        >
                          {(
                            fieldsRelate,
                            { add: addRelate, remove: removeRelate },
                            { errors: errorsRelate },
                          ) => {
                            return (
                              <>
                                {fieldsRelate.map((fieldRelate, indexRelate) => (
                                  <div key={fieldRelate.key}>
                                    <Card
                                      headStyle={{ padding: '8px 24px' }}
                                      bodyStyle={{ padding: '8px 24px' }}
                                      className={styles.block}
                                      title={
                                        <>
                                          <div style={{ float: 'left' }}>
                                            Khối liên quan {indexRelate + 1}
                                          </div>
                                          <CloseCircleOutlined
                                            style={{ float: 'right' }}
                                            onClick={() => removeRelate(fieldRelate.name)}
                                          />
                                        </>
                                      }
                                    >
                                      <Block
                                        indexBlock={props.field.name}
                                        indexDataSource={index}
                                        field={{ ...fieldRelate }}
                                        relate
                                      />
                                    </Card>
                                    <br />
                                  </div>
                                ))}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => addRelate()}
                                    style={{ width: '100%' }}
                                    icon={<PlusOutlined />}
                                  >
                                    Thêm khối liên quan
                                  </Button>
                                  <Form.ErrorList errors={errorsRelate} />
                                </Form.Item>
                              </>
                            );
                          }}
                        </Form.List>
                      )}
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

      {['TABLE'].includes(type) && (
        <Form.List
          name={[props.field.name, 'relatedElement']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 cột'));
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
                  <div key={field.key}>
                    <Card
                      headStyle={{ padding: '8px 24px' }}
                      bodyStyle={{ padding: '8px 24px' }}
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Cột {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right' }}
                            onClick={() => remove(field.name)}
                          />
                        </>
                      }
                    >
                      <Block
                        indexBlock={props.field.name}
                        indexDataSource={index}
                        relate
                        field={{ ...field }}
                      />
                    </Card>
                    <br />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm cột
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
