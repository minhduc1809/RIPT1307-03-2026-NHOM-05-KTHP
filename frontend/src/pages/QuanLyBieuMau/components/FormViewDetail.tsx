import { Button, Card, Form } from 'antd';
import Text from 'antd/lib/typography/Text';
import { useModel } from 'umi';
import GridChoice from './ViewType/GridChoice';
import MultipleChoice from './ViewType/MultipleChoice';
import SingleChoice from './ViewType/SingleChoice';
import ThongKeNumericChoice from './ViewType/NumericChoice';
import Upload from '@/components/Upload/UploadMultiFile';

const FormBaiHoc = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm } = useModel('bieumau');
  const renderQuestion = (question: BieuMau.CauHoi) => {
    let questionEleMent = <div />;
    if (question.loai === 'SingleChoice')
      questionEleMent = <SingleChoice luaChon={question.luaChon} />;
    else if (question.loai === 'MultipleChoice')
      questionEleMent = <MultipleChoice luaChon={question.luaChon} />;
    else if (question.loai === 'Text') questionEleMent = <Text />;
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = <GridChoice hang={question.luaChonHang} cot={question.luaChonCot} />;
    else if (question.loai === 'NumericRange')
      questionEleMent = (
        <ThongKeNumericChoice
          luaChon={{ start: question.gioiHanDuoiTuyenTinh, end: question.gioiHanTrenTuyenTinh }}
        />
      );
    else if (question.loai === 'UploadFile') {
      questionEleMent = (
        <Upload
          otherProps={{
            maxCount: 5,
            multiple: true,
            accept: 'image/*, .pdf, .doc, .docx',
            showUploadList: { showDownloadIcon: false },
          }}
          limit={5}
        />
      );
    }
    return (
      <div key={question._id}>
        <div>
          <b>
            {question.batBuoc && <span style={{ color: 'red' }}>*</span>} {question.noiDungCauHoi}
          </b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Chi tiết khảo sát">
      <Form labelCol={{ span: 24 }} form={form}>
        <h3>{record.tieuDe}</h3>
        <p>{record.moTa}</p>
        <div>
          {record.danhSachKhoi?.map((item: BieuMau.Khoi) => (
            <div key={item.tieuDe}>
              <div>{item.tieuDe}</div>
              <div>{item.moTa}</div>
              <div>
                {item.danhSachCauHoi?.map((cauHoi: BieuMau.CauHoi) => renderQuestion(cauHoi))}
              </div>
            </div>
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
