import { GridContent } from '@ant-design/pro-layout';
import { Card, Col, Descriptions, Divider, Row, Table, Tag } from 'antd';
import BlockRaSoatThongTinCaNhan from '../components/BlockRaSoatThongTinCaNhan';
const { Item } = Descriptions;

const RaSoatHoSoXetTuyenKetQuaThiTHPT = () => {
  const rc: any = {};
  let index = 1;

  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>PHIẾU ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC HỆ CHÍNH QUY NĂM {2022}</b>
            {localStorage.getItem('loaiDot') !== 'Đặc cách' && (
              <div style={{ color: 'red' }}>
                <i>
                  (Diện xét tuyển theo phương thức sử dụng kết quả thi tốt nghiệp THPT năm 2022)
                </i>
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

            <BlockRaSoatThongTinCaNhan />

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

            <Table
              columns={[
                {
                  title: 'STT',
                  dataIndex: 'index',
                  width: 80,
                  align: 'center',
                },
                {
                  title: 'Môn',
                  dataIndex: 'mon',
                  // width:200,
                  align: 'center',
                },
                {
                  title: 'Điểm thi THPT',
                  dataIndex: 'diem',
                  align: 'center',
                },
              ]}
              dataSource={[]}
              size="small"
              pagination={false}
            />

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

                <Table
                  columns={[
                    {
                      title: 'STT',
                      dataIndex: 'index',
                      width: 80,
                      align: 'center',
                    },
                    {
                      title: 'Môn',
                      dataIndex: 'mon',
                      // width:200,
                      align: 'center',
                    },
                    {
                      title: 'Điểm thi THPT',
                      dataIndex: 'diem',
                      align: 'center',
                    },
                  ]}
                  dataSource={[]}
                  size="small"
                  pagination={false}
                />
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
                    {index++}. Đường dẫn file minh chứng đối tượng ưu tiên{' '}
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

export default RaSoatHoSoXetTuyenKetQuaThiTHPT;
