import { LockOutlined, PrinterOutlined, RollbackOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, Table, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';

const RaSoatHoSo = () => {
  const titleCol: any = { fontWeight: 'bold', textAlign: 'left' };
  const contentCol: any = { textAlign: 'center' };
  const record: any = {
    thiSinh: {},
    trangThai: 'Chưa khóa',
  };

  const columnsNguyenVong: any = [
    {
      title: 'Thứ tự nguyện vọng',
      width: 120,
      dataIndex: 'soThuTu',
      align: 'center',
      key: 'soThuTu',
    },

    {
      title: 'Tên ngành xét tuyển',
      width: 200,
      align: 'center',
      dataIndex: 'tenNganh',
      key: 'sss',
    },
    {
      title: 'Tổ hợp xét tuyển',
      width: 100,
      dataIndex: 'toHopXetTuyen',
      align: 'center',
      key: 'toHopXT',
    },

    {
      title: 'Điểm 3 môn của tổ hợp',
      dataIndex: 'diemQuyDoi',
      align: 'center',
      render: (val: any) =>
        val?.thanhPhan?.map(
          (item, index) =>
            index < 3 && (
              <div>
                {item?.tenThanhPhan}: {item?.diem}
              </div>
            ),
        ),
      width: 120,
    },
    {
      title: 'Điểm ưu tiên',
      dataIndex: 'diemQuyDoi',
      align: 'center',
      render: (val: any) =>
        val?.thanhPhan?.map(
          (item, index) =>
            index > 2 && (
              <div>
                {item?.tenThanhPhan}: {item?.diem}
              </div>
            ),
        ),
    },
    {
      title: 'Điểm xét tuyển',
      dataIndex: 'diemQuyDoi.tongDiem',
      align: 'center',
      key: 'diemQuyDoi.tongDiem',
      width: 100,
    },
  ];

  return (
    <div style={{ maxWidth: 1000, padding: 24, margin: '0px auto' }}>
      <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>
        PHIẾU ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC CHÍNH QUY{' '}
        <span style={{ textTransform: 'uppercase' }}>Đợt 1</span> NĂM 2021
      </h3>
      <p style={{ fontWeight: 'bold', margin: '20px 0px 5px 0px' }}>I. THÔNG TIN CÁ NHÂN</p>
      <Row>
        <Col lg={12} xl={12}>
          <Row>
            {' '}
            {/* Họ và tên */}
            <Col lg={10} xl={8} style={titleCol}>
              1. Họ và tên:
            </Col>
            <Col lg={14} xl={16} style={contentCol}>
              <div style={{ textTransform: 'uppercase' }}>{record?.thiSinh?.hoTen ?? ''}</div>
            </Col>
          </Row>
          <Row>
            {' '}
            {/* Quốc tịch */}
            <Col lg={10} xl={8} style={titleCol}>
              4. Quốc tịch:
            </Col>
            <Col lg={14} xl={16} style={contentCol}>
              {record?.thiSinh?.quocTich ?? 'Việt Nam'}
            </Col>
          </Row>
          <Row>
            {' '}
            {/* Số cmt */}
            <Col lg={10} xl={8} style={titleCol}>
              7. CMT/CCCD:
            </Col>
            <Col lg={14} xl={16} style={contentCol}>
              {record?.thiSinh?.cmtCccd ?? ''}
            </Col>
          </Row>
          <Row>
            {' '}
            {/* Email */}
            <Col lg={10} xl={8} style={titleCol}>
              9. Email:
            </Col>
            <Col lg={14} xl={16} style={contentCol}>
              {record?.thiSinh?.email ?? ''}
            </Col>
          </Row>
        </Col>
        <Col lg={12} xl={12}>
          <Row>
            <Col span={12}>
              <Row>
                <Col lg={12} xl={10} style={titleCol}>
                  2. Giới tính:
                </Col>
                <Col lg={12} xl={14} style={contentCol}>
                  {record?.thiSinh?.gioiTinh === 0 ? 'Nam' : 'Nữ'}
                </Col>
              </Row>
              <Row>
                <Col lg={12} xl={10} style={titleCol}>
                  5. Dân tộc:
                </Col>
                <Col lg={12} xl={14} style={contentCol}>
                  {record?.thiSinh?.danToc ?? ''}
                </Col>
              </Row>
              <Row>
                <Col lg={12} xl={10} style={titleCol}>
                  8. Ngày cấp:
                </Col>
                <Col lg={12} xl={14} style={contentCol}>
                  {moment(record?.thiSinh?.ngayCapCmtCccd ?? new Date()).format('DD/MM/YYYY')}
                </Col>
              </Row>
              <Row>
                <Col lg={12} xl={10} style={titleCol}>
                  10. ĐTDĐ:
                </Col>
                <Col lg={12} xl={14} style={contentCol}>
                  {record?.thiSinh?.soDienThoai ?? ''}
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col lg={12} xl={10} style={titleCol}>
                  3. Ngày sinh:
                </Col>
                <Col lg={12} xl={14} style={contentCol}>
                  {/* {moment(_.get(record, 'ngaySinh', new Date())).format()} */}
                  {moment(record?.thiSinh?.ngaySinh ?? new Date()).format('DD/MM/YYYY')}
                </Col>
              </Row>
              <Row>
                <Col lg={12} xl={10} style={titleCol}>
                  6. Tôn giáo:
                </Col>
                <Col lg={12} xl={14} style={contentCol}>
                  {record?.thiSinh?.tonGiao ?? ''}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg={5} xl={4} style={titleCol}>
          11. Hộ khẩu thường trú:
        </Col>
        <Col lg={19} xl={20} style={contentCol}>
          {_.get(record?.thiSinh, 'hoKhauThuongTru.diaChi', '')}
          {_.get(record?.thiSinh, 'hoKhauThuongTru.diaChi', '') !== '' ? ' - ' : null}
          {_.get(record?.thiSinh, 'hoKhauThuongTru.tenXaPhuong', '')}
          {_.get(record?.thiSinh, 'hoKhauThuongTru.tenXaPhuong', '') !== '' ? ' - ' : null}
          {_.get(record?.thiSinh, 'hoKhauThuongTru.tenQH', '')}
          {_.get(record?.thiSinh, 'hoKhauThuongTru.tenQH', '') !== '' ? ' - ' : null}
          {_.get(record?.thiSinh, 'hoKhauThuongTru.tenTP', '')}
          {/* {_.get(record, 'hoKhauThuongTru.tenTP', '') !== '' ? ' - ' : null} */}
        </Col>
      </Row>
      <Row>
        <Col span={24} style={titleCol}>
          12. Địa chỉ gửi giấy báo trúng tuyển:
        </Col>
        <Col lg={12} xl={12}>
          Tên người nhận: {record?.thiSinh?.tenNguoiLienHe ?? ''}
        </Col>
        <Col lg={12} xl={12}>
          Điện thoại: {record?.thiSinh?.soDienThoaiNguoiLienHe ?? ''}
        </Col>
        <Row>
          Địa chỉ: {_.get(record?.thiSinh, 'diaChiLienHe.diaChi', '')}
          {_.get(record?.thiSinh, 'diaChiLienHe.diaChi', '') !== '' ? ' - ' : null}
          {_.get(record?.thiSinh, 'diaChiLienHe.tenXaPhuong', '')}
          {_.get(record?.thiSinh, 'diaChiLienHe.tenXaPhuong', '') !== '' ? ' - ' : null}
          {_.get(record?.thiSinh, 'diaChiLienHe.tenQH', '')}
          {_.get(record?.thiSinh, 'diaChiLienHe.tenQH', '') !== '' ? ' - ' : null}
          {_.get(record?.thiSinh, 'diaChiLienHe.tenTP', '')}
          {/* {_.get(record, 'hoKhauThuongTru.tenTP', '') !== '' ? ' - ' : null} */}
        </Row>
      </Row>

      <p style={{ fontWeight: 'bold', margin: '20px 0px 5px 0px' }}>
        III. THÔNG TIN ĐĂNG KÝ XÉT TUYỂN
      </p>
      <p style={{ margin: '5px 0px', fontWeight: 'bold' }}>
        1. Thông tin về trường THPT mà thí sinh theo học:
      </p>
      <p>
        <span style={{ fontWeight: 'bold' }}>Nơi học THPT lớp 12:</span>{' '}
        <Row>
          <Col span={12}>Mã tỉnh: {record?.truongLop12?.maTinh ?? ''}</Col>
          <Col span={12}>Mã trường: {record?.truongLop12?.maTruong ?? ''}</Col>
          <Col span={24}>Tên trường: {record?.truongLop12?.tenTruong ?? ''}</Col>
        </Row>
      </p>
      <Row>
        <Col xs={24} sm={12}>
          <p>
            <span style={{ fontWeight: 'bold' }}>Năm dự thi tốt nghiệp THQG:</span>{' '}
            {_.get(record, 'namTuyenSinh', '')}
          </p>
        </Col>
        <Col xs={24} sm={12}>
          <p>
            <span style={{ fontWeight: 'bold' }}>Thời gian tốt nghiệp:</span>{' '}
            {_.get(record, 'thoiGianTotNghiep', '')}
          </p>
        </Col>
      </Row>

      <p>
        <span style={{ fontWeight: 'bold' }}>File phiếu điểm hoặc học bạ:</span>{' '}
        {record?.urlHoSoHocBa && record?.urlHoSoHocBa?.length !== 0 && (
          <span>
            {record.urlHoSoHocBa.map((item, index) => (
              <a key={item} href={item} target="_blank" rel="noreferrer">
                <Tag color="#0065ca">{`Xem tập tin ${index + 1}`}</Tag>
              </a>
            ))}
          </span>
        )}
      </p>

      <p>
        <span style={{ fontWeight: 'bold' }}>File giấy tờ đối tượng ưu tiên:</span>{' '}
        {record?.urlGiayToDoiTuongUuTien && record?.urlGiayToDoiTuongUuTien?.length !== 0 && (
          <span>
            {record.urlGiayToDoiTuongUuTien.map((item, index) => (
              <a key={item} href={item} target="_blank" rel="noreferrer">
                <Tag color="#0065ca">{`Xem tập tin ${index + 1}`}</Tag>
              </a>
            ))}
          </span>
        )}
      </p>
      <p>
        <span style={{ fontWeight: 'bold' }}>File quyết định đặc cách:</span>{' '}
        {record?.urlQuyetDinhDacCach && record?.urlQuyetDinhDacCach?.length !== 0 && (
          <span>
            {record.urlQuyetDinhDacCach.map((item, index) => (
              <a key={item} href={item} target="_blank" rel="noreferrer">
                <Tag color="#0065ca">{`Xem tập tin ${index + 1}`}</Tag>
              </a>
            ))}
          </span>
        )}
      </p>

      <p style={{ margin: '5px 0px' }}>
        <b>2. Khu vực tuyển sinh:</b> {record?.khuVucUuTien ?? ''}
      </p>

      <p style={{ margin: '5px 0px' }}>
        <b>3. Đối tượng ưu tiên tuyển sinh (nếu có):</b> {record?.doiTuongTuyenSinh ?? ''}
      </p>

      <p style={{ margin: '5px 0px', fontWeight: 'bold' }}>4. Thông tin ngành đăng ký xét tuyển:</p>
      <i>(Sắp xếp tên chuyên ngành có nguyện vọng đăng ký theo thứ tự mong muốn)</i>
      <Table
        bordered
        pagination={false}
        columns={columnsNguyenVong}
        dataSource={record?.danhSachNguyenVong ?? []}
        scroll={{ x: 900 }}
      />
      <br />
      {record?.trangThai === 'Không tiếp nhận' && record?.ghiChuTiepNhan && (
        <div>
          <b style={{ color: 'red' }}>Ghi chú: </b>
          {record?.ghiChuTiepNhan ?? 'Không có'}
        </div>
      )}

      <Row justify="space-around" style={{ marginTop: 20 }}>
        <Col>
          <Button
            // loading={!!loadingIn}
            // disabled={trangThai !== 'Đã khóa'}
            type="default"
            style={{ marginBottom: 8 }}
            icon={<PrinterOutlined />}
            // onClick={this.inHoSo}
          >
            Xem phiếu đăng ký
          </Button>
        </Col>
        {record?.trangThai !== 'Đã khóa' && (
          <>
            <Col>
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                // onClick={() => this.backEdit()}
                disabled={record?.trangThai !== 'Chưa khóa'}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                disabled={record?.trangThai !== 'Chưa khóa'}
                // onClick={this.showModal}
              >
                <p style={{ margin: 0 }}>
                  <LockOutlined /> Nộp hồ sơ
                </p>
              </Button>
            </Col>
          </>
        )}
        {record?.trangThai !== 'Chưa khóa' && (
          <Col>
            <Popconfirm
              // onConfirm={() => this.moKhoa(data?._id)}
              title={
                <div>
                  <div>Mỗi hồ sơ được phép chỉnh sửa lại 1 lần sau khi đã khóa.</div>
                  <div>Bạn có chắc chắn muốn chỉnh sửa lại hồ sơ?</div>
                </div>
              }
            >
              <Button type="primary">
                {
                  <p style={{ margin: 0 }}>
                    <UnlockOutlined /> Chỉnh sửa lại
                  </p>
                }
              </Button>
            </Popconfirm>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default RaSoatHoSo;
