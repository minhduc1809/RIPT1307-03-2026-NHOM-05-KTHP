import studentIcon from '@/assets/student.png';
import teacherIcon from '@/assets/teacher.png';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getDataLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Descriptions, List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { useEffect, useState } from 'react';
import { history } from 'umi';

const LopHanhChinh = () => {
  const [dataLopHanhChinh, setdataLopHanhChinh] = useState<APILopHanhChinh.Data>({});
  useEffect(() => {
    const getData = async () => {
      const res = await getDataLopHanhChinh();
      setdataLopHanhChinh(res?.data);
    };
    getData();
  }, []);

  const { danhSachSinhVien, mentor_id, si_so, ten_lop_hanh_chinh } = dataLopHanhChinh;
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/loptinchi');
            }}
          >
            <TeamOutlined /> Lớp hành chính
          </Breadcrumb.Item>
          <Breadcrumb.Item>{ten_lop_hanh_chinh ?? ''}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Descriptions title={`Sĩ số: ${si_so ?? 0} sinh viên`} />
      <Descriptions title="Cố vấn học tập:" />
      <List
        grid={{
          xs: 1,
          xl: 3,
          sm: 2,
          lg: 3,
          md: 2,
          xxl: 4,
        }}
        itemLayout="horizontal"
        dataSource={[mentor_id?.[1] || '']}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.anhDaiDien ?? teacherIcon} />}
              title={
                <div>
                  <b>Họ và tên: </b>
                  {item}
                </div>
              }
              description={
                <div>
                  <b>Số điện thoại: </b>
                  {item?.soDienThoai ?? 'Chưa cập nhật'}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Descriptions title="Danh sách sinh viên:" />
      <List
        grid={{
          xs: 1,
          xl: 3,
          md: 2,
          sm: 2,
          lg: 3,
          xxl: 4,
        }}
        itemLayout="horizontal"
        dataSource={danhSachSinhVien || []}
        renderItem={(item: APILopHanhChinh.DanhSachSinhVien) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.anhDaiDien ?? studentIcon} />}
              title={
                <div>
                  <b>Họ và tên: </b>
                  {item?.TenDayDu ?? ''}
                </div>
              }
              description={
                <div>
                  <b>Mã sinh viên: </b>
                  {item?.MaSV ?? ''}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default LopHanhChinh;
