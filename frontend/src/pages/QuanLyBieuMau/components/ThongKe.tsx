/* eslint-disable no-underscore-dangle */
import { Button, Card, Divider, Form } from 'antd';
import { useModel } from 'umi';
import GridChoice from './ThongKeType/GridChoice';
import MultipleChoice from './ThongKeType/MultipleChoice';
import NumericChoice from './ThongKeType/NumericChoice';
import SingleChoice from './ThongKeType/SingleChoice';

const ThongKe = () => {
  const { loading, thongKe, setVisibleForm } = useModel('bieumau');
  const renderThongKe = (question: any, index: number) => {
    let questionEleMent = <div />;
    // const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
    if (question.loai === 'SingleChoice' && question?.soLuongTraLoi > 0)
      questionEleMent = (
        <SingleChoice ketQua={question.ketQua} tong={question?.soLuongTraLoi ?? 0} />
      );
    else if (question.loai === 'MultipleChoice' || question.loai === 'DropdownMenu')
      questionEleMent = <MultipleChoice ketQua={question.ketQua} />;
    // else if (question.loai === 'Text') questionEleMent = <Text />;
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = <GridChoice ketQua={question.ketQua} />;
    else if (question.loai === 'NumericRange')
      questionEleMent = <NumericChoice ketQua={question.ketQua} />;
    return (
      <div key={question?._id}>
        <div>
          <b>
            {question.batBuoc && <span style={{ color: 'red' }}>*</span>} Câu hỏi {index + 1}:{' '}
            {question.noiDungCauHoi}
          </b>
        </div>
        <div>
          <b>Số lượt trả lời: {question.soLuongTraLoi}</b>
        </div>
        <div>{questionEleMent}</div>
        <br />
        <Divider type="horizontal" />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Thống kê kết quả">
      <h3>
        <b>{thongKe?.tieuDe}</b>
      </h3>

      <p>{thongKe?.moTa}</p>
      <div>
        {thongKe?.thongKeKhoi?.map((item: BieuMau.ThongKeKhoi) => (
          <>
            <Card key={item._id} hoverable>
              <div>{item.tieuDe}</div>
              <div>{item.moTa}</div>
              <div>
                {item.thongKeCauHoi?.map((cauHoi: BieuMau.ThongKeCauHoi, index) =>
                  renderThongKe(cauHoi, index),
                )}
              </div>
            </Card>
            <br />
          </>
        ))}
      </div>
      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Button type="primary" onClick={() => setVisibleForm(false)}>
          Đóng
        </Button>
      </Form.Item>
    </Card>
  );
};

export default ThongKe;
