/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, message, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormUserQLDT = (props: {
  edit: boolean;
  data: PhanQuyen.PhanNhom[];
  setData: any;
  record: PhanQuyen.PhanNhom & { index: number };
  onCancel: any;
}) => {
  const [form] = Form.useForm();
  const { danhSachNhomVaiTro, danhSachDoiTuong, getDoiTuongPhanNhomByMucDoModel } =
    useModel('phanquyen');
  const [mucDo, setMucDo] = useState<string | undefined>(props?.record?.mucDo);
  return (
    <Card title={props.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const arrDoiTuong: string[] = values?.doiTuong?.split('||');
          const cloneData: PhanQuyen.PhanNhom[] = JSON.parse(JSON.stringify(props?.data ?? []));
          const stringValues = `${values?.nhomVaiTroId}||${values?.mucDo}||${arrDoiTuong?.[0]}`;
          for (let i = 0; i < cloneData.length; i += 1) {
            if (
              stringValues ===
              `${cloneData[i]?.nhomVaiTroId}||${cloneData[i]?.mucDo}||${cloneData[i]?.idDoiTuong}`
            ) {
              message.error('Phân nhóm đã tồn tại');
              return;
            }
          }

          if (props.edit) {
            cloneData?.splice(props?.record?.index - 1, 1, {
              ...values,
              idDoiTuong: arrDoiTuong?.[0],
              tenDoiTuong: arrDoiTuong?.[1],
            });
          } else {
            cloneData?.unshift({
              ...values,
              idDoiTuong: arrDoiTuong?.[0],
              tenDoiTuong: arrDoiTuong?.[1],
            });
          }
          props.setData(cloneData?.map((item, index) => ({ ...item, index: index + 1 })));
          props.onCancel();
        }}
        form={form}
      >
        <Form.Item
          label="Nhóm vai trò"
          name="nhomVaiTroId"
          rules={[...rules.required]}
          initialValue={props?.record?.nhomVaiTroId}
        >
          <Select showSearch placeholder="Nhóm vai trò">
            {danhSachNhomVaiTro.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item._id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Mức độ" name="mucDo" rules={[...rules.required]} initialValue={mucDo}>
          <Select
            onChange={(val: string | undefined) => {
              setMucDo(val);
              form.setFieldsValue({
                doiTuong:
                  val !== props?.record?.mucDo
                    ? undefined
                    : `${props.record?.idDoiTuong}||${props?.record?.tenDoiTuong}`,
              });
              if (val && val !== 'Tất cả') getDoiTuongPhanNhomByMucDoModel(val);
            }}
            showSearch
            placeholder="Mức độ"
          >
            {['Tất cả', 'Đơn vị', 'Lớp tín chỉ', 'Lớp hành chính'].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {mucDo && mucDo !== 'Tất cả' && (
          <Form.Item
            label="Đối tượng"
            name="doiTuong"
            rules={[...rules.required]}
            initialValue={
              props.edit && props.record?.mucDo !== 'Tất cả'
                ? `${props.record?.idDoiTuong}||${props?.record?.tenDoiTuong}`
                : undefined
            }
          >
            <Select showSearch placeholder="Đối tượng">
              {danhSachDoiTuong.map((item) => (
                <Select.Option key={item.id} value={`${item.id}||${item.name}`}>
                  {item.name} {item?.code ? `(${item.code})` : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>
          <Button onClick={() => props.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormUserQLDT;
