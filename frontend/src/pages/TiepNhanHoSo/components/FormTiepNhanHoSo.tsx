import Table from '@/components/Table/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { ETrangThaiHoSo } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const FormTiepNhanHoSo = (props: { type?: ETrangThaiHoSo }) => {
  const { record, setVisibleFormGiayTo } = useModel('dottuyensinh');
  const { loading, adminTiepNhanHoSoByIdHoSoModel, recordHoSo } = useModel('hosoxettuyen');

  const [form] = Form.useForm();
  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 120,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 70,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 150,
    },
    {
      title: 'Số lượng tiếp nhận',
      dataIndex: 'soLuongTiepNhan',
      align: 'center',
      width: 100,
      render: (val: number, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={val}
          name={[
            'thongTinGiayToNopHoSo',
            recordGiayTo?.index ? recordGiayTo?.index - 1 : 0,
            'soLuongTiepNhan',
          ]}
        >
          <InputNumber placeholder="Số lượng tiếp nhận" min={0} max={100} />
        </Form.Item>
      ),
    },
    {
      title: 'Ghi chú tiếp nhận',
      dataIndex: 'ghiChuTiepNhan',
      align: 'center',
      width: 150,
      render: (val: number, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={val}
          name={[
            'thongTinGiayToNopHoSo',
            recordGiayTo?.index ? recordGiayTo?.index - 1 : 0,
            'ghiChuTiepNhan',
          ]}
        >
          <Input.TextArea placeholder="Nhập ghi chú" />
        </Form.Item>
      ),
    },
  ];

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={(values) => {
        if (props?.type === ETrangThaiHoSo.DA_TIEP_NHAN) {
          values.thongTinGiayToNopHoSo = values?.thongTinGiayToNopHoSo?.map(
            (item: DotTuyenSinh.GiayTo, index: number) => ({
              ...record?.thongTinGiayToNopHoSo?.[index],
              ...item,
              thoiGianNop: moment(new Date()),
            }),
          );
        }
        adminTiepNhanHoSoByIdHoSoModel(recordHoSo?._id ?? '', record?._id ?? '', {
          ...values,
          trangThai: props?.type,
        });
      }}
    >
      {props?.type === ETrangThaiHoSo.DA_TIEP_NHAN && (
        <Form.Item label="Danh sách giấy tờ cần nộp">
          <Table
            otherProps={{
              pagination: false,
              size: 'small',
            }}
            data={record?.thongTinGiayToNopHoSo?.map((item, index) => ({
              ...item,
              index: index + 1,
            }))}
            columns={columns}
          />
        </Form.Item>
      )}

      <Form.Item
        rules={
          props?.type === ETrangThaiHoSo.KHONG_TIEP_NHAN
            ? [...rules.required, ...rules.text]
            : [...rules.text]
        }
        label="Ghi chú"
        name="ghiChuTiepNhan"
      >
        <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 20 }}>
        <Button
          icon={<SaveOutlined />}
          loading={loading}
          style={{ marginRight: 8 }}
          htmlType="submit"
          type="primary"
        >
          Lưu
        </Button>

        <Button icon={<CloseOutlined />} onClick={() => setVisibleFormGiayTo(false)}>
          Đóng
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormTiepNhanHoSo;
