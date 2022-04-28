import { Button, Card, Checkbox, Form } from 'antd';
import { useModel } from 'umi';
import SingleChoice from './Question/SingleChoice';
import MultipleChoice from './Question/MultipleChoice';
import Text from './Question/Text';
import GridChoice from './Question/GridChoice';
import NumericChoice from './Question/NumericChoice';
import { useState } from 'react';
import type { BieuMau } from '@/services/BieuMau/typings';

const FormTraLoiKhaoSat = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, traLoiBieuMauModel } = useModel('bieumau');
  const [listLuaChonBang, setListLuaChonBang] = useState<{ idHang: string; idCot: string }[]>([]);
  const [check, setCheck] = useState<boolean>(false);
  const renderQuestion = (question: BieuMau.CauHoi, indexKhoi: number, indexCauHoi: number) => {
    let questionEleMent = <div />;
    if (question.loai === 'SingleChoice')
      questionEleMent = (
        <SingleChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    else if (question.loai === 'MultipleChoice')
      questionEleMent = (
        <MultipleChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    else if (question.loai === 'Text')
      questionEleMent = (
        <Text question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = (
        <GridChoice
          listLuaChonBang={listLuaChonBang}
          setListLuaChonBang={setListLuaChonBang}
          question={question}
          indexKhoi={indexKhoi}
          indexCauHoi={indexCauHoi}
        />
      );
    else if (question.loai === 'NumericRange')
      questionEleMent = (
        <NumericChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    return (
      <div>
        <div>
          <b>
            {question.batBuoc && <span style={{ color: 'red' }}>*</span>} Câu hỏi {indexCauHoi + 1}:{' '}
            {question.noiDungCauHoi}
          </b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Chi tiết khảo sát">
      <Form
        scrollToFirstError
        onFinish={(values) => {
          const danhSachTraLoi: BieuMau.TraLoiRecord[] = [];
          record?.danhSachKhoi?.forEach((item, indexKhoi) => {
            item?.danhSachCauHoi?.forEach((cauHoi, indexCauHoi) => {
              let traLoi: BieuMau.TraLoiRecord = {
                cauHoiId: cauHoi._id,
                listLuaChon: [],
                listLuaChonBang: [],
                luaChonTuyenTinh: 0,
                traLoiText: '',
              };
              if (cauHoi.loai === 'SingleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
                traLoi = { ...traLoi, listLuaChon: [values[`${indexKhoi}||${indexCauHoi}`]] };
              else if (cauHoi.loai === 'MultipleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
                traLoi = { ...traLoi, listLuaChon: values[`${indexKhoi}||${indexCauHoi}`] };
              else if (cauHoi.loai === 'Text')
                traLoi = { ...traLoi, traLoiText: values[`${indexKhoi}||${indexCauHoi}`] };
              else if (cauHoi.loai === 'GridMultipleChoice' || cauHoi.loai === 'GridSingleChoice')
                traLoi = {
                  ...traLoi,
                  listLuaChonBang: listLuaChonBang?.[`${indexKhoi}||${indexCauHoi}`] ?? [],
                };
              else if (cauHoi.loai === 'NumericRange') {
                traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
              }
              danhSachTraLoi.push(traLoi);
            });
          });
          traLoiBieuMauModel({ bieuMauId: record?._id ?? '', danhSachTraLoi });
        }}
        labelCol={{ span: 24 }}
        form={form}
      >
        <h3>{record?.tieuDe}</h3>
        <p>{record?.moTa}</p>
        <div>
          {record?.danhSachKhoi?.map((item: BieuMau.Khoi, indexKhoi) => (
            <Card hoverable key={indexKhoi}>
              <div>{item.tieuDe}</div>
              <div>{item.moTa}</div>
              <div>
                {item.danhSachCauHoi?.map((cauHoi: BieuMau.CauHoi, indexCauHoi) =>
                  renderQuestion(cauHoi, indexKhoi, indexCauHoi),
                )}
              </div>
            </Card>
          ))}
        </div>
        <br />
        {record?.coCamKet && (
          <Checkbox
            style={{ marginBottom: 8 }}
            onChange={(e) => {
              setCheck(e.target.checked);
            }}
          >
            {record?.noiDungCamKet}
          </Checkbox>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            disabled={record?.coCamKet ? !check : false}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Hoàn thành
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTraLoiKhaoSat;
