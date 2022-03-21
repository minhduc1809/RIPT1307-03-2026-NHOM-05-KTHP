import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import {
  arrKhuVucUuTien,
  doiTuongUuTienTuyenSinh,
  EKhuVucUuTien,
  Setting,
} from '@/utils/constants';
import rules from '@/utils/rules';
import {
  calculateChuyen,
  calculateKhuVuc,
  checkFileSize,
  renderFileList,
  uploadMultiFile,
} from '@/utils/utils';
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
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BlockChungChiNgoaiNgu from './components/BlockChungChiNgoaiNgu';
import BlockChungChiQuocTe from './components/BlockChungChiQuocTe';
import BlockDanhGiaNangLuc from './components/BlockDanhGiaNangLuc';
import BlockGiaiHSG from './components/BlockGiaiHSG';
import BlockHanhKiem from './components/BlockHanhKiem';
import BlockKetQuaHocTapTHPT from './components/BlockKetQuaHocTapTHPT';
import InfoDoiTuongKhuVuc from './components/InfoDoiTuongKhuVuc';
import InfoTruongTHPT from './components/InfoTruongTHPT';

const QuaTrinhHocTap = () => {
  const {
    setCurrent,
    recordHoSo,
    khuVucUuTienLop10,
    khuVucUuTienLop11,
    khuVucUuTienLop12,
    isTruongChuyenLop10,
    isTruongChuyenLop11,
    isTruongChuyenLop12,
    setKhuVucUuTienLop10,
    setKhuVucUuTienLop11,
    setKhuVucUuTienLop12,
    setIsTruongChuyenLop10,
    setIsTruongChuyenLop11,
    setIsTruongChuyenLop12,
    putMyThongTinXetTuyenModel,
  } = useModel('hosoxettuyen');
  const { record } = useModel('dottuyensinh');
  const [form] = Form.useForm();
  const { tenTruong10, tenTruong11, tenTruong12, setTenTruong10, setTenTruong11, setTenTruong12 } =
    useModel('truongthpt');

  const [doiTuongXetTuyen, setDoiTuongXetTuyen] = useState<string>(recordHoSo?.maDoiTuong ?? '');

  const [visibleModalInfo, setVisibleModalInfo] = useState<boolean>(false);
  const [typeInfo, setTypeInfo] = useState<'doituonguutien' | 'khuvucuutien' | 'doituongxettuyen'>(
    'doituonguutien',
  );
  const [isChuyenTruong, setIsChuyenTruong] = useState<boolean>(false);
  const [typeHSG, setTypeHSG] = useState<string>();
  const [namTotNghiep, setNamTotNghiep] = useState<number>(
    recordHoSo?.thongTinHocTapTHPT?.namTotNghiep ||
      record?.namTuyenSinh ||
      new Date().getFullYear(),
  );

  useEffect(() => {
    setKhuVucUuTienLop10(recordHoSo?.thongTinHocTapTHPT?.truongLop10?.khuVucUuTienTuyenSinh);
    setKhuVucUuTienLop11(recordHoSo?.thongTinHocTapTHPT?.truongLop11?.khuVucUuTienTuyenSinh);
    setKhuVucUuTienLop12(recordHoSo?.thongTinHocTapTHPT?.truongLop12?.khuVucUuTienTuyenSinh);
    setIsTruongChuyenLop10(recordHoSo?.thongTinHocTapTHPT?.truongLop10?.truongChuyen ?? false);
    setIsTruongChuyenLop11(recordHoSo?.thongTinHocTapTHPT?.truongLop11?.truongChuyen ?? false);
    setIsTruongChuyenLop12(recordHoSo?.thongTinHocTapTHPT?.truongLop12?.truongChuyen ?? false);
    setTenTruong10(recordHoSo?.thongTinHocTapTHPT?.truongLop10?.tenTruong);
    setTenTruong11(recordHoSo?.thongTinHocTapTHPT?.truongLop11?.tenTruong);
    setTenTruong12(recordHoSo?.thongTinHocTapTHPT?.truongLop12?.tenTruong);
    setIsChuyenTruong(
      !(
        recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTruong ===
          recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTruong &&
        recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTruong ===
          recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTruong
      ),
    );
    let loaiGiaiHSG;
    if (recordHoSo?.thongTinGiaiQuocGia?.suDungGiaiHGSQG === true) {
      setTypeHSG('thongTinGiaiQuocGia||QG');
      loaiGiaiHSG = 'thongTinGiaiQuocGia||QG';
    } else if (recordHoSo?.thongTinGiaiTinhTP?.suDungGiaiHGSTinhTP === true) {
      setTypeHSG('thongTinGiaiTinhTP||TinhTP');
      loaiGiaiHSG = 'thongTinGiaiTinhTP||TinhTP';
    }
    form.setFieldsValue({ loaiGiaiHSG });
  }, [recordHoSo?._id]);

  useEffect(() => {
    if (!isChuyenTruong) {
      form.setFieldsValue({
        thongTinHocTapTHPT: { khuVucUuTienTuyenSinh: khuVucUuTienLop10 },
      });
    } else {
      const calKhuVuc = calculateKhuVuc([
        khuVucUuTienLop10 || '',
        khuVucUuTienLop11 || '',
        khuVucUuTienLop12 || '',
      ]);
      form.setFieldsValue({
        thongTinHocTapTHPT: { khuVucUuTienTuyenSinh: arrKhuVucUuTien?.[calKhuVuc] },
      });
    }
  }, [isChuyenTruong, khuVucUuTienLop10, khuVucUuTienLop11, khuVucUuTienLop12]);

  const onCancelModalInfo = () => {
    setVisibleModalInfo(false);
  };

  return (
    <>
      <Card bodyStyle={{ paddingTop: 0 }} bordered>
        <Form
          scrollToFirstError
          labelCol={{ span: 24 }}
          form={form}
          onFinish={async (values) => {
            const isSuDungGiaiQuocGia =
              typeHSG === 'thongTinGiaiQuocGia||QG' && values?.maDoiTuong === 'CQ_PTIT_KH3';
            const isSuDungGiaiTinhTP =
              typeHSG === 'thongTinGiaiTinhTP||TinhTP' && values?.maDoiTuong === 'CQ_PTIT_KH3';
            const suDungDanhGiaNangLuc = values?.maDoiTuong === 'CQ_PTIT_DGNL1';
            const suDungChungChiQuocTe = values?.maDoiTuong === 'CQ_PTIT_KH1';
            const suDungChungChiNgoaiNgu = values?.maDoiTuong === 'CQ_PTIT_KH2';
            const arrFieldNameUpload = [
              'urlChungNhanDoiTuongUuTien',
              'urlHocBa',
              'urlBangKhenHSGQG',
              'urlBangKhenHSGTinhTP',
              'urlChungChiNgoaiNgu',
              'urlChungChiQuocTe',
              'urlGiayXacNhanDanhGiaNangLuc',
            ];
            for (const item of arrFieldNameUpload) {
              if (values[item]?.fileList) {
                const checkSize = checkFileSize(values[item]?.fileList ?? []);
                if (!checkSize) return;
                values[item] = await uploadMultiFile(values[item]?.fileList ?? []);
              }
            }
            values.thongTinHocTapTHPT.truongLop10 = {
              ...values?.thongTinHocTapTHPT?.truongLop10,
              tenTruong: tenTruong10,
              truongChuyen: isTruongChuyenLop10,
              khuVucUuTienTuyenSinh: khuVucUuTienLop10,
            };
            values.thongTinHocTapTHPT.truongLop11 = {
              ...values?.thongTinHocTapTHPT?.truongLop11,
              tenTruong: tenTruong11,
              truongChuyen: isTruongChuyenLop11,
              khuVucUuTienTuyenSinh: khuVucUuTienLop11,
            };
            values.thongTinHocTapTHPT.truongLop12 = {
              ...values?.thongTinHocTapTHPT?.truongLop12,
              tenTruong: tenTruong12,
              truongChuyen: isTruongChuyenLop12,
              khuVucUuTienTuyenSinh: khuVucUuTienLop12,
            };
            if (!isChuyenTruong) {
              //ko chuyen truong cap 3
              values.thongTinHocTapTHPT.truongLop11 = {
                ...values?.thongTinHocTapTHPT?.truongLop10,
                ...values?.thongTinHocTapTHPT?.truongLop11,
                tenTruong: tenTruong10,
                truongChuyen: isTruongChuyenLop10,
                khuVucUuTienTuyenSinh: khuVucUuTienLop10,
              };
              values.thongTinHocTapTHPT.truongLop12 = {
                ...values?.thongTinHocTapTHPT?.truongLop10,
                ...values?.thongTinHocTapTHPT?.truongLop12,
                tenTruong: tenTruong10,
                truongChuyen: isTruongChuyenLop10,
                khuVucUuTienTuyenSinh: khuVucUuTienLop10,
              };
            }

            const { truongChuyen, monChuyen } = calculateChuyen(values?.thongTinHocTapTHPT);
            const valueFinal: any = {
              toHopMongMuon: values?.toHopMongMuon ?? [],
              thongTinHocTapTHPT: {
                ...values?.thongTinHocTapTHPT,
                truongChuyen,
                monChuyen,
                urlHocBa: values?.urlHocBa ?? [],
                urlChungNhanDoiTuongUuTien: values?.urlChungNhanDoiTuongUuTien ?? [],
              },
              thongTinGiaiQuocGia: {
                ...values?.thongTinGiaiQuocGia,
                urlBangKhenHSGQG: values?.urlBangKhenHSGQG ?? [],
                suDungGiaiHGSQG: isSuDungGiaiQuocGia,
              },
              thongTinGiaiTinhTP: {
                ...values?.thongTinGiaiTinhTP,
                urlBangKhenHSGTinhTP: values?.urlBangKhenHSGTinhTP ?? [],
                suDungGiaiHGSTinhTP: isSuDungGiaiTinhTP,
              },
              thongTinChungChiNgoaiNgu: {
                ...values?.thongTinChungChiNgoaiNgu,
                urlChungChiNgoaiNgu: values?.urlChungChiNgoaiNgu ?? [],
                suDungChungChiNgoaiNgu,
              },
              thongTinChungChiQuocTe: {
                ...values?.thongTinChungChiQuocTe,
                urlChungChiQuocTe: values?.urlChungChiQuocTe ?? [],
                suDungChungChiQuocTe,
              },
              thongTinKetQuaDanhGiaNangLuc: {
                ...values?.thongTinKetQuaDanhGiaNangLuc,
                suDungDanhGiaNangLuc,
                urlGiayXacNhanDanhGiaNangLuc: values?.urlGiayXacNhanDanhGiaNangLuc ?? [],
              },
              maDoiTuong: values?.maDoiTuong,
              urlBangKhenHSGQG: undefined,
            };
            if (values?.thongTinChungChiQuocTe?.loaiChungChiQuocTe) {
              valueFinal.thongTinChungChiQuocTe.suDungChungChiQuocTe = true;
            }

            putMyThongTinXetTuyenModel(recordHoSo?._id ?? '', valueFinal);
          }}
        >
          <Row gutter={[10, 0]}>
            <InfoTruongTHPT
              setIsChuyenTruong={setIsChuyenTruong}
              isChuyenTruong={isChuyenTruong}
              form={form}
            />
            <Col xs={24} lg={8}>
              <FormItem
                rules={[...rules.required]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name={['thongTinHocTapTHPT', 'doiTuongUuTienTuyenSinh']}
                initialValue={recordHoSo?.thongTinHocTapTHPT?.doiTuongUuTienTuyenSinh}
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
                <Select showSearch placeholder="Chọn đối tượng" allowClear>
                  {doiTuongUuTienTuyenSinh.map((val) => (
                    <Select.Option key={val} value={val}>
                      {val}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} lg={8}>
              <FormItem
                name={['thongTinHocTapTHPT', 'khuVucUuTienTuyenSinh']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValue={recordHoSo?.thongTinHocTapTHPT?.khuVucUuTienTuyenSinh}
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
                  {Object.keys(EKhuVucUuTien).map((item) => (
                    <Select.Option key={item} value={EKhuVucUuTien[item]}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} lg={8}>
              <FormItem
                rules={[...rules.required]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label="Năm tốt nghiệp"
                initialValue={recordHoSo?.thongTinHocTapTHPT?.namTotNghiep || record?.namTuyenSinh}
                name={['thongTinHocTapTHPT', 'namTotNghiep']}
                style={{ width: '100%', marginBottom: '0' }}
              >
                <InputNumber
                  onChange={(val) => {
                    setNamTotNghiep(val);
                  }}
                  style={{ width: '100%' }}
                  placeholder="Năm tốt nghiệp"
                  max={new Date().getFullYear()}
                  min={2010}
                />
              </FormItem>
            </Col>
            <Divider />
            <Col xs={24} lg={24}>
              <FormItem
                rules={[...rules.required]}
                initialValue={recordHoSo?.maDoiTuong}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="maDoiTuong"
                label={
                  <b>
                    Đối tượng xét tuyển
                    <Tooltip placement="bottom" title="Chi tiết">
                      <QuestionCircleOutlined
                        style={{ marginLeft: '5px' }}
                        onClick={() => {
                          setTypeInfo('doituongxettuyen');
                          setVisibleModalInfo(true);
                        }}
                      />
                    </Tooltip>
                  </b>
                }
                style={{ width: '100%', marginBottom: '0' }}
              >
                <Select
                  onChange={(val) => setDoiTuongXetTuyen(val)}
                  showSearch
                  placeholder="Chọn đối tượng"
                  allowClear
                >
                  {record?.danhSachDoiTuongTuyenSinh.map((item) => (
                    <Select.Option key={item?.maDoiTuong} value={item?.maDoiTuong}>
                      {item?.thongTinDoiTuong?.tenDoiTuong}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            {doiTuongXetTuyen !== 'CQ_PTIT_DGNL1' && (
              <BlockKetQuaHocTapTHPT
                arrLopHoc={[
                  { label: 'lớp 10', name: ['thongTinHocTapTHPT', 'truongLop10', 'kqhtCaNam'] },
                  { label: 'lớp 11', name: ['thongTinHocTapTHPT', 'truongLop11', 'kqhtCaNam'] },
                  {
                    label: namTotNghiep === new Date().getFullYear() ? 'học kỳ I lớp 12' : 'lớp 12',
                    name: ['thongTinHocTapTHPT', 'truongLop12', 'kqhtCaNam'],
                  },
                ]}
                haveSelectToHop={false}
                toHop={['A00', 'A01', 'D01']}
              />
            )}

            {doiTuongXetTuyen !== 'CQ_PTIT_DGNL1' && (
              <BlockHanhKiem
                arrHanhKiem={[
                  { label: 'Lớp 10', name: ['thongTinHocTapTHPT', 'truongLop10', 'hanhKiem'] },
                  {
                    label: 'Lớp 11',
                    name: ['thongTinHocTapTHPT', 'truongLop11', 'hanhKiem'],
                  },
                  {
                    label: namTotNghiep === new Date().getFullYear() ? 'Học kỳ I lớp 12' : 'Lớp 12',
                    name: ['thongTinHocTapTHPT', 'truongLop12', 'hanhKiem'],
                  },
                ]}
              />
            )}

            <Divider plain>
              <b>File minh chứng</b>
            </Divider>
            <Col xs={24} lg={12}>
              <FormItem
                initialValue={renderFileList(recordHoSo?.thongTinHocTapTHPT?.urlHocBa ?? [])}
                rules={[...rules.fileRequired]}
                name="urlHocBa"
                label={<b>Phiếu điểm hoặc học bạ</b>}
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
                initialValue={renderFileList(
                  recordHoSo?.thongTinHocTapTHPT?.urlChungNhanDoiTuongUuTien ?? [],
                )}
                label={<b>Giấy tờ đối tượng ưu tiên</b>}
                name="urlChungNhanDoiTuongUuTien"
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

            {doiTuongXetTuyen === 'CQ_PTIT_KH1' && (
              <>
                <Divider plain>
                  <b>Thông tin về chứng chỉ quốc tế</b>
                </Divider>
                <BlockChungChiQuocTe form={form} />
              </>
            )}

            {doiTuongXetTuyen === 'CQ_PTIT_KH2' && (
              <>
                <Divider plain>
                  <b>Thông tin về chứng chỉ ngoại ngữ</b>
                </Divider>
                <BlockChungChiNgoaiNgu form={form} />
              </>
            )}

            {doiTuongXetTuyen === 'CQ_PTIT_KH3' && (
              <>
                <Divider plain>
                  <b>Thông tin về giải HSG cấp Tỉnh/quốc gia</b>
                </Divider>
                <Col xs={24} md={8} lg={6} sm={12}>
                  <FormItem
                    initialValue={typeHSG}
                    rules={[...rules.required]}
                    label="Giải HSG cấp"
                    name={'loaiGiaiHSG'}
                  >
                    <Select
                      onChange={(val) => setTypeHSG(val)}
                      style={{ width: '100%' }}
                      placeholder="Chọn cấp"
                      options={[
                        { value: 'thongTinGiaiQuocGia||QG', label: 'Quốc gia' },
                        { value: 'thongTinGiaiTinhTP||TinhTP', label: 'Tỉnh/thành phố' },
                      ]}
                    />
                  </FormItem>
                </Col>
                <BlockGiaiHSG
                  fieldName={typeHSG?.split('||')?.[0] ?? ''}
                  type={typeHSG?.split('||')?.[1] ?? ''}
                />
              </>
            )}
            {doiTuongXetTuyen === 'CQ_PTIT_DGNL1' && (
              <>
                <Divider plain>
                  <b>Thông tin thi đánh giá năng lực</b>
                </Divider>
                <BlockDanhGiaNangLuc />
              </>
            )}
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

export default QuaTrinhHocTap;
