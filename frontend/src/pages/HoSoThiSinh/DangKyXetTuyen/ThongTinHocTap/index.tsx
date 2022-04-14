import { FormItem } from '@/components/FormItem';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import {
  arrKhuVucUuTien,
  doiTuongUuTienTuyenSinh,
  EKhuVucUuTien,
  ELoaiGiaiHSG,
  ELoaiNgoaiNgu,
  MapKeyGiaiHSG,
  MapKeyNgonNgu,
  Setting,
} from '@/utils/constants';
import rules from '@/utils/rules';
import {
  calculateChuyen,
  calculateKhuVuc,
  checkFileSize,
  mergeCauHinhDoiTuongXetTuyen,
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
import BlockNguyenVong from '../RaSoatHoSo/components/BlockNguyenVong';
import BlockChungChiQuocTe from './components/BlockChungChiQuocTe';
import BlockChungChiTiengAnh from './components/BlockChungChiTiengAnh';
import BlockChungChiTiengPhap from './components/BlockChungChiTiengPhap';
import BlockDanhGiaNangLuc from './components/BlockDanhGiaNangLuc';
import BlockGiaiHSG from './components/BlockGiaiHSG';
import BlockHanhKiem from './components/BlockHanhKiem';
import BlockTableDiemTHPT from './components/BlockTableDiemTHPT';
import InfoDoiTuongKhuVuc from './components/InfoDoiTuongKhuVuc';
import InfoTruongTHPT from './components/InfoTruongTHPT';
import TableGiayTo from './components/TableGiayTo';
import _ from 'lodash';

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
    loading,
    setLoading,
  } = useModel('hosoxettuyen');

  const { record } = useModel('dottuyensinh');
  const [form] = Form.useForm();
  const { tenTruong10, tenTruong11, tenTruong12, setTenTruong10, setTenTruong11, setTenTruong12 } =
    useModel('truongthpt');

  const [cauHinhDoiTuong, setCauHinhDoiTuong] = useState<any>();

  const [visibleModalInfo, setVisibleModalInfo] = useState<boolean>(false);
  const [visibleXoaNguyenVong, setVisibleXoaNguyenVong] = useState<boolean>(false);
  const [typeInfo, setTypeInfo] = useState<'doituonguutien' | 'khuvucuutien' | 'doituongxettuyen'>(
    'doituonguutien',
  );
  const [isChuyenTruong, setIsChuyenTruong] = useState<boolean>(false);

  const [typeHSG, setTypeHSG] = useState<string | string[] | undefined>(recordHoSo?.giaiHSG);
  const [danhSachMaPhuongThuc, setDanhSachMaPhuongThuc] = useState<string[]>(
    _.uniqBy(
      record?.danhSachDoiTuongTuyenSinh?.filter((item) =>
        recordHoSo?.maDoiTuong?.includes(item?.maDoiTuong ?? ''),
      ),
      'phuongThucTuyenSinh',
    )?.map((item) => item?.phuongThucTuyenSinh) ?? [],
  );
  const [ngonNgu, setNgonNgu] = useState<string | string[] | undefined>(recordHoSo?.ngonNgu);
  const [danhSachNguyenVongBiXoa, setDanhSachNguyenVongBiXoa] = useState<HoSoXetTuyen.NguyenVong[]>(
    [],
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
    if (recordHoSo && record?._id) {
      const cauHinh = mergeCauHinhDoiTuongXetTuyen(recordHoSo?.maDoiTuong ?? [], record);
      setCauHinhDoiTuong(cauHinh);
    }
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

  const [namTotNghiep, setNamTotNghiep] = useState<number | undefined>(
    recordHoSo?.thongTinHocTapTHPT?.namTotNghiep || record?.namTuyenSinh,
  );

  const onCancelModalInfo = () => {
    setVisibleModalInfo(false);
  };

  const handlePutThongTinXetTuyen = async (values: any) => {
    setLoading(true);
    const arrFieldNameUpload = [
      'urlBangKhenHSGQG',
      'urlBangKhenHSGTinhTP',
      'urlChungChiTiengAnh',
      'urlChungChiTiengPhap',
      'urlChungChiQuocTe',
      'urlGiayXacNhanDanhGiaNangLuc',
    ];

    for (const item of arrFieldNameUpload) {
      if (values[item]?.fileList) {
        const checkSize = checkFileSize(values[item]?.fileList ?? []);
        if (!checkSize) {
          setLoading(false);
          return;
        }
        values[item] = await uploadMultiFile(values[item]?.fileList ?? []);
      }
    }
    let index = 0;
    for (const item of values?.thongTinGiayToNopOnline ?? []) {
      if (item?.fileList) {
        const checkSize = checkFileSize(item?.fileList ?? []);
        if (!checkSize) {
          setLoading(false);
          return;
        }
        const urlGiayToNop = await uploadMultiFile(item?.fileList ?? []);
        values.thongTinGiayToNopOnline[index] = {
          ...record?.thongTinGiayToNopOnline?.[index],
          urlGiayToNop,
        };
      }
      index += 1;
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
      const thongTinTruongTHPT = {
        maQuanHuyen: values?.thongTinHocTapTHPT?.truongLop10?.maQuanHuyen,
        maTinh: values?.thongTinHocTapTHPT?.truongLop10?.maTinh,
        maTruong: values?.thongTinHocTapTHPT?.truongLop10?.maTruong,
      };
      values.thongTinHocTapTHPT.truongLop11 = {
        ...thongTinTruongTHPT,
        ...values?.thongTinHocTapTHPT?.truongLop11,
        tenTruong: tenTruong10,
        truongChuyen: isTruongChuyenLop10,
        khuVucUuTienTuyenSinh: khuVucUuTienLop10,
      };
      values.thongTinHocTapTHPT.truongLop12 = {
        ...thongTinTruongTHPT,
        ...values?.thongTinHocTapTHPT?.truongLop12,
        tenTruong: tenTruong10,
        truongChuyen: isTruongChuyenLop10,
        khuVucUuTienTuyenSinh: khuVucUuTienLop10,
      };
    }
    const { truongChuyen, monChuyen } = calculateChuyen(values?.thongTinHocTapTHPT);
    const valueFinal: any = {
      thongTinGiayToNopOnline: values?.thongTinGiayToNopOnline ?? [],
      ngonNgu: values?.ngonNgu,
      giaiHSG: values?.giaiHSG,
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
        suDungGiaiHGSQG: values?.thongTinGiaiQuocGia ? true : false,
      },

      thongTinGiaiTinhTP: {
        ...values?.thongTinGiaiTinhTP,
        urlBangKhenHSGTinhTP: values?.urlBangKhenHSGTinhTP ?? [],
        suDungGiaiHGSTinhTP: values?.thongTinGiaiTinhTP ? true : false,
      },

      thongTinChungChiTiengAnh: values?.thongTinChungChiTiengAnh?.loai
        ? {
            ...values?.thongTinChungChiTiengAnh,
            urlChungChi: values?.urlChungChiTiengAnh ?? [],
          }
        : undefined,
      thongTinChungChiTiengPhap: values?.thongTinChungChiTiengPhap?.loai
        ? {
            ...values?.thongTinChungChiTiengPhap,
            urlChungChi: values?.urlChungChiTiengPhap ?? [],
          }
        : undefined,
      thongTinChungChiQuocTe: {
        ...values?.thongTinChungChiQuocTe,
        urlChungChiQuocTe: values?.urlChungChiQuocTe ?? [],
        suDungChungChiQuocTe: values?.thongTinChungChiQuocTe ? true : false,
      },
      thongTinKetQuaDanhGiaNangLuc: {
        ...values?.thongTinKetQuaDanhGiaNangLuc,
        suDungDanhGiaNangLuc: values?.thongTinKetQuaDanhGiaNangLuc ? true : false,
        urlGiayXacNhanDanhGiaNangLuc: values?.urlGiayXacNhanDanhGiaNangLuc ?? [],
      },
      maDoiTuong: record?.gioiHanDoiTuong ? [values?.maDoiTuong] : values?.maDoiTuong,
      urlBangKhenHSGQG: undefined,
    };
    putMyThongTinXetTuyenModel(recordHoSo?._id ?? '', valueFinal);
  };

  return (
    <>
      <Card bodyStyle={{ paddingTop: 0 }} bordered>
        <Form
          scrollToFirstError
          labelCol={{ span: 24 }}
          form={form}
          onFinish={async (values) => {
            const danhSachNguyenVongBiXoaTemp: HoSoXetTuyen.NguyenVong[] =
              recordHoSo?.danhSachNguyenVong?.filter(
                (item) => !values?.maDoiTuong?.includes(item?.maDoiTuong ?? ''),
              ) ?? [];

            if (danhSachNguyenVongBiXoaTemp?.length) {
              setDanhSachNguyenVongBiXoa(danhSachNguyenVongBiXoaTemp);
              setVisibleXoaNguyenVong(true);
              return;
            }

            handlePutThongTinXetTuyen(values);
          }}
        >
          <Row gutter={[10, 0]}>
            <InfoTruongTHPT
              cauHinh={cauHinhDoiTuong}
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
                  onChange={(val) => setNamTotNghiep(val)}
                  style={{ width: '100%' }}
                  placeholder="Năm tốt nghiệp"
                  max={new Date().getFullYear()}
                  min={2010}
                />
              </FormItem>
            </Col>
            <Divider />
            <Col xs={24} lg={12}>
              <FormItem
                rules={[...rules.required]}
                initialValue={danhSachMaPhuongThuc}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="maPhuongThuc"
                label={
                  <b>
                    Phương thức xét tuyển
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
                  mode={record?.gioiHanDoiTuong ? undefined : 'multiple'}
                  onChange={(val) => {
                    setDanhSachMaPhuongThuc(typeof val === 'string' ? [val] : val);
                    form.setFieldsValue({
                      maDoiTuong: undefined,
                    });
                  }}
                  showSearch
                  placeholder="Chọn phương thức"
                  allowClear
                >
                  {record?.danhSachPhuongThucTuyenSinh.map((item) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenPhuongThuc}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} lg={12}>
              <FormItem
                extra={
                  record?.gioiHanDoiTuong ? undefined : (
                    <div style={{ color: 'red' }}>
                      Lưu ý: Thí sinh có thể chọn nhiều phương thức và đối tượng xét tuyển khác nhau
                    </div>
                  )
                }
                rules={[...rules.required]}
                initialValue={
                  record?.gioiHanDoiTuong ? recordHoSo?.maDoiTuong?.[0] : recordHoSo?.maDoiTuong
                }
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
                  mode={record?.gioiHanDoiTuong ? undefined : 'multiple'}
                  onChange={(val) => {
                    if (!record?._id) return;
                    let cauHinh: any = {};
                    if (typeof val === 'string') {
                      cauHinh = record?.danhSachDoiTuongTuyenSinh?.find(
                        (item) => item?.maDoiTuong === val,
                      )?.cauHinhDoiTuong;
                    } else if (typeof val === 'object') {
                      cauHinh = mergeCauHinhDoiTuongXetTuyen(val, record);
                    }
                    setCauHinhDoiTuong(cauHinh);
                    if (cauHinh?.danhSach?.thongTinChungChiNgoaiNgu) {
                      // neu chi co 1 ngon ngu thi ko hien ra select chon ngon ngu nua, tu dong chon luon
                      const arrNgonNguChungChiNgoaiNgu = Object.keys(
                        cauHinh?.danhSach?.thongTinChungChiNgoaiNgu ?? {},
                      );

                      if (arrNgonNguChungChiNgoaiNgu?.length === 1) {
                        setNgonNgu(MapKeyNgonNgu[arrNgonNguChungChiNgoaiNgu[0]]);
                        form.setFieldsValue({
                          ngonNgu: MapKeyNgonNgu[arrNgonNguChungChiNgoaiNgu[0]],
                        });
                      }
                    }
                    if (cauHinh?.danhSach?.thongTinGiaiHSG) {
                      // neu chi co 1 cap HSG thi ko hien ra select chon cap nua, tu dong chon luon
                      const arrCapHSG = Object.keys(cauHinh?.danhSach?.thongTinGiaiHSG ?? {});

                      if (arrCapHSG?.length === 1) {
                        setTypeHSG(MapKeyGiaiHSG[arrCapHSG[0]]);
                        form.setFieldsValue({
                          giaiHSG: MapKeyNgonNgu[MapKeyGiaiHSG[arrCapHSG[0]]],
                        });
                      }
                    }
                  }}
                  showSearch
                  placeholder="Chọn đối tượng"
                  allowClear
                >
                  {record?.danhSachDoiTuongTuyenSinh
                    ?.filter((item) =>
                      danhSachMaPhuongThuc?.includes(item?.phuongThucTuyenSinh ?? ''),
                    )
                    .map((item) => (
                      <Select.Option key={item?.maDoiTuong} value={item?.maDoiTuong}>
                        {item?.thongTinDoiTuong?.tenDoiTuong}
                      </Select.Option>
                    ))}
                </Select>
              </FormItem>
            </Col>

            {cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT && (
              <>
                {/* <BlockKetQuaHocTapTHPT
                  cauHinh={cauHinhDoiTuong}
                  arrLopHoc={[
                    {
                      label: 'lớp 10',
                      name: ['thongTinHocTapTHPT', 'truongLop10'],
                      field: 'truongLop10',
                      show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.truongLop10
                        ? true
                        : false,
                    },
                    {
                      label: 'lớp 11',
                      name: ['thongTinHocTapTHPT', 'truongLop11'],
                      field: 'truongLop11',
                      show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.truongLop11
                        ? true
                        : false,
                    },
                    {
                      label: 'lớp 12',
                      name: ['thongTinHocTapTHPT', 'truongLop12'],
                      field: 'truongLop12',
                      show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.truongLop12
                        ? true
                        : false,
                    },
                  ]}
                  arrKyHoc={[
                    { label: 'Học kỳ 1', name: 'kqhtHK1' },
                    { label: 'Học kỳ 2', name: 'kqhtHK2' },
                    {
                      label: 'Cả năm',
                      name: 'kqhtCaNam',
                    },
                  ]}
                  haveSelectToHop={record?.suDungToHopMongMuon ?? false}
                  toHop={
                    record?.suDungToHopMongMuon
                      ? recordHoSo?.toHopMongMuon ?? []
                      : record?.danhSachToHopLuaChon ?? []
                  }
                /> */}
                <>
                  <Divider plain>
                    <b>Kết quả học tập THPT</b>
                  </Divider>
                  <BlockTableDiemTHPT
                    namTotNghiep={namTotNghiep}
                    form={form}
                    haveSelectToHop={record?.suDungToHopMongMuon ?? false}
                    cauHinh={cauHinhDoiTuong}
                    arrLopHoc={[
                      {
                        label: 'Lớp 10',
                        name: ['thongTinHocTapTHPT', 'danhSach', 'truongLop10'],
                        field: 'truongLop10',
                        show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop10,
                      },
                      {
                        label: 'Lớp 11',
                        name: ['thongTinHocTapTHPT', 'danhSach', 'truongLop11'],
                        field: 'truongLop11',
                        show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop11,
                      },
                      {
                        label: 'Lớp 12',
                        name: ['thongTinHocTapTHPT', 'danhSach', 'truongLop12'],
                        field: 'truongLop12',
                        show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop12,
                      },
                    ]}
                    arrKyHoc={[
                      { label: 'Học kỳ 1', name: 'kqhtHK1' },
                      { label: 'Học kỳ 2', name: 'kqhtHK2' },
                      {
                        label: 'Cả năm',
                        name: 'kqhtCaNam',
                      },
                    ]}
                    toHop={
                      record?.suDungToHopMongMuon
                        ? recordHoSo?.toHopMongMuon ?? []
                        : record?.danhSachToHopLuaChon ?? []
                    }
                  />
                </>
              </>
            )}

            <BlockHanhKiem
              arrHanhKiem={[
                {
                  label: 'Lớp 10',
                  name: ['thongTinHocTapTHPT', 'truongLop10', 'hanhKiem'],
                  show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop10
                    ?.hanhKiem,
                  required:
                    cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop10?.hanhKiem
                      ?.required,
                },
                {
                  label: 'Lớp 11',
                  name: ['thongTinHocTapTHPT', 'truongLop11', 'hanhKiem'],
                  show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop11
                    ?.hanhKiem,
                  required:
                    cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop11?.hanhKiem
                      ?.required,
                },
                {
                  label: record?.choPhepHK1HoacCaNamLop12 ? 'Học kỳ I lớp 12' : 'Lớp 12',
                  name: ['thongTinHocTapTHPT', 'truongLop12', 'hanhKiem'],
                  show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop12
                    ?.hanhKiem,
                  required:
                    cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop12?.hanhKiem
                      ?.required,
                },
              ]}
            />

            {cauHinhDoiTuong?.danhSach?.thongTinChungChiQuocTe && (
              <>
                <Divider plain>
                  <b>Thông tin về chứng chỉ quốc tế</b>
                </Divider>
                <BlockChungChiQuocTe
                  cauHinh={cauHinhDoiTuong?.danhSach?.thongTinChungChiQuocTe}
                  form={form}
                />
              </>
            )}

            {cauHinhDoiTuong?.danhSach?.thongTinChungChiNgoaiNgu && (
              <>
                <Divider plain>
                  <b>Thông tin về chứng chỉ ngoại ngữ</b>
                </Divider>

                <Col xs={24} md={8} lg={6} sm={12}>
                  <Form.Item
                    initialValue={recordHoSo?.ngonNgu}
                    label="Ngôn ngữ"
                    name="ngonNgu"
                    rules={[...rules.required]}
                  >
                    <Select
                      onChange={(val) => setNgonNgu(val)}
                      mode={
                        cauHinhDoiTuong?.cauHinh?.selectModeChungChiNgoaiNgu === 'MULTIPLE'
                          ? 'multiple'
                          : undefined
                      }
                      placeholder="Chọn ngôn ngữ"
                      options={Object.keys(
                        cauHinhDoiTuong?.danhSach?.thongTinChungChiNgoaiNgu ?? {},
                      )?.map((item) => ({
                        label: MapKeyNgonNgu[item],
                        value: MapKeyNgonNgu[item],
                      }))}
                    />
                  </Form.Item>
                </Col>

                {String(ngonNgu)?.includes(ELoaiNgoaiNgu.ANH) && (
                  <>
                    {cauHinhDoiTuong?.cauHinh?.selectModeChungChiNgoaiNgu === 'MULTIPLE' ? (
                      <>
                        {' '}
                        <Divider plain>
                          <b>Chứng chỉ tiếng Anh</b>
                        </Divider>
                        <Col span={24}>
                          <Row gutter={[10, 0]}>
                            <BlockChungChiTiengAnh cauHinh={cauHinhDoiTuong} form={form} />
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <BlockChungChiTiengAnh cauHinh={cauHinhDoiTuong} form={form} />
                    )}
                  </>
                )}
                {String(ngonNgu)?.includes(ELoaiNgoaiNgu.PHAP) && (
                  <>
                    <Divider plain>
                      <b>Chứng chỉ tiếng Pháp</b>
                    </Divider>
                    <Col span={24}>
                      <Row gutter={[10, 0]}>
                        <BlockChungChiTiengPhap cauHinh={cauHinhDoiTuong} form={form} />{' '}
                      </Row>
                    </Col>
                  </>
                )}
              </>
            )}

            {cauHinhDoiTuong?.danhSach?.thongTinGiaiHSG && (
              <>
                <Divider plain>
                  <b>Thông tin về giải HSG</b>
                </Divider>
                <Col xs={24} md={8} lg={6} sm={12}>
                  <FormItem
                    initialValue={recordHoSo?.giaiHSG}
                    rules={[...rules.required]}
                    label="Giải HSG cấp"
                    name={'giaiHSG'}
                  >
                    <Select
                      onChange={(val) => setTypeHSG(val)}
                      mode={
                        cauHinhDoiTuong?.cauHinh?.selectModeGiaiHSG === 'MULTIPLE'
                          ? 'multiple'
                          : undefined
                      }
                      style={{ width: '100%' }}
                      placeholder="Chọn cấp"
                      options={Object.keys(cauHinhDoiTuong?.danhSach?.thongTinGiaiHSG ?? {})?.map(
                        (item) => ({
                          label: MapKeyGiaiHSG[item],
                          value: MapKeyGiaiHSG[item],
                        }),
                      )}
                    />
                  </FormItem>
                </Col>

                {String(typeHSG)?.includes(ELoaiGiaiHSG.QUOC_GIA) && (
                  <>
                    {cauHinhDoiTuong?.cauHinh?.selectModeGiaiHSG === 'MULTIPLE' ? (
                      <>
                        <Divider plain>
                          <b>Giải HSG Quốc gia</b>
                        </Divider>
                        <Col span={24}>
                          <Row gutter={[10, 0]}>
                            <BlockGiaiHSG
                              cauHinh={cauHinhDoiTuong}
                              fieldName={'thongTinGiaiQuocGia'}
                              type={'QG'}
                            />
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <BlockGiaiHSG
                        cauHinh={cauHinhDoiTuong}
                        fieldName={'thongTinGiaiQuocGia'}
                        type={'QG'}
                      />
                    )}
                  </>
                )}
                {String(typeHSG)?.includes(ELoaiGiaiHSG.TINH_TP) && (
                  <>
                    {cauHinhDoiTuong?.cauHinh?.selectModeGiaiHSG === 'MULTIPLE' ? (
                      <>
                        {' '}
                        <Divider plain>
                          <b>Giải HSG Tỉnh/TP</b>
                        </Divider>
                        <Col span={24}>
                          <Row gutter={[10, 0]}>
                            <BlockGiaiHSG
                              cauHinh={cauHinhDoiTuong}
                              fieldName={'thongTinGiaiTinhTP'}
                              type={'TinhTP'}
                            />
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <BlockGiaiHSG
                        cauHinh={cauHinhDoiTuong}
                        fieldName={'thongTinGiaiTinhTP'}
                        type={'TinhTP'}
                      />
                    )}
                  </>
                )}
              </>
            )}
            {cauHinhDoiTuong?.danhSach?.thongTinKetQuaDanhGiaNangLuc && (
              <>
                <Divider plain>
                  <b>Thông tin thi đánh giá năng lực</b>
                </Divider>
                <BlockDanhGiaNangLuc cauHinh={cauHinhDoiTuong} />
              </>
            )}
            <Col />
            <Divider plain>
              <b>Giấy tờ cần nộp</b>
            </Divider>
            <Col span={24}>
              <TableGiayTo fieldName="thongTinGiayToNopOnline" />
            </Col>
          </Row>
          <br />
          <b style={{ color: Setting.primaryColor }}>Lưu ý:</b>
          <ul style={{ paddingLeft: 0 }}>
            <li>
              <b style={{ color: Setting.primaryColor }}>
                - Tổng dung lượng tập tin tải lên không quá 20MB!
              </b>
            </li>
            {/* <li>
              <b style={{ color: Setting.primaryColor }}>
                - Nếu bạn thay đổi thông tin ở bước 2 thì tất cả nguyện vọng ở bước 3 sẽ bị xóa
              </b>
            </li> */}
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
      <Modal
        destroyOnClose
        width={1100}
        visible={visibleXoaNguyenVong}
        onCancel={() => {
          setVisibleXoaNguyenVong(false);
        }}
        footer={
          <>
            <Button
              loading={loading}
              onClick={async () => {
                const values = await form.validateFields();
                handlePutThongTinXetTuyen(values);
              }}
              type="primary"
            >
              Lưu
            </Button>
            <Button
              onClick={() => {
                setVisibleXoaNguyenVong(false);
              }}
            >
              Đóng
            </Button>
          </>
        }
      >
        <div>
          <b>Lưu ý:</b> Hệ thống sẽ xóa các nguyện vọng không hợp lệ dưới đây do thí sinh đã thay
          đổi thông tin đối tượng xét tuyển, thí sinh có chắc chắn muốn lưu thông tin?
        </div>
        <BlockNguyenVong
          title="Danh sách nguyện vọng không hợp lệ"
          record={{
            danhSachNguyenVong: danhSachNguyenVongBiXoa,
          }}
        />
      </Modal>
    </>
  );
};

export default QuaTrinhHocTap;
