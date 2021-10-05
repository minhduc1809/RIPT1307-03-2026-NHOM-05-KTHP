import type { LopTinChi } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { CloseOutlined, FileOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const KetQuaHocTapGV = (props: { id: string }) => {
  const {
    giangVienGetKetQuaHocTapByIdLopTinChiModel,
    loading,
    danhSachKetQuaHocTap,
    setDanhSachKetQuaHocTap,
    giangVienPutKetQuaHocTapByIdLopTinChiModel,
  } = useModel('loptinchi');

  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (props.id) giangVienGetKetQuaHocTapByIdLopTinChiModel(Number(props.id));
    return () => {
      setDanhSachKetQuaHocTap([]);
    };
  }, [props.id]);

  const [form] = Form.useForm();

  const renderInput = (name: string[], initialValue: number) => (
    <Form.Item style={{ marginBottom: 0 }} initialValue={initialValue} name={name}>
      <InputNumber max={10} min={0} />
    </Form.Item>
  );

  const columns: IColumn<LopTinChi.KetQuaHocTap>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ tên',
      dataIndex: 'TenDayDu',
      align: 'center',
      // width: 200,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma_sv',
      align: 'center',
      width: 150,
    },
    {
      title: 'Điểm chuyên cần',
      dataIndex: 'diem_attendance',
      align: 'center',
      width: 140,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_sv, 'diem_attendance'], record.diem_attendance)
        ) : (
          <div>{val}</div>
        );
      },
    },
    {
      title: 'Điểm bài tập',
      dataIndex: 'diem_bai_tap',
      align: 'center',
      width: 140,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_sv, 'diem_bai_tap'], record.diem_bai_tap)
        ) : (
          <div>{val}</div>
        );
      },
    },

    {
      title: 'Điểm TB kiểm tra',
      dataIndex: 'diem_trung_binh_kiem_tra_tren_lop',
      align: 'center',
      width: 140,
      render: (val, record) => {
        return edit ? (
          renderInput(
            [record.ma_sv, 'diem_trung_binh_kiem_tra_tren_lop'],
            record.diem_trung_binh_kiem_tra_tren_lop,
          )
        ) : (
          <div>{val}</div>
        );
      },
    },
    {
      title: 'Điểm thực hành',
      dataIndex: 'diem_thi_nghiem',
      align: 'center',
      width: 140,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_sv, 'diem_thi_nghiem'], record.diem_thi_nghiem)
        ) : (
          <div>{val}</div>
        );
      },
    },
    {
      title: 'Điểm cuối kỳ',
      dataIndex: 'diem_cuoi_ky',
      align: 'center',
      width: 140,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_sv, 'diem_cuoi_ky'], record.diem_cuoi_ky)
        ) : (
          <div>{val}</div>
        );
      },
    },
  ];

  return (
    <Form
      form={form}
      onFinish={async (values) => {
        const danhSachKetQua: LopTinChi.KetQuaHocTap[] = danhSachKetQuaHocTap?.map((item) => {
          return {
            sinh_vien_id: item?.sinh_vien_id?.[0],
            ...values?.[item.ma_sv],
          };
        });
        await giangVienPutKetQuaHocTapByIdLopTinChiModel(Number(props.id), danhSachKetQua);
        setEdit(false);
      }}
    >
      {!edit ? (
        <Button
          icon={<FileOutlined />}
          onClick={() => {
            setEdit(true);
          }}
          style={{ marginBottom: 8 }}
          type="primary"
        >
          Nhập điểm
        </Button>
      ) : (
        <>
          <Button
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ marginBottom: 8, marginRight: 8 }}
            type="primary"
          >
            Lưu
          </Button>

          <Button onClick={() => setEdit(false)} icon={<CloseOutlined />}>
            Hủy
          </Button>
        </>
      )}
      <Table
        dataSource={danhSachKetQuaHocTap?.map((item, index) => {
          return { ...item, index: index + 1 };
        })}
        pagination={{ showTotal: (total) => `Tổng số : ${total} sinh viên` }}
        columns={columns}
        loading={loading}
      />
    </Form>
  );
};

export default KetQuaHocTapGV;
