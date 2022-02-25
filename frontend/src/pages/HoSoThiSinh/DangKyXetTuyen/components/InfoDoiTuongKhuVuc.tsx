const InfoDoiTuongKhuVuc = (props: {
  type: 'doituonguutien' | 'khuvucuutien' | 'doituongxettuyen';
}) => {
  let titleModal = '';
  let contentModal = <div />;
  switch (props.type) {
    case 'doituonguutien': {
      titleModal = 'Thông tin chi tiết đối tượng ưu tiên tuyển sinh';
      contentModal = (
        <div>
          <p>
            <b>1) Nhóm ưu tiên 1 (UT1) gồm các đối tượng:</b>
            <br />-
            <b>
              <i>Đối tượng 01</i>
            </b>
            : Công dân Việt Nam là người dân tộc thiểu số có hộ khẩu thường trú (trong thời gian học
            THPT hoặc trung cấp) trên 18 tháng tại Khu vực 1 quy định
          </p>
          <p>
            <br />-
            <b>
              <i>Đối tượng 02</i>
            </b>
            : Công nhân trực tiếp sản xuất đã làm việc liên tục 5 năm trở lên, trong đó có ít nhất 2
            năm là chiến sĩ thi đua được cấp tỉnh trở lên công nhận và cấp bằng khen;
          </p>
          <p>
            <br />-
            <b>
              <i>Đối tượng 03</i>
            </b>
            :
            <br />+ Thương binh, bệnh binh, người có “Giấy chứng nhận người được hưởng chính sách
            như thương binh”;
            <br />+ Quân nhân; sĩ quan, hạ sĩ quan, chiến sĩ nghĩa vụ trong Công an nhân dân tại ngũ
            được cử đi học có thời gian phục vụ từ 12 tháng trở lên tại Khu vực 1;
            <br />+ Quân nhân; sĩ quan, hạ sĩ quan, chiến sĩ nghĩa vụ trong Công an nhân dân tại ngũ
            được cử đi học có thời gian phục vụ từ 18 tháng trở lên;
            <br />+ Quân nhân; sĩ quan, hạ sĩ quan, chiến sĩ nghĩa vụ trong Công an nhân dân đã xuất
            ngũ, được công nhận hoàn thành nghĩa vụ phục vụ tại ngũ theo quy định;
            <br />+ Các đối tượng ưu tiên quy định tại điểm i, k, l, m khoản 1 Điều 2 Pháp lệnh số
            26/2005/PL-UBTVQH11 ngày 29 tháng 6 năm 2005 được sửa đổi, bổ sung theo Pháp lệnh số
            04/2012/UBTVQH13 ngày 16 tháng 7 năm 2012 của Ủy ban thường vụ Quốc hội về việc ưu đãi
            người có công với cách mạng;
          </p>
          <p>
            <br />-
            <b>
              <i>Đối tượng 04</i>
            </b>
            :
            <br />+ Con liệt sĩ;
            <br />+ Con thương binh bị suy giảm khả năng lao động từ 81% trở lên;
            <br />+ Con bệnh binh bị suy giảm khả năng lao động từ 81% trở lên;
            <br />+ Con của người hoạt động kháng chiến bị nhiễm chất độc hoá học có tỷ lệ suy giảm
            khả năng lao động 81% trở lên;
            <br />+ Con của người được cấp “Giấy chứng nhận người hưởng chính sách như thương binh”
            mà người được cấp “Giấy chứng nhận người hưởng chính sách như thương binh” bị suy giảm
            khả năng lao động 81% trở lên
            <br />+ Con của Anh hùng lực lượng vũ trang, con của Anh hùng lao động;
            <br />+ Con đẻ của người hoạt động kháng chiến bị dị dạng, dị tật do hậu quả của chất
            độc hóa học đang hưởng trợ cấp hằng tháng;
            <br />+ Con của người có công với cách mạng quy định tại điểm a, b, d khoản 1 Điều 2
            Pháp lệnh số 26/2005/PL-UBTVQH11 ngày 29 tháng 6 năm 2005 được sửa đổi, bổ sung theo
            Pháp lệnh số 04/2012/UBTVQH13 ngày 16 tháng 7 năm 2012 về việc ưu đãi người có công với
            cách mạng;
          </p>
          <p>
            <br />
            <b>2) Nhóm ưu tiên 2 (UT2) gồm các đối tượng:</b>
            <br />-
            <b>
              <i>Đối tượng 05</i>
            </b>
            :
            <br />+ Thanh niên xung phong tập trung được cử đi học;
            <br />+ Quân nhân; sĩ quan, hạ sĩ quan, chiến sĩ nghĩa vụ trong Công an nhân dân tại ngũ
            được cử đi học có thời gian phục vụ dưới 12 tháng ở Khu vực 1 và dưới 18 tháng ở khu vực
            khác;
            <br />+ Chỉ huy trưởng, Chỉ huy phó ban chỉ huy quân sự xã, phường, thị trấn; Thôn đội
            trưởng, Trung đội trưởng Dân quân tự vệ nòng cốt, Dân quân tự vệ đã hoàn thành nghĩa vụ
            tham gia Dân quân tự vệ nòng cốt từ 12 tháng trở lên, dự thi vào ngành Quân sự cơ sở.
            Thời hạn tối đa được hưởng ưu tiên là 18 tháng kể từ ngày ký quyết định xuất ngũ đến
            ngày dự thi hay ĐKXT;
          </p>
          <p>
            <br />-
            <b>
              <i>Đối tượng 06</i>
            </b>
            :
            <br />+ Công dân Việt Nam là người dân tộc thiểu số có hộ khẩu thường trú ở ngoài khu
            vực đã quy định thuộc đối tượng 01;
            <br />+ Con thương binh, con bệnh binh, con của người được hưởng chính sách như thương
            binh bị suy giảm khả năng lao động dưới 81%;
            <br />+ Con của người hoạt động kháng chiến bị nhiễm chất độc hóa học có tỷ lệ suy giảm
            khả năng lao động dưới 81%;
            <br />+ Con của người hoạt động cách mạng, hoạt động kháng chiến bị địch bắt tù, đày;
            <br />+ Con của người hoạt động kháng chiến giải phóng dân tộc, bảo vệ Tổ quốc và làm
            nghĩa vụ quốc tế có giấy chứng nhận được hưởng chế độ ưu tiên theo quy định tại Nghị
            định số 31/2013/NĐ-CP ngày 09 tháng 4 năm 2013 của Chính phủ quy định chi tiết, hướng
            dẫn thi hành một số điều của Pháp lệnh Ưu đãi người có công với cách mạng;
            <br />+ Con của người có công giúp đỡ cách mạng;
          </p>
          <p>
            <br />-
            <b>
              <i>Đối tượng 07</i>
            </b>
            :
            <br />+ Người khuyết tật nặng có giấy xác nhận khuyết tật của cơ quan có thẩm quyền cấp
            theo quy định tại Thông tư liên tịch số 37/2012/TTLTBLĐTBXH-BYT-BTC-BGDĐT ngày 28 tháng
            12 năm 2012 của Bộ Lao động - Thương binh và Xã hội, Bộ Y tế, Bộ Tài chính và Bộ GDĐT
            quy định về việc xác định mức độ khuyết tật do Hội đồng xác định mức độ khuyết tật thực
            hiện;
            <br />+ Người lao động ưu tú thuộc tất cả các thành phần kinh tế được từ cấp tỉnh, Bộ
            trở lên công nhận danh hiệu thợ giỏi, nghệ nhân, được cấp bằng hoặc huy hiệu Lao động
            sáng tạo của Tổng Liên đoàn Lao động Việt Nam hoặc Trung ương Đoàn TNCS Hồ Chí Minh;
            <br />+ Giáo viên đã giảng dạy đủ 3 năm trở lên thi vào các ngành sư phạm;
            <br />+ Y tá, dược tá, hộ lý, y sĩ, điều dưỡng viên, kỹ thuật viên, người có bằng trung
            cấp dược đã công tác đủ 3 năm trở lên thi vào nhóm ngành sức khỏe;
            <br />
            c) Những đối tượng ưu tiên khác đã được quy định trong các văn bản pháp luật hiện hành
            sẽ do Bộ trưởng Bộ GDĐT xem xét, quyết định;
            <br />
            d) Người có nhiều diện ưu tiên theo đối tượng chỉ được hưởng một diện ưu tiên cao nhất.
          </p>
          <p>&nbsp;</p>
        </div>
      );
      break;
    }
    case 'khuvucuutien': {
      titleModal = 'Thông tin chi tiết khu vực tuyển sinh';
      contentModal = (
        <div>
          <p>
            <b>Khu vực 1 (KV1) gồm</b>:
            <br />
            Các xã khu vực I, II, III thuộc vùng dân tộc và miền núi theo quy định được áp dụng
            trong thời gian thí sinh học THPT hoặc trung cấp; các xã đặc biệt khó khăn vùng bãi
            ngang ven biển và hải đảo; các xã đặc biệt khó khăn, xã biên giới, xã an toàn khu vào
            diện đầu tư của Chương trình 135 theo quy định của Thủ tướng Chính phủ;
            <br />
            <br />- <b>Khu vực 2 - nông thôn (KV2-NT) gồm</b>:
            <br />
            Các địa phương không thuộc KV1, KV2, KV3;
            <br />
            <br />- <b>Khu vực 2 (KV2) gồm</b>:
            <br />
            Các thị xã, thành phố trực thuộc tỉnh; các thị xã, huyện ngoại thành của thành phố trực
            thuộc Trung ương (trừ các xã thuộc KV1);
            <br />
            <br />- <b>Khu vực 3 (KV3) gồm </b>:
            <br />
            Các quận nội thành của thành phố trực thuộc Trung ương. Thí sinh thuộc KV3 không thuộc
            diện hưởng ưu tiên khu vực.
          </p>
        </div>
      );
      break;
    }
    case 'doituongxettuyen': {
      titleModal = 'Thông tin chi tiết đối tượng xét tuyển';
      contentModal = (
        <div>
          <p>
            - Thí sinh có Chứng chỉ quốc tế SAT từ 1130/1600 trở lên hoặc ACT từ 25/36 trở lên và có
            kết quả điểm trung bình chung học tập lớp 10, 11, 12 (hoặc học kỳ 1 lớp 12) đạt từ 7,5
            trở lên và có hạnh kiểm Khá trở lên;
            <br />- Thí sinh có Chứng chỉ tiếng Anh quốc tế trong thời hạn (tính đến ngày xét tuyển)
            đạt IELTS 5.5 trở lên hoặc TOEFL iBT 65 trở lên hoặc TOEFL ITP 513 trở lên và có kết quả
            điểm trung bình chung học tập lớp 10, 11, 12 (hoặc học kỳ 1 lớp 12) đạt từ 7,5 trở lên
            và có hạnh kiểm Khá trở lên;
            <br />
            - Thí sinh đạt giải Khuyến khích trong kỳ thi chọn học sinh giỏi quốc gia hoặc đã tham
            gia kỳ thi chọn học sinh giỏi quốc gia hoặc đạt giải Nhất, Nhì, Ba trong kỳ thi chọn học
            sinh giỏi cấp Tỉnh, Thành phố trực thuộc Trung ương (TW) các môn Toán, Lý, Hóa, Tin học
            và có kết quả điểm chung bình chung học tập lớp 10, 11, 12 (hoặc học kỳ 1 lớp 12) đạt từ
            7,5 trở lên và có hạnh kiểm Khá trở lên;
            <br />- Là học sinh chuyên các môn Toán, Lý, Hóa, Tin học của trường THPT chuyên trên
            phạm vi toàn quốc (các trường THPT chuyên thuộc Tỉnh, Thành phố trực thuộc TW và các
            trường THPT chuyên thuộc Cơ sở giáo dục đại học) hoặc hệ/lớp chuyên môn Toán, Lý, Hóa,
            Tin học của các trường THPT chuyên trọng điểm quốc gia; và có kết quả điểm trung bình
            chung học tập lớp 10, 11, 12 (hoặc học kỳ 1 lớp 12) đạt từ 8,0 trở lên và có hạnh kiểm
            Khá trở lên.
          </p>
        </div>
      );
    }
    default: {
      break;
    }
  }
  return (
    <div>
      <b style={{ fontSize: 20 }}>{titleModal}</b>
      <br />
      {['doituonguutien', 'khuvucuutien'].includes(props.type) && (
        <i>
          Thí sinh học liên tục và tốt nghiệp trung học tại khu vực nào thì hưởng ưu tiên theo khu
          vực đó. Nếu trong 3 năm học THPT (hoặc trong thời gian học trung cấp) có chuyển trường thì
          thời gian học ở khu vực nào lâu hơn được hưởng ưu tiên theo khu vực đó. Nếu mỗi năm học
          một trường thuộc các khu vực có mức ưu tiên khác nhau hoặc nửa thời gian học ở trường này,
          nửa thời gian học ở trường kia thì tốt nghiệp ở khu vực nào, hưởng ưu tiên theo khu vực đó
        </i>
      )}
      <br />
      {contentModal}
    </div>
  );
};

export default InfoDoiTuongKhuVuc;
