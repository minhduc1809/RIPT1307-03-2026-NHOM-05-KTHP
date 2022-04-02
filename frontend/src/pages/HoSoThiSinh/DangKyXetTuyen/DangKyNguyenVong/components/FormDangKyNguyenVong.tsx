import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, message, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

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

  const [coSoDaoTao, setCoSoDaoTao] = useState<string>(recordNguyenVong?.coSoDaoTao?._id ?? '');
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

  const [maDoiTuong, setMaDoiTuong] = useState<string>(recordNguyenVong?.maDoiTuong ?? '');
  const verifyNguyenVong = (nguyenVong: HoSoXetTuyen.NguyenVong): boolean => {
    let check = true;
    danhSachNguyenVong?.map((item) => {
      if (
        item?.coSoDaoTao?._id === nguyenVong?.coSoDaoTao?._id &&
        item?.idNganhChuyenNganh === nguyenVong?.idNganhChuyenNganh &&
        item?.toHopXetTuyen === nguyenVong?.toHopXetTuyen &&
        item?.maDoiTuong === nguyenVong?.maDoiTuong
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
    if (!edit && recordHoSo?.maDoiTuong?.length === 1) {
      form.setFieldsValue({
        maDoiTuong: recordHoSo?.maDoiTuong?.[0],
      });
      setMaDoiTuong(recordHoSo?.maDoiTuong?.[0]);
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
            tenCoSoDaoTao,
            tenDoiTuong: record?.danhSachDoiTuongTuyenSinh?.find(
              (item) => item.maDoiTuong === values?.maDoiTuong,
            )?.thongTinDoiTuong?.tenDoiTuong,
            idNganhChuyenNganh,
            maNganhChuyenNganh,
            nganhXetTuyen: undefined,
          };
          if (!verifyNguyenVong({ ...valueNguyenVong, coSoDaoTao: { _id: coSoDaoTao } })) {
            message.error('Nguyện vọng đã tồn tại');
            return;
          }
          const responseQuyDoi = await putMyTinhQuyDoiNguyenVongModel({
            nguyenVong: valueNguyenVong,
          });
          if (responseQuyDoi?.data?.statusCode === 200) {
            if (!edit)
              setDanhSachNguyenVong([
                ...danhSachNguyenVong,
                { ...responseQuyDoi?.data?.data, coSoDaoTao: { _id: coSoDaoTao } },
              ]);
            else {
              if (recordNguyenVong) {
                danhSachNguyenVong.splice(recordNguyenVong?.soThuTu - 1, 1, {
                  ...responseQuyDoi?.data?.data,
                  coSoDaoTao: { _id: coSoDaoTao },
                });
                setDanhSachNguyenVong(danhSachNguyenVong);
              }
            }
            setVisibleFormNguyenVong(false);
          }
        }}
      >
        <Form.Item
          initialValue={recordNguyenVong?.maDoiTuong}
          rules={[...rules.required]}
          label="Chọn đối tượng xét tuyển"
          name="maDoiTuong"
        >
          <Select
            onChange={(val) => setMaDoiTuong(val)}
            placeholder="Chọn đối tượng xét tuyển"
            style={{ width: '100%' }}
            options={record?.danhSachDoiTuongTuyenSinh
              ?.filter((item) => recordHoSo?.maDoiTuong?.includes(item?.maDoiTuong ?? ''))
              ?.map((item) => ({
                value: item?.maDoiTuong,
                label: item?.thongTinDoiTuong?.tenDoiTuong,
              }))}
          />
        </Form.Item>
        <Form.Item
          initialValue={
            edit
              ? `${recordNguyenVong?.coSoDaoTao?._id}||${recordNguyenVong?.tenCoSoDaoTao}`
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
                label: `${item?.nganh?.ma} - ${item?.nganh?.ten} (${item?.danhSachToHop})`,
              }))}
          />
        </Form.Item>
        {record?.danhSachNganhTuyenSinh?.find((item) => item?.nganh?._id === idNganhChuyenNganh)
          ?.danhSachToHop?.length &&
        record?.danhSachDoiTuongTuyenSinh?.find((item) => item.maDoiTuong === maDoiTuong)
          ?.yeuCauLuaChonToHop === true ? (
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
          {/* <Button
            onClick={() => form.resetFields()}
            icon={<RetweetOutlined />}
            style={{ marginRight: 10 }}
          >
            Làm sạch
          </Button> */}
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
