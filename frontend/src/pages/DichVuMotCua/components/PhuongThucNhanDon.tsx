import { Form } from 'antd';
import rules from '@/utils/rules';
import { Radio, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const PhuongThucNhanDon = () => {
  const { record } = useModel('dichvumotcua');
  const [phuongThucNhanDon, setPhuongThucNhanDon] = useState<string>('Nhận tại trường');
  return (
    <>
      <Form.Item
        name="phuongThucNhanDon"
        label="Phương thức nhận đơn"
        initialValue={phuongThucNhanDon}
        rules={[...rules.required]}
      >
        <Radio.Group
          onChange={(e) => {
            setPhuongThucNhanDon(e.target.value);
          }}
        >
          {['Nhận tại trường', 'Chuyển phát nhanh'].map((item) => (
            <Radio value={item} key={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      {phuongThucNhanDon === 'Chuyển phát nhanh' && (
        <>
          <Form.Item
            name="diaChiNhanDon"
            label="Địa chỉ nhận đơn"
            initialValue={record?.diaChiNhanDon}
            rules={[...rules.required]}
          >
            <Input.TextArea rows={3} placeholder="Địa chỉ nhận đơn" />
          </Form.Item>
          <div>
            <div>
              <b>Ghi chú:</b>
            </div>
            <div>
              <i>- Sinh viên ghi rõ số nhà, địa chỉ nơi nhận</i>
            </div>
            <div>
              <i>- Chi phí thực hiện chuyển phát nhanh do sinh viên chi trả</i>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PhuongThucNhanDon;
