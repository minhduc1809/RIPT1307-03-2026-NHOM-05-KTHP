import { EFileType, ElementTemplateType, LevelDonViHanhChinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { CloseCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import logo from '@/assets/student.png';
import lodash from 'lodash';
import ElementDescription from './ElementDescription';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
  type?: string;
  fieldName: string;
}) => {
  const { record } = useModel('dichvumotcuav2');
  const recordBlock: DichVuMotCuaV2.CauHinhBieuMau = lodash.get(record, props.fieldName, undefined);
  const [type, setType] = useState<string>(recordBlock?.type ?? '');
  const [objectRelate, setObjectRelate] = useState<any>({});
  const [itemSelect, setItemSelect] = useState<string>('');
  useEffect(() => {
    const objectRelateTemp = {};
    if (['DROP_LIST_SINGLE', 'DROP_LIST_MULTI', 'RADIO_BUTTON', 'CHECKLIST']?.includes(type)) {
      recordBlock?.dataSource?.forEach((item, index) => {
        objectRelateTemp[index] = item.relatedElement?.length > 0;
      });
    }
    setObjectRelate(objectRelateTemp);
  }, []);
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={type === 'TEXT_BLOCK' ? 24 : 12}>
          <Form.Item
            style={{ marginBottom: 8, position: 'relative' }}
            labelCol={{ span: 24 }}
            name={[props.field.name, 'type']}
            label="Loại"
            rules={[...rules.required]}
          >
            <Select
              onMouseLeave={() => {
                setItemSelect('');
              }}
              showSearch
              filterOption={(value, option) => includes(option?.props.children, value)}
              onChange={(val: string) => setType(val)}
              placeholder="Chọn loại"
            >
              {Object.keys(ElementTemplateType)
                ?.filter((item) => item !== props?.type)
                ?.map((item) => (
                  <Select.Option
                    onMouseEnter={() => {
                      setItemSelect(item);
                    }}
                    value={item}
                  >
                    {ElementTemplateType?.[item] ?? ''}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          {itemSelect && (
            // <div
            //   style={{
            //     zIndex: 1000,
            //     width: 100,
            //     height: 100,
            //     position: 'absolute',
            //     top: 90,
            //     right: '-110px',
            //   }}
            // >
            //   <img style={{ objectFit: 'cover', width: 100, height: 100 }} src={logo} />
            // </div>
            <div style={{ zIndex: 1000 }}>
              <ElementDescription logo={logo} text="abc" />
            </div>
          )}
        </Col>
        {type !== 'TEXT_BLOCK' && (
          <Col xs={24} lg={12}>
            <Form.Item
              style={{ marginBottom: 8 }}
              labelCol={{ span: 24 }}
              name={[props.field.name, 'label']}
              label="Tiêu đề"
              rules={[...rules.required]}
            >
              <Input placeholder="Tiêu đề" />
            </Form.Item>
          </Col>
        )}
        {type === 'TEXT_BLOCK' && (
          <Col xs={24}>
            <Form.Item
              style={{ marginBottom: 8 }}
              labelCol={{ span: 24 }}
              name={[props.field.name, 'label']}
              label="Nội dung"
              rules={[...rules.required]}
            >
              <Input.TextArea rows={3} placeholder="Nội dung" />
            </Form.Item>
          </Col>
        )}
        {type !== 'TEXT_BLOCK' && (
          <Col xs={24}>
            <Form.Item
              style={{ marginBottom: 8 }}
              labelCol={{ span: 24 }}
              name={[props.field.name, 'note']}
              label="Ghi chú"
            >
              <Input.TextArea rows={1} placeholder="Ghi chú" />
            </Form.Item>
          </Col>
        )}
      </Row>

      {type === 'INPUT_NUMBER' && (
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              style={{ marginBottom: 8 }}
              labelCol={{ span: 24 }}
              name={[props.field.name, 'min']}
              label="Giá trị tối thiểu"
            >
              <InputNumber style={{ width: '100%' }} placeholder="Giá trị tối thiểu" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              style={{ marginBottom: 8 }}
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
          style={{ marginBottom: 8 }}
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
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      label={`Lựa chọn ${index + 1}`}
                      key={field.key}
                    >
                      <Form.Item
                        style={{ marginBottom: 8 }}
                        name={[`${index}`, 'label']}
                        rules={[...rules.required]}
                        noStyle
                      >
                        <Input placeholder="Nhập lựa chọn" style={{ width: '90%' }} />
                      </Form.Item>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                      <Form.Item style={{ marginBottom: 8 }} valuePropName="checked">
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
                                      size="small"
                                      headStyle={{ padding: '0px 24px' }}
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
                                        fieldName={`${props.fieldName}.relatedElement.[${index}]`}
                                        type={props?.type}
                                        field={{ ...fieldRelate }}
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
                <Form.Item style={{ marginBottom: 8 }}>
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
                      size="small"
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
                        fieldName={`${props.fieldName}.relatedElement.[${index}]`}
                        type="TABLE"
                        field={{ ...field }}
                      />
                    </Card>
                    <br />
                  </div>
                ))}
                <Form.Item style={{ marginBottom: 8 }}>
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
        <Form.Item
          style={{ marginBottom: 8 }}
          rules={[...rules.required]}
          name={[props.field.name, 'level']}
          label="Cấp"
        >
          <Select placeholder="Cấp">
            {LevelDonViHanhChinh?.map((item, index) => (
              <Select.Option value={index + 1} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type !== 'TEXT_BLOCK' && (
        <Form.Item
          style={{ marginBottom: 0 }}
          valuePropName="checked"
          name={[props.field.name, 'isRequired']}
        >
          <Checkbox>Bắt buộc</Checkbox>
        </Form.Item>
      )}
    </>
  );
};

export default Block;
