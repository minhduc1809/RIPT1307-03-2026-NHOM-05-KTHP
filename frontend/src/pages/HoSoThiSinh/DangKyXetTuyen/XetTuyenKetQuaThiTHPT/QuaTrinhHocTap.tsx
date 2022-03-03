import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import {
  doiTuongUuTienTuyenSinh,
  hanhKiem,
  khuVucUuTien,
  Setting,
  ToHopXetTuyen,
} from '@/utils/constants';
import { ArrowLeftOutlined, ArrowRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tooltip,
} from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import InfoDoiTuongKhuVuc from '../components/InfoDoiTuongKhuVuc';
import InfoTruongTHPT from '../components/InfoTruongTHPT';

const QuaTrinhHocTapXetTuyenKetQuaThiTHPT = () => {
  const { setCurrent } = useModel('hosoxettuyen');
  const [form] = Form.useForm();
  const [toHop, setToHop] = useState<string[]>([]);
  const [arrMonHoc, setArrMonHoc] = useState<string[]>([]);
  const [visibleModalInfo, setVisibleModalInfo] = useState<boolean>(false);
  const [typeInfo, setTypeInfo] = useState<'doituonguutien' | 'khuvucuutien' | 'doituongxettuyen'>(
    'doituonguutien',
  );

  const onChangeToHop = (value: string[]) => {
    const arrMonHocTemp: string[] = [];
    value?.map((toHopItem: string) => {
      ToHopXetTuyen[toHopItem]?.map((mon: string) => {
        if (arrMonHocTemp.indexOf(mon) < 0) {
          arrMonHocTemp.push(mon);
        }
      });
    });
    setToHop(value);
    setArrMonHoc(arrMonHocTemp);
  };

  const onCancelModalInfo = () => {
    setVisibleModalInfo(false);
  };

  return (
    <>
      <Card bodyStyle={{ paddingTop: 0 }} bordered>
        <Form labelCol={{ span: 24 }} form={form} onFinish={(value) => {}}>
          <Row gutter={[20, 0]}>
            <InfoTruongTHPT form={form} />
            <Divider />
            <Col xs={24} lg={12}>
              <FormItem
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="doiTuongTuyenSinh"
                label={
                  <b>
                    Đối tượng ưu tiên
                    <Tooltip placement="bottom" title="Chi tiết">
                      <QuestionCircleOutlined
                        style={{ marginLeft: '5px' }}
                        onClick={() => {
                          setTypeInfo('doituonguutien');
                          setVisibleModalInfo(true);
                        }}
                      />
                    </Tooltip>
                  </b>
                }
                style={{ width: '100%', marginBottom: '0' }}
              >
                <Select
                  // onChange={this.onChangeTinh}
                  showSearch
                  placeholder="Chọn đối tượng"
                  allowClear
                >
                  {doiTuongUuTienTuyenSinh.map((val) => (
                    <Select.Option key={val} value={val}>
                      {val}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} lg={12}>
              <FormItem
                name="khuVucUuTien"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={
                  <b>
                    Khu vực ưu tiên
                    <Tooltip placement="bottom" title="Chi tiết">
                      <QuestionCircleOutlined
                        style={{ marginLeft: '5px' }}
                        onClick={() => {
                          setTypeInfo('khuvucuutien');
                          setVisibleModalInfo(true);
                        }}
                      />
                    </Tooltip>
                  </b>
                }
                style={{ width: '100%', marginBottom: '0' }}
              >
                <Select disabled showSearch placeholder="Chưa chọn trường" allowClear>
                  {khuVucUuTien.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Divider />
            <Col xs={24} lg={12}>
              <FormItem
                name="toHopXetTuyen"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label="Tổ hợp xét tuyển mong muốn"
                style={{ width: '100%', marginBottom: '0' }}
              >
                <Select
                  mode="multiple"
                  onChange={onChangeToHop}
                  value={toHop}
                  placeholder="Chọn tổ hợp"
                >
                  {Object.keys(ToHopXetTuyen)?.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item} (
                      {ToHopXetTuyen[item]?.map(
                        (mon: string, index: number) => `${mon}${index < 2 ? ', ' : ''}`,
                      )}
                      )
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col lg={12} xs={24}>
              <FormItem
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label="Năm tốt nghiệp"
                name="thoiGianTotNghiep"
                style={{ width: '100%', marginBottom: '0' }}
              >
                <Select style={{ width: '100%' }} placeholder="Thời gian tốt nghiệp">
                  {['Năm hiện tại', 'Trước năm hiện tại'].map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {toHop?.length > 0 && (
              <>
                <Divider plain>
                  <b>Kết quả thi THPT</b>
                </Divider>
                {arrMonHoc?.map((mon) => (
                  <Col key={mon} xs={12} sm={12} md={8}>
                    <FormItem
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      label={mon}
                      style={{ width: '100%', marginBottom: '0' }}
                    >
                      <InputNumber
                        placeholder="Số thập phân dạng 0.0"
                        min={0}
                        max={10}
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                  </Col>
                ))}
              </>
            )}
            <Divider plain>
              <b>Hạnh kiểm</b>
            </Divider>
            {[
              { label: 'Lớp 10', name: 'lop10.hanhKiem' },
              {
                label: 'Lớp 11',
                name: 'lop11.hanhKiem',
              },
              {
                label: 'Lớp 12',
                name: 'lop12.hanhKiem',
              },
            ].map((item) => (
              <Col key={item.label} xs={12} sm={12} md={8}>
                <FormItem
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label={item.label}
                  name={item.name}
                  style={{ width: '100%', marginBottom: '0' }}
                >
                  <Select
                    showSearch
                    placeholder="Chọn loại hạnh kiểm"
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {hanhKiem.map((val) => (
                      <Select.Option key={val} value={val}>
                        {val}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            ))}

            <Divider plain>
              <b>File minh chứng</b>
            </Divider>
            <Col xs={24} lg={12}>
              <FormItem
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="fileHoSoHocBa"
                label={<b>Phiếu điểm hoặc học bạ</b>}
                style={{ width: '100%', marginBottom: '0' }}
              >
                <Upload
                  otherProps={{
                    accept: 'application/pdf, image/png, .jpg',
                    multiple: true,
                    showUploadList: { showDownloadIcon: false },
                  }}
                  limit={8}
                />
              </FormItem>
            </Col>
            <Col xs={24} lg={12}>
              <FormItem
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={<b>Giấy tờ đối tượng ưu tiên</b>}
                style={{ width: '100%', marginBottom: '0' }}
                name="fileDoiTuongUuTien"
              >
                <Upload
                  otherProps={{
                    accept: 'application/pdf, image/png, .jpg',
                    multiple: true,
                    showUploadList: { showDownloadIcon: false },
                  }}
                  limit={8}
                />
              </FormItem>
            </Col>

            <Col />
          </Row>
          <br />
          <b style={{ color: Setting.primaryColor }}>Lưu ý:</b>
          <ul style={{ paddingLeft: 0 }}>
            <li>
              <b style={{ color: Setting.primaryColor }}>
                - Tổng dung lượng tập tin tải lên không quá 20MB!
              </b>
            </li>
            <li>
              <b style={{ color: Setting.primaryColor }}>
                - Nếu bạn thay đổi thông tin ở bước 2 thì tất cả nguyện vọng ở bước 3 sẽ bị xóa
              </b>
            </li>
          </ul>
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
              loading={false}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Bước 3/4
            </Button>
          </div>
        </Form>
      </Card>
      <Modal
        footer={
          <Button type="primary" onClick={onCancelModalInfo}>
            OK
          </Button>
        }
        width="800px"
        onCancel={onCancelModalInfo}
        visible={visibleModalInfo}
      >
        <InfoDoiTuongKhuVuc type={typeInfo} />
      </Modal>
    </>
  );
};

export default QuaTrinhHocTapXetTuyenKetQuaThiTHPT;
