import { checkFileSize, uploadMultiFile } from '@/utils/utils';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Popconfirm } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import TableGiayTo from './components/TableGiayTo';
import TableLePhi from './components/TableLePhi';

const HuongDanThuTucNhapHoc = () => {
  const [form] = Form.useForm();

  const { record } = useModel('huongdannhaphoc');
  const {
    loading,
    setLoading,
    putMyKetQuaXetTuyenGiayToLePhiModel,
    record: recordKetQua,
  } = useModel('ketquaxettuyen');
  const { setCurrent } = useModel('hosoxettuyen');

  return (
    <Card bodyStyle={{ paddingTop: 0 }} bordered>
      <Form
        form={form}
        onFinish={async (values) => {
          setLoading(true);
          let index = 0;
          for (const item of values?.danhSachGiayToNop ?? []) {
            if (item?.urlGiayToNop?.fileList) {
              const checkSize = checkFileSize(item?.urlGiayToNop?.fileList ?? []);
              if (!checkSize) {
                setLoading(false);
                return;
              }
              const urlGiayToNop = await uploadMultiFile(item?.urlGiayToNop?.fileList ?? []);
              values.danhSachGiayToNop[index] = {
                // ...values.danhSachGiayToNop[index],
                ...record?.danhSachGiayToCanNop?.[index],
                urlGiayToNop,
              };
            }
            index += 1;
          }
          const payload: any = {
            danhSachGiayToNop: values?.danhSachGiayToNop || record?.danhSachGiayToCanNop,
            danhSachLePhiNop: record?.danhSachLePhiCanNop
              ?.filter((item) => item.required || item.accept)
              ?.map((item) => item.maLePhi),
          };
          await putMyKetQuaXetTuyenGiayToLePhiModel(recordKetQua?._id ?? '', payload);
          setCurrent(2);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
      >
        <Divider plain>
          <strong>Thông tin chung</strong>
        </Divider>
        <div style={{ textAlign: 'left' }}>
          <b>1. Thời gian nhập học: </b>{' '}
          {moment(record?.thoiGianBatDau).format('HH:mm dd DD/MM/YYYY')}
          {' - '}
          {moment(record?.thoiGianKetThuc).format('HH:mm dd DD/MM/YYYY')}
          <br />
          <b>2. Địa điểm: </b> {record?.diaDiem}
          <br />
        </div>
        <Divider plain>
          <strong>Danh sách giấy tờ cần nộp</strong>
        </Divider>
        <TableGiayTo mode="submit" fieldData="danhSachGiayToCanNop" fieldName="danhSachGiayToNop" />
        <br />
        <Divider plain>
          <strong>Danh sách lệ phí cần nộp</strong>
        </Divider>
        <TableLePhi mode="handle" />
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Popconfirm
            title={
              <>
                <p>Các thông tin vừa nhập sẽ không được lưu.</p>
                <p>Bạn có muốn quay lại bước 1?</p>
              </>
            }
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              setCurrent(0);
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
          >
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Bước 1/4
            </Button>
          </Popconfirm>
          <Button
            icon={<ArrowRightOutlined />}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Bước 3/4
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default HuongDanThuTucNhapHoc;
