import { CloseOutlined, PlusOutlined, RetweetOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Button, Card, Form, message, Select } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';
import { ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { useEffect } from 'react';

const FormDangKyNguyenVong = () => {
  const [form] = Form.useForm();
  const {
    edit,
    setVisibleFormNguyenVong,
    danhSachNguyenVong,
    setDanhSachNguyenVong,
    recordHoSo,
    recordNguyenVong,
    putMyTinhQuyDoiNguyenVongModel,
  } = useModel('hosoxettuyen');
  const { record } = useModel('dottuyensinh');
  const arrCoSoDaoTao: CoSoDaoTao.Record[] = [];
  record?.danhSachNganhTuyenSinh?.map((item) => {
    item?.danhSachCoSoDaoTao?.map((coSo) => {
      arrCoSoDaoTao.push(coSo);
    });
  });

  const [coSoDaoTao, setCoSoDaoTao] = useState<any>(
    recordNguyenVong?.coSoDaoTao?._id
      ? recordNguyenVong?.coSoDaoTao?._id
      : recordNguyenVong?.coSoDaoTao,
  );
  const [tenCoSoDaoTao, setTenCoSoDaoTao] = useState<string>(recordNguyenVong?.tenCoSoDaoTao ?? '');
  const [idNganhChuyenNganh, setIdNganhChuyenNganh] = useState<string>(
    recordNguyenVong?.idNganhChuyenNganh ?? '',
  );
  const [maNganhChuyenNganh, setMaNganhChuyenNganh] = useState<string>(
    recordNguyenVong?.maNganhChuyenNganh ?? '',
  );
  const [tenNganhChuyenNganh, setTenNganhChuyenNganh] = useState<string>(
    recordNguyenVong?.tenNganhChuyenNganh ?? '',
  );
  const verifyNguyenVong = (nguyenVong: HoSoXetTuyen.NguyenVong): boolean => {
    let check = true;
    danhSachNguyenVong?.map((item) => {
      if (
        item.coSoDaoTao === nguyenVong.coSoDaoTao &&
        item.idNganhChuyenNganh === nguyenVong.idNganhChuyenNganh &&
        item.toHopXetTuyen === nguyenVong.toHopXetTuyen
      ) {
        check = false;
      }
    });
    return check;
  };

  const onChangeCoSoDaoTao = (val: string) => {
    const arrValueCoSoDaoTao = val?.split('||');
    setCoSoDaoTao(arrValueCoSoDaoTao[0]);
    setTenCoSoDaoTao(arrValueCoSoDaoTao[1]);
    form.setFieldsValue({
      nganhXetTuyen: undefined,
      toHopXetTuyen: undefined,
    });
  };

  useEffect(() => {
    const listCoSoDaoTao = _.uniqBy(arrCoSoDaoTao, '_id');
    if (!edit && listCoSoDaoTao?.length === 1) {
      onChangeCoSoDaoTao(`${listCoSoDaoTao[0]._id}||${listCoSoDaoTao[0].ten}`);
      form.setFieldsValue({
        coSoDaoTao: `${listCoSoDaoTao[0]._id}||${listCoSoDaoTao[0].ten}`,
      });
    }
  }, []);

  return (
    <Card title={edit ? 'Chỉnh sửa nguyện vọng' : 'Thêm nguyện vọng'} bordered>
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={async (values) => {
          const valueNguyenVong = {
            ...values,
            soThuTu: edit ? recordNguyenVong?.soThuTu : danhSachNguyenVong.length + 1,
            tenNganhChuyenNganh,
            coSoDaoTao,
            maDoiTuong: recordHoSo?.maDoiTuong,
            tenCoSoDaoTao,
            tenDoiTuong: record?.danhSachDoiTuongTuyenSinh?.find(
              (item) => item.maDoiTuong === recordHoSo?.maDoiTuong,
            )?.thongTinDoiTuong?.tenDoiTuong,
            idNganhChuyenNganh,
            maNganhChuyenNganh,
            nganhXetTuyen: undefined,
          };
          if (!verifyNguyenVong(valueNguyenVong)) {
            message.error('Nguyện vọng đã tồn tại');
            return;
          }
          const responseQuyDoi = await putMyTinhQuyDoiNguyenVongModel({
            nguyenVong: valueNguyenVong,
          });
          if (responseQuyDoi?.data?.statusCode === 200) {
            if (!edit) setDanhSachNguyenVong([...danhSachNguyenVong, responseQuyDoi?.data?.data]);
            else {
              if (recordNguyenVong) {
                danhSachNguyenVong.splice(
                  recordNguyenVong?.soThuTu - 1,
                  1,
                  responseQuyDoi?.data?.data,
                );
                setDanhSachNguyenVong(danhSachNguyenVong);
              }
            }
            setVisibleFormNguyenVong(false);
          }
        }}
      >
        <Form.Item
          initialValue={
            edit
              ? `${
                  recordNguyenVong?.coSoDaoTao?._id
                    ? recordNguyenVong?.coSoDaoTao?._id
                    : recordNguyenVong?.coSoDaoTao
                }||${recordNguyenVong?.tenCoSoDaoTao}`
              : undefined
          }
          rules={[...rules.required]}
          label="Chọn cơ sở đào tạo"
          name="coSoDaoTao"
        >
          <Select
            onChange={(val) => {
              onChangeCoSoDaoTao(val);
            }}
            placeholder="Chọn cơ sở đào tạo"
            style={{ width: '100%' }}
            options={_.uniqBy(arrCoSoDaoTao, '_id')?.map((item) => ({
              value: `${item._id}||${item.ten}`,
              label: `${item.ten} (${item.tenVietTat})`,
            }))}
          />
        </Form.Item>
        <Form.Item
          initialValue={
            edit
              ? `${recordNguyenVong?.idNganhChuyenNganh}||${recordNguyenVong?.maNganhChuyenNganh}||${recordNguyenVong?.tenNganhChuyenNganh}`
              : undefined
          }
          rules={[...rules.required]}
          label="Chọn ngành xét tuyển"
          name="nganhXetTuyen"
        >
          <Select
            placeholder="Chọn ngành xét tuyển"
            style={{ width: '100%' }}
            onChange={(val) => {
              const arrValueNganhXetTuyen = val?.split('||');
              setIdNganhChuyenNganh(arrValueNganhXetTuyen[0]);
              setMaNganhChuyenNganh(arrValueNganhXetTuyen[1]);
              setTenNganhChuyenNganh(arrValueNganhXetTuyen[2]);
              form.setFieldsValue({
                toHopXetTuyen: undefined,
              });
            }}
            options={record?.danhSachNganhTuyenSinh
              ?.filter((item) => item.danhSachCoSoDaoTao?.find((coSo) => coSo._id === coSoDaoTao))
              ?.map((item) => ({
                value: `${item?.nganh?._id}||${item?.nganh?.ma}||${item?.nganh?.ten}`,
                label: `${item?.nganh?.ma}-${item?.nganh?.ten}`,
              }))}
          />
        </Form.Item>
        {record?.danhSachNganhTuyenSinh?.find((item) => item?.nganh?._id === idNganhChuyenNganh)
          ?.danhSachToHop?.length ? (
          <Form.Item
            initialValue={recordNguyenVong?.toHopXetTuyen}
            rules={[...rules.required]}
            name="toHopXetTuyen"
            label="Chọn tổ hợp xét tuyển"
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Tổ hợp xét tuyển"
              options={record?.danhSachNganhTuyenSinh
                ?.find((item) => item?.nganh?._id === idNganhChuyenNganh)
                ?.danhSachToHop?.map((item) => ({
                  value: item,
                  label: `${item} (${ToHopXetTuyen[item]})`,
                }))}
            />
          </Form.Item>
        ) : (
          <div />
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            onClick={() => form.resetFields()}
            icon={<RetweetOutlined />}
            style={{ marginRight: 10 }}
          >
            Làm sạch
          </Button>
          <Button
            icon={<PlusOutlined />}
            // onClick={() => this.handleSubmit(0)}
            type="primary"
            htmlType="submit"
            style={{ marginRight: 10, marginBottom: 10 }}
            // disabled={this.state.disable}
          >
            Lưu
          </Button>
          <Button icon={<CloseOutlined />} onClick={() => setVisibleFormNguyenVong(false)}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormDangKyNguyenVong;
