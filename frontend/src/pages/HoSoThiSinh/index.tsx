import { Select, List, Avatar, Card } from 'antd';
import logo from '@/assets/logo.png';
import { history } from 'umi';

const HoSoThiSinh = () => {
  const danhSachDotTuyenSinh = [
    {
      id: 1,
      title: 'Đợt 1: Xét tuyển kết hợp theo đề án tuyển sinh của Học viện',
      time: 'Kết thúc nộp hồ sơ tuyển sinh: Còn 23 ngày 0 giờ 11 phút 44 giây (18:00 09/02/2022)',
      isCoHoSo: 'Thí sinh có hồ sơ xét tuyển',
      trangThai: 'Chưa khóa',
    },
    {
      id: 2,
      title: 'Đợt 2: Xét tuyển kết hợp theo đề án tuyển sinh của Học viện',
      time: 'Bắt đầu đăng ký xét tuyển: Còn 23 ngày 0 giờ 11 phút 44 giây (18:00 09/02/2022)',
      isCoHoSo: 'Thí sinh không có hồ sơ xét tuyển',
    },
  ];

  return (
    <Card title="Danh sách đợt tuyển sinh">
      <Select value={2022} style={{ width: 200, marginBottom: 24 }}>
        <Select.Option value={2022}>Năm tuyển sinh 2022</Select.Option>
      </Select>

      <List
        itemLayout="horizontal"
        dataSource={danhSachDotTuyenSinh}
        renderItem={(item) => (
          <>
            <Card
              onClick={() => {
                history.push({
                  pathname: '/hosothisinh/dottuyensinh/dot',
                  query: {
                    idDot: item.id.toString(),
                  },
                });
              }}
              hoverable
            >
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={logo} />}
                  title={<div>{item.title}</div>}
                  description={
                    <>
                      <div>{item.time}</div> <div>{item.isCoHoSo}</div>
                      <div>Trạng thái: {item?.trangThai ?? ''}</div>
                    </>
                  }
                />
              </List.Item>
            </Card>
            <br />
          </>
        )}
      />
    </Card>
  );
};

export default HoSoThiSinh;
