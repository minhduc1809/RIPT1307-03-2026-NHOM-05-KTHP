/* eslint-disable no-param-reassign */
import { ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Form, Select } from 'antd';
import { useModel } from 'umi';

const FormNganh = () => {
  const [form] = Form.useForm();

  const {
    editGiayTo: edit,
    setVisibleFormNganh,
    recordNganh,
    danhSachNganh,
    setDanhSachNganh,
  } = useModel('dottuyensinh');
  const { danhSach: danhSachCoSoDaoTao } = useModel('cosodaotao');
  const { danhSach: danhSachChuyenNganh } = useModel('nganhchuyennganh');
  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} giấy tờ`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.danhSachCoSoDaoTao = values?.danhSachCoSoDaoTao?.map((item: string) => {
            const arrStringCoSo = item?.split('||');
            return {
              _id: arrStringCoSo[0],
              ten: arrStringCoSo[1],
            };
          });
          values.nganh = {
            _id: values?.nganh?.split('||')[0],
            ten: values?.nganh?.split('||')[1],
          };
          const listNganhTemp = [...danhSachNganh];
          if (!edit) {
            listNganhTemp.splice(0, 0, values);
          } else listNganhTemp.splice(recordNganh?.index ? recordNganh.index - 1 : 0, 1, values);
          setDanhSachNganh(listNganhTemp);
          setVisibleFormNganh(false);
        }}
        form={form}
      >
        <Form.Item
          initialValue={recordNganh?.danhSachCoSoDaoTao?.map((item) => `${item._id}||${item.ten}`)}
          style={{ marginBottom: 8, position: 'relative' }}
          labelCol={{ span: 24 }}
          name={['danhSachCoSoDaoTao']}
          label="Cơ sở đào tạo"
          rules={[...rules.required]}
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="Chọn cơ sở đào tạo"
            options={danhSachCoSoDaoTao?.map((item) => ({
              value: `${item._id}||${item?.ten}`,
              label: item.ten,
            }))}
          />
        </Form.Item>

        <Form.Item
          initialValue={
            recordNganh ? `${recordNganh?.nganh?._id}||${recordNganh?.nganh?.ten}` : undefined
          }
          style={{ marginBottom: 8, position: 'relative' }}
          labelCol={{ span: 24 }}
          name={['nganh']}
          label="Ngành xét tuyển"
          rules={[...rules.required]}
        >
          <Select
            showSearch
            placeholder="Chọn ngành xét tuyển"
            options={danhSachChuyenNganh?.map((item) => ({
              value: `${item._id}||${item?.ten}`,
              label: item.ten,
            }))}
          />
        </Form.Item>

        <Form.Item
          initialValue={recordNganh?.danhSachToHop}
          style={{ marginBottom: 8, position: 'relative' }}
          labelCol={{ span: 24 }}
          name={['danhSachToHop']}
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

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleFormNganh(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormNganh;
