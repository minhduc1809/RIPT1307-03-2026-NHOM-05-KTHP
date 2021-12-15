import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';
import ViewThongBao from './components/ViewThongBao';

const ThongBao = () => {
  const { getThongBaoAdminModel, page, limit, loading, condition, setCondition } =
    useModel('thongbao');
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<ThongBao.Record>();
  const access = useAccess();
  const {
    getLopHanhChinhAdminModel,
    condition: condLopHanhChinh,
    getAllHinhThucDaoTaoModel,
    danhSachHinhThucDaoTao,
  } = useModel('lophanhchinh');
  const { getAllNganhModel } = useModel('nganh');
  const { adminGetLopTinChi, condition: condLopTinChi } = useModel('loptinchi');
  const { getKhoaHocModel } = useModel('khoahoc');
  const { getUserModel, condition: condUser } = useModel('user');
  const { getAllDonViModel } = useModel('donvi');
  useEffect(() => {
    getUserModel({ pageParam: 1, limitParam: 100 });
  }, [condUser]);

  useEffect(() => {
    adminGetLopTinChi(100);
  }, [condLopTinChi]);

  useEffect(() => {
    getLopHanhChinhAdminModel({ page: 1, limit: 100 });
  }, [condLopHanhChinh]);

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
    getAllDonViModel();
    getAllNganhModel();
    getKhoaHocModel({ pageParam: 1, limitParam: 1000 });
  }, []);

  const onCell = (recordThongBao: ThongBao.Record) => ({
    onClick: () => {
      setVisible(true);
      setRecord(recordThongBao);
    },
    style: { cursor: 'pointer' },
  });
  const columns: IColumn<ThongBao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Người gửi',
      dataIndex: 'senderName',
      align: 'center',
      width: 200,
      search: 'search',
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      search: 'search',
      onCell,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'center',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (recordThongBao) => (
        <Tooltip title="Xem chi tiết">
          <Button
            onClick={() => {
              setRecord(recordThongBao);
              setVisible(true);
            }}
            shape="circle"
            type="primary"
            icon={<EyeOutlined />}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <>
      <TableBase
        title="Thông báo"
        columns={columns}
        modelName="thongbao"
        loading={loading}
        hascreate
        Form={Form}
        widthDrawer="60%"
        formType="Drawer"
        getData={getThongBaoAdminModel}
        dependencies={[page, limit, condition]}
      >
        {access.admin && (
          <Select
            value={condition?.hinhThucDaoTaoId ?? -1}
            onChange={(val: number) => {
              setCondition({ ...condition, hinhThucDaoTaoId: val });
            }}
            style={{ marginBottom: 8, width: 250, marginRight: 8 }}
          >
            <Select.Option value={-1} key={-1}>
              Tất cả hình thức đào tạo
            </Select.Option>
            {danhSachHinhThucDaoTao?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.ten_hinh_thuc_dao_tao}
              </Select.Option>
            ))}
          </Select>
        )}
      </TableBase>
      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>
        }
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Chi tiết thông báo"
      >
        <ViewThongBao record={record} />
      </Modal>
    </>
  );
};

export default ThongBao;
