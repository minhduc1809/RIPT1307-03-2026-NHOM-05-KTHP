/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SingleChoice from './Question/SingleChoice';
import MultipleChoice from './Question/MultipleChoice';
import Text from './Question/Text';
import GridChoice from './Question/GridChoice';
import NumericChoice from './Question/NumericChoice';

const FormBaiHoc = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, bieuMau } = useModel('khaibaosuckhoe');
  const renderQuestion = (question: BieuMau.CauHoi) => {
    let questionEleMent = <div></div>;
    const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
    if (question.loai === 'SingleChoice')
      questionEleMent = (
        <SingleChoice luaChon={question.luaChon} dapAn={recordDapAn?.listLuaChon ?? []} />
      );
    else if (question.loai === 'MultipleChoice')
      questionEleMent = (
        <MultipleChoice luaChon={question.luaChon} dapAn={recordDapAn?.listLuaChon ?? []} />
      );
    else if (question.loai === 'Text')
      questionEleMent = <Text dapAn={recordDapAn?.traLoiText ?? ''} />;
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = (
        <GridChoice
          hang={question.luaChonHang}
          cot={question.luaChonCot}
          dapAn={recordDapAn?.listLuaChonBang ?? []}
        />
      );
    else if (question.loai === 'NumericRange')
      questionEleMent = (
        <NumericChoice
          luaChon={{ start: question.gioiHanDuoiTuyenTinh, end: question.gioiHanTrenTuyenTinh }}
          dapAn={recordDapAn?.luaChonTuyenTinh}
        />
      );
    return (
      <div key={question._id}>
        <div>
          <b>{question.noiDungCauHoi}</b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Chi tiết khai báo">
      <Form labelCol={{ span: 24 }} form={form}>
        <p>
          <h3>{bieuMau.tieuDe}</h3>
        </p>
        <p>{bieuMau.moTa}</p>
        <div>
          {bieuMau.danhSachKhoi?.map((item: BieuMau.Khoi) => (
            <>
              <div>{item.tieuDe}</div>
              <div>{item.moTa}</div>
              <div>
                {item.danhSachCauHoi?.map((cauHoi: BieuMau.CauHoi) => renderQuestion(cauHoi))}
              </div>
            </>
          ))}
        </div>
        <br />
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button type="primary" onClick={() => setVisibleForm(false)}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
