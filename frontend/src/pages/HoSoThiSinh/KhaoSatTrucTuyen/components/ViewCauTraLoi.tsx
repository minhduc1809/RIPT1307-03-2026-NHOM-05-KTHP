import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SingleChoice from '@/pages/QuanLyBieuMau/components/ViewType/SingleChoice';
import MultipleChoice from '@/pages/QuanLyBieuMau/components/ViewType/MultipleChoice';
import Text from '@/pages/QuanLyBieuMau/components/ViewType/Text';
import GridChoice from '@/pages/QuanLyBieuMau/components/ViewType/GridChoice';
import NumericChoice from '@/pages/QuanLyBieuMau/components/ViewType/NumericChoice';
import type { BieuMau } from '@/services/BieuMau/typings';

const ViewCauTraLoi = (props: { onCancel: any }) => {
  const [form] = Form.useForm();
  const { loading, record, recordTraLoi } = useModel('bieumau');
  const renderQuestion = (question: BieuMau.CauHoi) => {
    let questionEleMent = <div />;
    const recordDapAn = recordTraLoi?.danhSachTraLoi?.find(
      (item) => item.cauHoiId === question._id,
    );
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
    else if (question.loai === 'UploadFile') {
      questionEleMent = (
        <div>
          {recordDapAn?.listUrlFile?.map((item, index) => (
            <>
              <a key={item} href={item} target="_blank" rel="noreferrer">
                File {index + 1}
              </a>
              <br />
            </>
          ))}
        </div>
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
    <Card loading={loading} title="Chi tiết">
      <Form labelCol={{ span: 24 }} form={form}>
        <p>
          <h3>{record?.tieuDe}</h3>
        </p>
        <p>{record?.moTa}</p>
        <div>
          {record?.danhSachKhoi?.map((item: BieuMau.Khoi) => (
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
          <Button type="primary" onClick={() => props?.onCancel()}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ViewCauTraLoi;
