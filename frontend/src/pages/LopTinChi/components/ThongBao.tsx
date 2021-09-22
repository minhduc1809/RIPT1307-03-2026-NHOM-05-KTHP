import TinyEditor from '@/components/TinyEditor/Tiny';
import { addThongBao, getThongBaoLopTinChiById, getURLImg } from '@/services/LopTinChi/loptinchi';
import type { IResThongBaoLopTinChi } from '@/services/LopTinChi/typings';
import { PlusCircleFilled, UploadOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, message, Modal, Upload } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ViewThongBao from './ViewThongBao';

const ThongBao = (props: { id: string; isGiangVien: boolean }) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [recordTB, setRecordTB] = useState<IResThongBaoLopTinChi.Result>({});
  const [state, setstate] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [dataThongBao, setdataThongBao] = useState<IResThongBaoLopTinChi.Result[]>([]);
  const getData = async () => {
    const res = await getThongBaoLopTinChiById({
      page,
      limit,
      idLop: props?.id,
      role: props.isGiangVien ? 'giang-vien' : 'sinh-vien',
    });
    setdataThongBao(res?.data?.data?.result);
  };
  useEffect(() => {
    getData();
  }, [props?.id, props.isGiangVien, state, page, limit]);

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
      dataIndex: 'content',
      align: 'center',
      ellipsis: true,
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
      <ProTable<IResThongBaoLopTinChi.Result, API.PageParams>
        pagination={{
          showTotal: () => <div></div>,
          pageSize: limit,
          onChange: (pageNumber: number, limitNumber?: number) => {
            setPage(pageNumber);
            setLimit(limitNumber || 10);
          },
        }}
        headerTitle="Danh sách thông báo"
        rowKey="key"
        dataSource={dsThongBao ?? []}
        search={false}
        toolBarRender={() =>
          props.isGiangVien
            ? [
                <Button
                  onClick={() => {
                    setEdit(false);
                    setVisibleDrawer(true);
                  }}
                  type="primary"
                >
                  <PlusCircleFilled />
                  Thêm mới
                </Button>,
              ]
            : []
        }
        bordered
        columns={columns}
      />
      <DrawerForm<IResThongBaoLopTinChi.Result>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: true,
          destroyOnClose: true,
        }}
        onFinish={async (values: any) => {
          const response = await getURLImg({
            filename: 'url1',
            public: true,
            file: values?.imageUrl.file.originFileObj,
          });

          const newValues = {
            ...values,
            imageUrl: response?.data?.data?.url,
            htmlContent: values?.htmlContent?.text,
          };
          const res = await addThongBao({ idLop: props.id, newValues });

          if (res?.data?.statusCode === 201) {
            message.success('Thêm mới thành công');
            setstate(state + 1);
            return true;
          }
          message.error('Đã xảy ra lỗi');
          return false;
          //
        }}
        submitter={{
          render: (newProps) => {
            // DefaultDom có thể dùng hoặc không

            return [
              // ...defaultDoms,
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                Lưu
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
        initialValues={{
          ...(edit && recordTB),
        }}
      >
        <ProFormText name="title" label="Tiêu đề" tooltip="Tiêu đề" placeholder="Tiêu đề" />
        <ProFormText name="content" label="Mô tả" tooltip="Mô tả" placeholder="Mô tả" />
        <Form.Item name="imageUrl" label="Ảnh" rules={[{ required: true }]}>
          <Upload listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Tải lên (Tối đa: 1)</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="htmlContent" label="Nội dung" rules={[{ required: true }]}>
          <TinyEditor />
        </Form.Item>

        {edit && (
          <div
            dangerouslySetInnerHTML={{ __html: recordTB.htmlContent || '' }}
            style={{ width: '100%', overflow: 'scroll' }}
          />
        )}
      </DrawerForm>
      <Modal
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
