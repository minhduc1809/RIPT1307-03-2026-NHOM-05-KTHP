import TableBase from '@/components/Table';
import type { HuongDanNhapHoc } from '@/services/HuongDanNhapHoc/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const HuongDanNhapHocComponent = () => {
  const {
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    getHuongDanNhapHocByDotNhapHocModel,
    setDanhSachDoiTuongGiayTo,
    setDanhSachDoiTuongLePhi,
    setDanhSachGiayTo,
    setDanhSachLePhi,
    deleteModel,
  } = useModel('huongdannhaphoc');

  const { getModel } = useModel('price');

  const { record: recordDotNhapHoc } = useModel('dotnhaphoc');
  const getData = () => getHuongDanNhapHocByDotNhapHocModel(recordDotNhapHoc?._id ?? '');
  const columns: IColumn<HuongDanNhapHoc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Thời gian',
      width: 200,
      align: 'center',
      render: (record: HuongDanNhapHoc.Record) => (
        <div>
          {moment(record.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} -{' '}
          {moment(record.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'diaDiem',
      width: 200,
      align: 'center',
    },
    {
      title: 'Ngành',
      dataIndex: 'danhSachNganhChuyenNganh',
      width: 250,
      align: 'center',
      render: (val: NganhChuyenNganh.Record[]) => (
        <div style={{ textAlign: 'left' }}>
          {val.map((item, index) => (
            <div key={item._id}>
              {index + 1}. {item.ten}
            </div>
          ))}
        </div>
      ),
    },
    // {
    //   title: 'Danh sách giấy tờ cần nộp',
    //   dataIndex: 'danhSachGiayToCanNop',
    //   width: 250,
    //   align: 'center',
    //   render: (val: DotTuyenSinh.GiayTo[]) => (
    //     <div style={{ textAlign: 'left' }}>
    //       {val.map((item, index) => (
    //         <div key={item.maGiayTo}>
    //           {index + 1}. {item.ten}
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
    // {
    //   title: 'Danh sách kinh phí',
    //   dataIndex: 'danhSachLePhiCanNop',
    //   width: 250,
    //   align: 'center',
    //   render: (val: DotNhapHoc.LePhi[]) => (
    //     <div style={{ textAlign: 'left' }}>
    //       {val.map((item, index) => (
    //         <div key={item.maLePhi}>
    //           {index + 1}. {item.ten}
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (record: HuongDanNhapHoc.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={async () => {
                if (
                  record?.danhSachLePhiCanNop?.length ||
                  record?.danhSachLePhiCanNopTheoDoiTuong?.length
                ) {
                  const arrMaLePhi: string[] = [];
                  record.danhSachLePhiCanNopTheoDoiTuong.map((item) => {
                    item.danhSachLePhiCanNop.map((lePhi) => {
                      if (!arrMaLePhi.includes(lePhi.maLePhi)) {
                        arrMaLePhi.push(lePhi.maLePhi);
                      }
                    });
                  });
                  record.danhSachLePhiCanNop.map((item) => {
                    if (!arrMaLePhi.includes(item.maLePhi)) {
                      arrMaLePhi.push(item.maLePhi);
                    }
                  });
                  await getModel({ _id: { $in: arrMaLePhi } }, 'pageable', 1, 100);
                  setDanhSachLePhi(record.danhSachLePhiCanNop);
                }

                setEdit(true);
                setRecord(record);
                setVisibleForm(true);
                setDanhSachDoiTuongGiayTo(record.danhSachGiayToCanNopTheoDoiTuong);
                setDanhSachDoiTuongLePhi(record.danhSachLePhiCanNopTheoDoiTuong);
                setDanhSachGiayTo(record.danhSachGiayToCanNop);
              }}
              type="default"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getData)}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button type="primary" shape="circle">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      hideCard
      widthDrawer="1000px"
      hascreate
      getData={getData}
      modelName="huongdannhaphoc"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default HuongDanNhapHocComponent;
