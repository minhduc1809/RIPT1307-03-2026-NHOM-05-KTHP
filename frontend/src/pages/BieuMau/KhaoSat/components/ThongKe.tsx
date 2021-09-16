import { Card } from 'antd';
import { useModel } from 'umi';
import MultipleChoice from './ThongKeType/MultipleChoice';
import NumericChoice from './ThongKeType/NumericChoice';
import SingleChoice from './ThongKeType/SingleChoice';

const ThongKe = () => {
  const { loading, thongKe } = useModel('bieumau');
  const renderThongKe = (question: BieuMau.ThongKeCauHoi) => {
    let questionEleMent = <div></div>;
    // const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
    if (question.loai === 'SingleChoice')
      questionEleMent = <SingleChoice ketQua={question.ketQua} />;
    else if (question.loai === 'MultipleChoice' || question.loai === 'DropdownMenu')
      questionEleMent = <MultipleChoice ketQua={question.ketQua} />;
    // else if (question.loai === 'Text') questionEleMent = <Text />;
    // else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
    //   questionEleMent = <GridChoice hang={question.luaChonHang} cot={question.luaChonCot} />;
    else if (question.loai === 'NumericRange')
      questionEleMent = <NumericChoice ketQua={question.ketQua} />;
    return (
      <div>
        <div>
          <b>Câu hỏi: {question.noiDungCauHoi}</b>
        </div>
        <div>
          <b>Số người trả lời: {question.soLuongTraLoi}</b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Thống kê kết quả">
      <p>
        <h3>
          <b>{thongKe?.tieuDe}</b>
        </h3>
      </p>
      <p>{thongKe?.moTa}</p>
      <div>
        {thongKe?.thongKeKhoi?.map((item: BieuMau.ThongKeKhoi) => (
          <>
            <div>{item.tieuDe}</div>
            <div>{item.moTa}</div>
            <div>
              {item.thongKeCauHoi?.map((cauHoi: BieuMau.ThongKeCauHoi) => renderThongKe(cauHoi))}
            </div>
          </>
        ))}
      </div>
    </Card>
  );
};

export default ThongKe;
