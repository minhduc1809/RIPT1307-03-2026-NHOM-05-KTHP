import TinyEditor from '@/components/TinyEditor/Tiny';
import { getThongBaoLopHanhChinhById } from '@/services/LopHanhChinh/lophanhchinh';
import {
  addThongBao,
  addThongBaoLopHanhChinh,
  getThongBaoLopTinChiById,
} from '@/services/LopTinChi/loptinchi';
import type { IResThongBaoLopTinChi } from '@/services/LopTinChi/typings';
import rules from '@/utils/rules';
import { PlusCircleFilled } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Input, message, Modal, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ViewThongBao from './ViewThongBao';

const ThongBao = (props: { id: number; isNhanVien?: boolean; typeLop: string }) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [recordTB, setRecordTB] = useState<IResThongBaoLopTinChi.Result>({});
  const [state, setstate] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataThongBao, setdataThongBao] = useState<IResThongBaoLopTinChi.Result[]>([]);
  const [form] = Form.useForm();
  const getData = async () => {
    const res =
      props.typeLop === 'LopTinChi'
        ? await getThongBaoLopTinChiById({
            page,
            limit,
            idLop: props?.id,
            role: props.isNhanVien ? 'giang-vien' : 'sinh-vien',
          })
        : await getThongBaoLopHanhChinhById({
            idLop: props.id,
            role: props.isNhanVien ? 'can-bo' : 'sinh-vien',
            data: { page, limit },
          });
    setdataThongBao(res?.data?.data?.result);
  };
  useEffect(() => {
    getData();
  }, [props?.id, props.isNhanVien, state, page, limit]);

  const dsThongBao = dataThongBao?.map((value, index) => ({
    ...value,
    index: index + 1,
  }));

  const viewThongBao = (rc: IResThongBaoLopTinChi.Result) => {
    setVisibleModal(true);
    setRecordTB(rc);
  };

  const onCell = (rc: IResThongBaoLopTinChi.Result) => ({
    onClick: () => viewThongBao(rc),
    style: { cursor: 'pointer' },
  });

  const columns: ProColumns<IResThongBaoLopTinChi.Result>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Nội dung',
      dataIndex: 'htmlContent',
      align: 'center',
      ellipsis: true,
      render: (val: any, record) => {
        return (
          <Typography.Paragraph
            ellipsis={{ rows: 3, expandable: false }}
            style={{ marginBottom: 0 }}
          >
            <div dangerouslySetInnerHTML={{ __html: record?.htmlContent ?? '' }} />
          </Typography.Paragraph>
        );
      },
      width: 200,
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 110,
      render: (_, rc: IResThongBaoLopTinChi.Result) => (
        <span title={moment(rc.createdAt).format('DD/MM/YYYY HH:mm:ss')}>
          {moment(rc.createdAt).format('DD/MM/YYYY')}
        </span>
      ),
    },
  ];
  return (
    <>
      {props.isNhanVien && (
        <Button
          style={{ marginBottom: 8 }}
          onClick={() => {
            setEdit(false);
            setVisibleDrawer(true);
          }}
          type="primary"
        >
          <PlusCircleFilled />
          Thêm mới
        </Button>
      )}
      <ProTable<IResThongBaoLopTinChi.Result, API.ApiResponse>
        pagination={{
          showTotal: () => <div></div>,
          pageSize: limit,
          onChange: (pageNumber: number, limitNumber?: number) => {
            setPage(pageNumber);
            setLimit(limitNumber || 10);
          },
        }}
        rowKey="key"
        dataSource={dsThongBao ?? []}
        search={false}
        toolBarRender={false}
        bordered
        columns={columns}
      ></ProTable>

      <Drawer
        maskClosable={false}
        onClose={() => setVisibleDrawer(false)}
        width="60%"
        visible={visibleDrawer}
        destroyOnClose
        title="Gửi thông báo"
      >
        <Form
          labelCol={{ span: 24 }}
          form={form}
          title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
          onFinish={async (values: any) => {
            setLoading(true);

            const newValues = {
              ...values,
              // imageUrl: response?.data?.data?.url,
              htmlContent: values?.htmlContent?.text,
            };
            try {
              const res =
                props.typeLop === 'LopTinChi'
                  ? await addThongBao({ idLop: props.id, newValues })
                  : await addThongBaoLopHanhChinh({ idLop: props.id, newValues });
              if (res?.data?.statusCode === 201) {
                message.success('Thêm mới thành công');
                setstate(state + 1);
                setVisibleDrawer(false);
                return true;
              }
            } catch (error) {
              setLoading(false);
              message.error('Đã xảy ra lỗi');
            }

            return false;
          }}
        >
          <Form.Item name="title" label="Tiêu đề" rules={[...rules.required]}>
            <Input placeholder="Tiêu đề" />
          </Form.Item>

          {/* <Form.Item name="content" label="Mô tả" rules={[...rules.required]}>
            <Input placeholder="Mô tả" />
          </Form.Item> */}

          {/* <Form.Item name="imageUrl" label="Ảnh">
            <Upload listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải lên (Tối đa: 1)</Button>
            </Upload>
          </Form.Item> */}
          <Form.Item name="htmlContent" label="Nội dung" rules={[...rules.required]}>
            <TinyEditor />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Gửi
            </Button>
            <Button onClick={() => setVisibleDrawer(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        onCancel={() => {
          setVisibleModal(false);
        }}
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button onClick={() => setVisibleModal(false)} type="primary">
            Đóng
          </Button>
        }
        visible={visibleModal}
      >
        <ViewThongBao record={recordTB} />
      </Modal>
    </>
  );
};

export default ThongBao;
