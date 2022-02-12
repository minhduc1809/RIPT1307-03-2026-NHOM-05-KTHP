import { ArrowRightOutlined, ContainerOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card } from 'antd';
import { history } from 'umi';

const DanhSachPhuongThuc = (props: {
  location: {
    query: {
      idDot: string;
    };
  };
}) => {
  return (
    <Card
      title={
        <Breadcrumb>
          <Breadcrumb.Item href="/hosothisinh/dottuyensinh">
            <ContainerOutlined />
            <span>Đợt {props.location.query.idDot} năm 2022</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Danh sách phương thức xét tuyển</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        <h2>Xét tuyển kết hợp theo Đề án tuyển sinh của Học viện</h2>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<p><strong>1. Đối tượng xét tuyển:</strong></p><p>Ngoài các yêu cầu theo quy định chung trong Phương án tuyển sinh thì thí sinh phải đáp ứng các điều kiện sau:</p><p>a) Thí sinh có Chứng chỉ quốc tế SAT từ 1130/1600 trở lên hoặc ATC từ 25/36 trở lên; và có kết quả điểm trung bình chung học tập lớp 10, 11, 12 hoặc học kỳ 1 lớp 12 đạt từ 7,5 trở lên và có hạnh kiểm Khá trở lên;</p><p>b) Thí sinh có Chứng chỉ tiếng Anh quốc tế trong thời hạn (tính đến ngày xét tuyển) đạt IELTS 5.5 trở lên hoặc TOEFL iBT 65 trở lên hoặc TOEFL IPT 513 trở lên; và có kết quả điểm trung bình chung học tập lớp 10, 11, 12 hoặc học kỳ 1 lớp 12 đạt từ 7,5 trở lên và có hạnh kiểm Khá trở lên;</p><p>c) Thí sinh đạt giải Khuyến khích trong kỳ thi chọn học sinh giỏi quốc gia hoặc đã tham gia kỳ thi chọn học sinh giỏi quốc gia hoặc đạt giải Nhất, Nhì, Ba trong kỳ thi chọn học sinh giỏi cấp Tỉnh, Thành phố trực thuộc Trung ương (TW) các môn Toán, Lý, Hóa, Tin học và có kết quả điểm trung bình chung học tập lớp 10, 11, 12 hoặc học kỳ 1 lớp 12 đạt từ 7,5 trở lên và có hạnh kiểm Khá trở lên.</p><p>d) Là học sinh chuyên các môn Toán, Lý, Hóa, Tin học của trường THPT chuyên trên phạm vi toàn quốc (các trường THPT chuyên thuộc Tỉnh, Thành phố trực thuộc TW và các trường THPT chuyên thuộc Cơ sở giáo dục đại học) hoặc hệ chuyên thuộc các trường THPT trọng điểm quốc gia; Và có kết quả điểm trung bình chung học tập lớp 10, 11, 12 hoặc học kỳ 1 lớp 12 đạt từ 8,0 trở lên và có hạnh kiểm Khá trở lên.</p><p><strong>2. Nguyên tắc xét tuyển:</strong></p><p>Ngoài các nguyên tắc xét tuyển chung trong Phương án tuyển sinh, nguyên tắc xét tuyển áp dụng cho phương thức xét tuyển kết hợp quy định cụ thể như sau:</p><p>- Thí sinh được đăng ký xét tuyển 02 nguyện vọng và phải sắp xếp nguyện vọng theo thứ tự ưu tiên từ cao xuống thấp (nguyện vọng 1 là nguyện vọng cao nhất). Thí sinh chỉ trúng tuyển vào một (01) nguyện vọng ưu tiên cao nhất trong danh sách các nguyện vọng đã đăng ký;</p><p>- Xét tuyển theo ngành và theo kết quả học tập của năm học lớp 10, 11, 12 (hoặc học kỳ 1 năm học lớp 12) của các môn học tưng ứng với tổ hợp bài thi/môn thi của ngành đăng ký xét tuyển;</p><p>- Xét trúng tuyển từ thí sinh có kết quả cao xuống cho đến hết chỉ tiêu;</p><p>- Điểm trúng tuyển của các tổ hợp trong cùng một ngành là bằng nhau;</p><p>- Điểm trúng tuyển được tính bằng tổng cộng của ba (03) điểm bình quân kết quả học tập ở năm học lớp 10, 11, 12 (hoặc học kỳ 1 lớp 12) của ba (03) môn học tương ứng với tổ hợp bài thi/môn thi đã đăng ký xét tuyển, cộng với điểm ưu tiên theo Quy chế tuyển sinh đại học của Bộ Giáo dục và Đào tạo (nếu có);</p><p>- Nếu xét tuyển kết hợp không đủ chỉ tiêu thì chỉ tiêu còn lại được chuyển sang xét tuyển theo phương thức khác;</p><p>- Thí sinh trúng tuyển phải xác nhận nhập học trong thời gian quy định của Học viện. Nếu quá thời hạn này, thí sinh không xác nhận nhập học được xem từ chối nhập học.</p><p>- Các thí sinh có Chứng chỉ tiếng Anh quốc tế sẽ được Học viện ưu tiên xét tuyển thẳng vào Chương trình chất lượng cao ngành Công nghệ thông tin (nếu có nguyện vọng).<br />Các thông tin chi tiết và hướng dẫn tuyển sinh đại học chính quy năm 2021 thí sinh có thể xem trên các công thông tin điện tử và trang Fanpage tuyển sinh của Học viện tại các địa chỉ:</p><ul><li><a style='color: #cc2900;' href='https://ptit.edu.vn'>https://ptit.edu.vn</a></li><li><a style='color: #cc2900;' href='https://daotao.ptit.edu.vn'>https://daotao.ptit.edu.vn</a></li><li><a style='color: #cc2900;' href='https://tuyensinh.ptit.edu.vn'>https://tuyensinh.ptit.edu.vn</a></li><li><a style='color: #cc2900;' href='https://facebook.com/ptittuyensinh'>https://facebook.com/ptittuyensinh</a> </li></ul>",
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            history.push({
              pathname: '/hosothisinh/dottuyensinh/phuongthuctuyensinh',
              query: {
                idDot: props.location.query.idDot,
              },
            });
          }}
          icon={<ArrowRightOutlined />}
        >
          Tiếp theo
        </Button>
      </div>
    </Card>
  );
};

export default DanhSachPhuongThuc;
