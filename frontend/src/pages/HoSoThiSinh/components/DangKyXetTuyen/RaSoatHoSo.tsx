import type { IColumn } from '@/utils/interfaces';
import { GridContent } from '@ant-design/pro-layout';
import { Card, Col, Descriptions, Divider, Row, Table, Tag } from 'antd';
import moment from 'moment';
const { Item } = Descriptions;

const RaSoatHoSo = () => {
  const rc: any = {};
  let index = 1;

  const columnChungChi: IColumn<any>[] = [
    {
      title: 'Tên loại chứng chỉ',
      dataIndex: 'tenChungChi',
      align: 'center',
      width: '140px',
      key: 'tenChungChi',
    },
    {
      title: 'Điểm thi chứng chỉ',
      dataIndex: 'diem',
      align: 'center',
      key: 'diem',
      width: '100px',
    },

    {
      title: 'Ngày cấp',
      dataIndex: 'ngayCap',
      align: 'center',
      key: 'ngayCap',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: '140px',
    },
    {
      title: 'Đơn vị cấp',
      dataIndex: 'donViCap',
      align: 'center',
      key: 'donvicap',
      width: '100px',
    },
    {
      title: 'File minh chứng',
      dataIndex: 'fileChungChi',
      align: 'center',
      key: 'fileChungChi',
      render: (value) =>
        Array.isArray(value) &&
        value.map((item, indexChungChi) => (
          <>
            <a href={item} target="_blank" rel="noreferrer">
              <Tag style={{ marginTop: 8 }} color="#c01718">{`Xem tập tin ${
                indexChungChi + 1
              }  `}</Tag>
            </a>{' '}
          </>
        )),
    },
  ];

  const columnDiemTB: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: 'Tên môn',
      dataIndex: 'tenMon',
      align: 'center',
    },
    {
      title: 'Lớp 10',
      dataIndex: 'lop10',
      align: 'center',
      width: 150,
    },
    {
      title: 'Lớp 11',
      dataIndex: 'lop11',
      align: 'center',
      width: 150,
    },
    {
      title: 'Lớp 12 (hoặc Học kỳ 1)',
      dataIndex: 'lop12HK1',
      align: 'center',
      width: 150,
    },
    {
      title: 'Trung bình',
      dataIndex: 'trungbinh',
      align: 'center',
      width: 150,
      render: (text, record) => ((record?.lop10 + record?.lop11 + record?.lop12HK1) / 3).toFixed(2),
    },
  ];

  const columnGiaiCapTinh: IColumn<any>[] = [
    {
      title: 'Loại giải',
      dataIndex: 'loaiGiai',
      align: 'center',
      width: '240px',
      key: 'loaiGiai',
    },
    {
      title: 'Năm đạt giải',
      dataIndex: 'namDatGiai',
      align: 'center',
      key: 'namDatGiai',
      width: '140px',
    },

    {
      title: 'Nơi cấp',
      dataIndex: 'noiCap',
      align: 'center',
      key: 'noiCap',
      // render: value => moment(value).format('DD/MM/YYYY'),
      width: '100px',
    },
    {
      title: 'File minh chứng',
      dataIndex: 'fileChungChi',
      align: 'center',
      key: 'fileChungChi',
      render: (value) =>
        Array.isArray(value) &&
        value.map((item, indexGiai) => (
          <a key={item} href={item} target="_blank" rel="noreferrer">
            <Tag style={{ marginTop: 8 }} color="#c01718">{`Xem tập tin ${indexGiai + 1}`}</Tag>
          </a>
        )),
    },
  ];

  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>PHIẾU ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC HỆ CHÍNH QUY NĂM {2022}</b>
            {localStorage.getItem('loaiDot') !== 'Đặc cách' && (
              <div style={{ color: 'red' }}>
                <i>(Diện xét tuyển theo phương thức kết hợp)</i>
              </div>
            )}
            {/* {trangThai === 'Đã khóa' && ( */}
            <div style={{ color: 'red', fontStyle: 'italic' }}>(Bản chính thức)</div>
            {/* )} */}
          </div>

          <Divider />
          <GridContent>
            <Row>
              <Col span={16}>
                <h1 style={{ fontWeight: 'bold' }}>A. THÔNG TIN THÍ SINH: </h1>
              </Col>
              <Col span={8}>
                <h1 style={{ fontWeight: 'bold', color: '#262626' }}>Cơ sở đăng ký: BVH</h1>
              </Col>
            </Row>

            <Descriptions layout="horizontal" bordered={false}>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>1. Họ và tên</span>}>
                {rc?.hoTen}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>2. Giới tính</span>}>
                {rc?.gioiTinh === 1 ? 'Nữ' : 'Nam'}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>3. Ngày sinh</span>}>
                {moment(rc?.ngaySinh).format('DD/MM/YYYY')}
              </Item>
              <Item span={2} label={<span style={{ fontWeight: 'bold' }}>4. Nơi sinh</span>}>
                {rc?.noiSinh}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>5. CMT/CCCD</span>}>
                {rc?.cmtCccd}
              </Item>
              <Item span={3} label={<span style={{ fontWeight: 'bold' }}>6. Địa chỉ liên hệ</span>}>
                {rc?.diaChiLienHe}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>7. Số điện thoại</span>}>
                {rc?.soDienThoai}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>8. Email</span>}>
                {rc?.email}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>9. Dân tộc</span>}>
                {rc?.danToc}
              </Item>
              <Item span={3} label={<span style={{ fontWeight: 'bold' }}>10. Nơi học THPT</span>}>
                Chưa cập nhật
              </Item>
            </Descriptions>
            <Descriptions
              layout="horizontal"
              bordered
              size="small"
              column={6}
              style={{ marginBottom: 10 }}
            >
              <Item label={<div style={{ width: '50%' }}>Lớp 10</div>} span={6}>
                {rc?.noiHoc?.lop10?.tenTruong}
              </Item>
              <Item label={<span>Mã tỉnh</span>} span={3}>
                {rc?.noiHoc?.lop10?.maTinh}
              </Item>
              <Item label={<span>Mã trường</span>} span={3}>
                {rc?.noiHoc?.lop10?.maTruong}
              </Item>
              <Item label={<span>Lớp 11</span>} span={6}>
                {rc?.noiHoc?.lop11?.tenTruong}
              </Item>
              <Item label={<span>Mã tỉnh</span>} span={3}>
                {rc?.noiHoc?.lop11?.maTinh}
              </Item>
              <Item label={<span>Mã trường</span>} span={3}>
                {rc?.noiHoc?.lop11?.maTruong}
              </Item>
              <Item label={<span>Lớp 12</span>} span={6}>
                {rc?.noiHoc?.lop12?.tenTruong}
              </Item>
              <Item label={<span>Mã tỉnh</span>} span={3}>
                {rc?.noiHoc?.lop12?.maTinh}
              </Item>
              <Item label={<span>Mã trường</span>} span={3}>
                {rc?.noiHoc?.lop12?.maTruong}
              </Item>
            </Descriptions>
            <Descriptions>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}>11. Đối tượng ưu tiên tuyển sinh</span>}
              >
                {rc?.doiTuongUuTienTuyenSinh}
              </Item>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}> 12. Khu vực ưu tiên</span>}
              >
                {rc?.khuVucUuTien}
              </Item>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}> 13. Thí sinh tốt nghiệp</span>}
              >
                {rc?.noiHoc?.thoiGianTotNghiep === 'Trước năm hiện tại'
                  ? 'Trước năm 2021'
                  : 'Tốt nghiệp năm 2021'}
              </Item>
              <Item span={3} label={<span style={{ fontWeight: 'bold' }}> 14. Hạnh kiểm</span>}>
                Tốt
              </Item>
            </Descriptions>

            <Descriptions layout="horizontal">
              <Item label={<span>Lớp 10</span>}>{rc?.noiHoc?.lop10?.hanhKiem}</Item>
              <Item label={<span>Lớp 11</span>}>{rc?.noiHoc?.lop11?.hanhKiem}</Item>
              <Item label={<span>Lớp 12 (hoặc Học kỳ 1)</span>}>{rc?.noiHoc?.lop12?.hanhKiem}</Item>
            </Descriptions>

            <Descriptions>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}> 15. Kết quả điểm TBC học tập</span>}
              >
                {' '}
              </Item>
            </Descriptions>
            <Descriptions layout="horizontal">
              <Item label={<span>Lớp 10</span>}>{rc?.noiHoc?.lop10?.diemTBC}</Item>
              <Item label={<span>Lớp 11</span>}>{rc?.noiHoc?.lop11?.diemTBC}</Item>
              <Item label={<span>Lớp 12 (hoặc Học kỳ 1)</span>}>{rc?.noiHoc?.lop12?.diemTBC}</Item>
            </Descriptions>

            <Descriptions>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}> 16. Điểm TBC các môn</span>}
              >
                {' '}
              </Item>
            </Descriptions>

            <Table
              columns={[
                {
                  title: 'STT',
                  dataIndex: 'index',
                  align: 'center',
                  width: 70,
                },
                {
                  title: 'Tên môn',
                  dataIndex: 'tenMon',
                  align: 'center',
                },
                {
                  title: 'Lớp 10',
                  dataIndex: 'lop10',
                  align: 'center',
                  width: 200,
                },
                {
                  title: 'Lớp 11',
                  dataIndex: 'lop11',
                  align: 'center',
                  width: 200,
                },
                {
                  title: 'Lớp 12 (hoặc Học kỳ 1)',
                  dataIndex: 'lop12HK1',
                  align: 'center',
                  width: 200,
                },
              ]}
              dataSource={[]}
              size="small"
              pagination={false}
            />
            <br />

            <h1 style={{ fontWeight: 'bold' }}>B. THÔNG TIN ĐĂNG KÝ XÉT TUYỂN:</h1>

            {rc?.dataChungChiQuocTe?.length !== 0 && (
              <>
                <Descriptions>
                  <Item
                    span={3}
                    label={
                      <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        {index++}. Thông tin về chứng chỉ quốc tế
                      </span>
                    }
                  >
                    {' '}
                  </Item>
                </Descriptions>

                <Table pagination={false} bordered columns={columnChungChi} dataSource={[]} />
              </>
            )}

            {rc?.dataChungChiNgoaiNgu?.length !== 0 && (
              <>
                <Descriptions>
                  <Item
                    span={3}
                    label={
                      <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        {index++}.Thông tin về chứng chỉ ngoại ngữ
                      </span>
                    }
                  >
                    {' '}
                  </Item>
                </Descriptions>
                <Table pagination={false} bordered columns={columnChungChi} dataSource={[]} />
              </>
            )}

            {rc?.loaiGiai && (
              <div>
                <Descriptions>
                  <Item
                    span={3}
                    label={
                      <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        {index++}. Giải thưởng cấp tỉnh/thành phố trực thuộc TW
                      </span>
                    }
                  >
                    {rc?.monDoatGiaiHSG}
                  </Item>
                </Descriptions>

                <Table pagination={false} bordered columns={columnGiaiCapTinh} dataSource={[]} />
              </div>
            )}
            <br />
            <Descriptions>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}> {index++}. Môn chuyên</span>}
              >
                <b>{rc?.heChuyen ?? ''}</b>
              </Item>
            </Descriptions>
            <Descriptions>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}> {index++}. Đăng ký xét tuyển</span>}
              >
                {' '}
              </Item>
            </Descriptions>
            <Descriptions>
              <Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}>{index - 1}.1: Nguyện vọng 1</span>}
              >
                {' '}
              </Item>
            </Descriptions>

            <Descriptions layout="horizontal">
              <Item span={1} label={<span>Mã ngành</span>}>
                <b>{rc.mangNguyenVong?.[0]?.maNganh ?? ''}</b>
              </Item>
              <Item span={2} label={<span>Tên ngành</span>}>
                <b>{rc.mangNguyenVong?.[0]?.tenNganh ?? ''}</b>
              </Item>
              <Item span={1} label={<span>Tổ hợp</span>}>
                <b>{rc.mangNguyenVong?.[0]?.toHop ?? ''}</b>
              </Item>
              <Item span={2} label={<span>Điểm TBC tổ hợp</span>}>
                <b>{rc.mangNguyenVong?.[0]?.diemTBCToHop ?? ''}</b>
              </Item>
            </Descriptions>

            <Descriptions>
              <Item
                span={3}
                label={
                  <span style={{ fontWeight: 'bold' }}>
                    Tên môn và điểm của từng môn theo tổ hợp
                  </span>
                }
              >
                {' '}
              </Item>
            </Descriptions>

            <Table columns={columnDiemTB} dataSource={[]} size="small" pagination={false} />

            {rc?.nv2?.length > 0 && (
              <div>
                <br />
                <Descriptions>
                  <Item
                    span={3}
                    label={<span style={{ fontWeight: 'bold' }}>{index - 1}.2: Nguyện vọng 2</span>}
                  >
                    {' '}
                  </Item>
                </Descriptions>
                <Descriptions layout="horizontal">
                  <Item span={1} label={<span>Mã ngành</span>}>
                    <b> {rc.mangNguyenVong?.[1]?.maNganh ?? ''}</b>
                  </Item>
                  <Item span={2} label={<span>Tên ngành</span>}>
                    <b> {rc.mangNguyenVong?.[1]?.tenNganh ?? ''}</b>
                  </Item>
                </Descriptions>
                <Descriptions>
                  <Item span={1} label={<span>Tổ hợp</span>}>
                    <b>{rc.mangNguyenVong?.[1]?.toHop ?? ''}</b>
                  </Item>

                  <Item span={2} label={<span>Điểm TBC tổ hợp</span>}>
                    <b>{rc.mangNguyenVong?.[1]?.diemTBCToHop ?? ''}</b>
                  </Item>
                </Descriptions>
                <Descriptions>
                  <Item
                    span={3}
                    label={
                      <span style={{ fontWeight: 'bold' }}>
                        Tên môn và điểm của từng môn theo tổ hợp
                      </span>
                    }
                  >
                    {' '}
                  </Item>
                </Descriptions>

                <Table columns={columnDiemTB} dataSource={[]} size="small" pagination={false} />
              </div>
            )}
            <br />
            <Descriptions>
              <Item
                span={3}
                label={
                  <span style={{ fontWeight: 'bold' }}>
                    {index++}. Đường dẫn file minh chứng hồ sơ học bạ{' '}
                  </span>
                }
              >
                {rc?.urlHoSoDinhKem &&
                  rc?.urlHoSoDinhKem?.length !== 0 &&
                  rc.urlHoSoDinhKem.map((x: string, indexFile: number) => (
                    <a key={x} href={x} target="_blank" rel="noreferrer">
                      <Tag style={{ marginTop: 8 }} color="#c01718">
                        {' '}
                        Xem tập tin {indexFile + 1}
                      </Tag>
                    </a>
                  ))}
              </Item>
              <Item
                span={3}
                label={
                  <span style={{ fontWeight: 'bold' }}>
                    {index++}. Đường dẫn file minh chứng đặc cách{' '}
                  </span>
                }
              >
                {rc?.urlGiayChungNhanDacCach &&
                  rc?.urlGiayChungNhanDacCach?.length !== 0 &&
                  rc.urlGiayChungNhanDacCach.map((x: string, indexFile: number) => (
                    <a key={x} href={x} target="_blank" rel="noreferrer">
                      <Tag style={{ marginTop: 8 }} color="#c01718">
                        {' '}
                        Xem tập tin {indexFile + 1}
                      </Tag>
                    </a>
                  ))}
              </Item>
            </Descriptions>

            {/* {children} */}
          </GridContent>
        </Card>
      </div>
    </>
  );
};

export default RaSoatHoSo;
