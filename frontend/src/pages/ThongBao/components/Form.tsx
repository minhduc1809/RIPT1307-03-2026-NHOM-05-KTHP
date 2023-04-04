/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import {
  checkFileSize,
  includes,
  renderFileList,
  renderFileListUrl,
  toRegex,
  uploadMultiFile,
} from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select, Modal } from 'antd';
import { useState } from 'react';
import { useModel, useAccess } from 'umi';
import _ from 'lodash';
import ImportExcel from '@/components/ImportExcel';
import { TitleFormImport } from '@/utils/constants';
import Upload from '@/components/Upload/UploadMultiFile';

const FormThongBaoAdmin = () => {
  const access = useAccess();
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, postThongBaoGeneralModel, edit, putThongBaoModel } =
    useModel('thongbao');
  const [nguoiNhan, setNguoiNhan] = useState<string>();
  const [phamVi, setPhamVi] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [ImportExcelType, setImportExcelType] = useState<string>('');
  const { danhSach: danhSachDonVi } = useModel('donvi');
  const {
    danhSach: danhSachLopHanhChinh,
    setCondition: setCondLopHanhChinh,
    danhSachHinhThucDaoTao,
  } = useModel('lophanhchinh');
  const { danhSach: danhSachNganh } = useModel('nganh');
  const { danhSachNguoiDungCuThe, setConditionNguoiDungCuThe, conditionNguoiDungCuThe } =
    useModel('user');
  const { danhSach: danhSachLopTinChi, setCondition } = useModel('loptinchi');
  const { danhSach: danhSachKhoaHoc } = useModel('khoahoc');
  const isNguoiDungCuThe = nguoiNhan?.includes('Người dùng cụ thể');
  const debouncedSearchLopTinChi = _.debounce((value) => {
    setCondition({ ten_lop_tin_chi: value });
  }, 800);

  const debouncedSearchLopHanhChinh = _.debounce((value) => {
    setCondLopHanhChinh({ ten_lop_hanh_chinh: value });
  }, 800);

  const debouncedSearchUser = _.debounce((value) => {
    setConditionNguoiDungCuThe({ ...conditionNguoiDungCuThe, code: toRegex(value) });
  }, 800);

  const handleData = (newData: any[]) => {
    const oldData = form.getFieldValue(ImportExcelType);
    const data = {};
    data[ImportExcelType] = _.union(
      oldData,
      newData
        ?.filter((item) => item?.[0] !== null && item?.[0] !== undefined)
        ?.map((item: any[]) =>
          typeof item?.[0] === 'string' ? item?.[0]?.trim() ?? '' : item?.[0],
        ),
    );

    form.setFieldsValue(data);
    setVisible(false);
  };

  const renderButtonImportExcel = (type: string) => (
    <Button
      onClick={() => {
        setVisible(true);
        setImportExcelType(type);
      }}
      type="primary"
      style={{ position: 'absolute', top: 0, right: 0 }}
    >
      Import Excel
    </Button>
  );

  return (
    <Card title={'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (isNguoiDungCuThe) {
            values.lopHanhChinhList = [];
            values.lopTinChiList = [];
            values.nganhList = [];
            values.donViList = [];
            values.khoaList = [];
            values.roles = [];
          }
          if (values.imageUrl.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.imageUrl.fileList?.[0].originFileObj,
            });
            values.imageUrl = response?.data?.data?.url;
          } else values.imageUrl = values.imageUrl.fileList?.[0]?.url;
          const checkSize = checkFileSize(values?.urlFile?.fileList ?? []);
          if (!checkSize) return;
          const urlFileDinhKem = await uploadMultiFile(values?.urlFile?.fileList);
          if (edit)
            putThongBaoModel(
              {
                ...values,
                urlFile: urlFileDinhKem,
                htmlContent: values?.htmlContent?.text,
              },
              record?._id,
            );
          else
            postThongBaoGeneralModel({
              ...values,
              htmlContent: values?.htmlContent?.text,
              urlFile: urlFileDinhKem,
              hinhThucDaoTaoId:
                values?.hinhThucDaoTaoId === -1 ? undefined : values?.hinhThucDaoTaoId,
            });
        }}
        form={form}
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          name="title"
          label="Tiêu đề"
          initialValue={record?.title}
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>
        {!edit && (
          <Row gutter={[8, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                style={{ marginBottom: 8 }}
                label="Người nhận"
                name="loaiDoiTuong"
                rules={[...rules.required]}
              >
                <Select
                  showSearch
                  onChange={(val: string) => {
                    if (val === 'Người dùng cụ thể') {
                      form.setFieldsValue({
                        lopHanhChinhList: [],
                        lopTinChiList: [],
                        nganhList: [],
                        khoaList: [],
                        roles: [],
                        donViList: [],
                      });
                    }
                    setNguoiNhan(val);
                  }}
                  placeholder="Người nhận"
                >
                  {[
                    'Tất cả',
                    // 'Vai trò',
                    'Lớp tín chỉ',
                    'Lớp hành chính',
                    'Ngành',
                    'Đơn vị',
                    'Khóa',
                    'Người dùng cụ thể',
                  ].map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                style={{ marginBottom: 8 }}
                // rules={[...rules.required]}
                name="roles"
                label={isNguoiDungCuThe ? 'Lọc theo vai trò' : 'Vai trò'}
                initialValue={record?.roles}
              >
                <Select
                  onChange={(val: string[]) => {
                    if (!isNguoiDungCuThe) return;
                    setConditionNguoiDungCuThe({
                      ...conditionNguoiDungCuThe,
                      vaiTroList: val?.length > 0 ? val : undefined,
                    });
                  }}
                  mode="multiple"
                  placeholder="Chọn vai trò"
                >
                  {[
                    { value: 'sinh_vien', name: 'Sinh viên' },
                    { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                  ].map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        {(access.admin || access.nhanVien) && !edit && (
          <>
            <Form.Item
              style={{ marginBottom: 8 }}
              rules={[...rules.required]}
              name="phamVi"
              label="Phạm vi"
            >
              <Select onChange={(val: string) => setPhamVi(val)} placeholder="Phạm vi">
                {['Tất cả', 'Hình thức đào tạo'].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {phamVi === 'Hình thức đào tạo' && (
              <Form.Item
                style={{ marginBottom: 8 }}
                rules={[...rules.required]}
                name="hinhThucDaoTaoId"
                label="Hình thức đào tạo"
              >
                <Select placeholder="Hình thức đào tạo">
                  {danhSachHinhThucDaoTao?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.ten_hinh_thuc_dao_tao}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </>
        )}

        {(nguoiNhan === 'Đơn vị' || isNguoiDungCuThe) && !edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            name="donViList"
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            label={isNguoiDungCuThe ? 'Lọc theo đơn vị' : 'Đơn vị'}
          >
            <Select
              maxTagCount={8}
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  donViIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
              showSearch
              filterOption={(value, option) => includes(option?.props.children, value)}
              mode="multiple"
              placeholder="Chọn đơn vị"
            >
              {danhSachDonVi.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_don_vi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {(nguoiNhan === 'Lớp hành chính' || isNguoiDungCuThe) && !edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="lopHanhChinhList"
            label={isNguoiDungCuThe ? 'Lọc theo lớp hành chính' : 'Lớp hành chính'}
          >
            <Select
              maxTagCount={8}
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  lopHanhChinhIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
              filterOption={(value, option) => includes(option?.props.children, value)}
              onSearch={(value) => {
                debouncedSearchLopHanhChinh(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Lớp hành chính"
            >
              {danhSachLopHanhChinh.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_lop_hanh_chinh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {(nguoiNhan === 'Lớp tín chỉ' || isNguoiDungCuThe) && !edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="lopTinChiList"
            label={isNguoiDungCuThe ? 'Lọc theo lớp tín chỉ' : 'Lớp tín chỉ'}
          >
            <Select
              maxTagCount={8}
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  lopTinChiIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
              filterOption={(value, option) => includes(option?.props.children, value)}
              onSearch={(value) => {
                debouncedSearchLopTinChi(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo tên lớp"
            >
              {danhSachLopTinChi.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_lop_tin_chi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {(nguoiNhan === 'Khóa' || isNguoiDungCuThe) && !edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="khoaList"
            label={isNguoiDungCuThe ? 'Lọc theo khóa' : 'Khóa'}
          >
            <Select
              maxTagCount={8}
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  khoaSinhVienIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn khóa"
            >
              {danhSachKhoaHoc?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.display_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {(nguoiNhan === 'Ngành' || isNguoiDungCuThe) && !edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            name="nganhList"
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            label={isNguoiDungCuThe ? 'Lọc theo ngành học' : 'Ngành học'}
          >
            <Select
              maxTagCount={8}
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  nganhIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Ngành học"
            >
              {danhSachNganh.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_nganh} ({item.ten_nganh_viet_tat})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {nguoiNhan === 'Người dùng cụ thể' && !edit && (
          <div style={{ position: 'relative' }}>
            <Form.Item
              style={{ marginBottom: 8, width: '100%' }}
              rules={[...rules.required]}
              name="userCodeList"
              label="Người dùng cụ thể"
            >
              <Select
                onSearch={(value) => {
                  debouncedSearchUser(value);
                }}
                showSearch
                allowClear
                mode="tags"
                placeholder="Tìm kiếm theo mã định danh"
                maxTagCount={8}
                // filterOption={(value, option) => includes(option?.props.children, value)}
              >
                {danhSachNguoiDungCuThe.map((item) => (
                  <Select.Option key={item?.code} value={item?.code}>
                    {item?.code} - {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {renderButtonImportExcel('userCodeList')}
          </div>
        )}

        <Form.Item
          style={{ marginBottom: 8 }}
          name="description"
          label="Mô tả"
          initialValue={record?.description}
          rules={[...rules.text, ...rules.length(500)]}
        >
          <Input.TextArea rows={2} placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Ảnh đại diện"
          initialValue={renderFileListUrl(record?.imageUrl ?? '')}
        >
          <UploadAvatar
            style={{
              width: 102,
              maxWidth: 102,
              height: 102,
              maxHeight: 102,
            }}
          />
        </Form.Item>

        <Form.Item
          name="htmlContent"
          rules={[...rules.textEditor]}
          label="Nội dung"
          initialValue={{ text: record?.htmlContent || '' }}
        >
          <TinyEditor height={350} />
        </Form.Item>
        <Form.Item
          extra={<div>Tối đa 5 file, dung lượng mỗi file không quá 25Mb.</div>}
          initialValue={renderFileList(record?.urlFile ?? [])}
          // rules={[...rules.fileName]}
          name="urlFile"
          label="File đính kèm"
        >
          <Upload
            otherProps={{
              maxCount: 5,
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
      <Modal
        footer={false}
        visible={visible}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisible(false);
        }}
        destroyOnClose
      >
        <ImportExcel
          handleData={handleData}
          title={`Import ${TitleFormImport?.[ImportExcelType] ?? ''}`}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </Card>
  );
};

export default FormThongBaoAdmin;
