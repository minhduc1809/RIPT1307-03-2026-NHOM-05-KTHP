/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SingleChoice from '@/pages/KhaoSatSVGV/components/Question/SingleChoice';
import MultipleChoice from '@/pages/KhaoSatSVGV/components/Question/MultipleChoice';
import Text from '@/pages/KhaoSatSVGV/components/Question/Text';
import GridChoice from '@/pages/KhaoSatSVGV/components/Question/GridChoice';
import NumericChoice from '@/pages/KhaoSatSVGV/components/Question/NumericChoice';
import { useState } from 'react';

const FormTraLoiKhaoSat = () => {
  const [form] = Form.useForm();
  const { loading, bieuMau, setVisibleForm, khaiBaoYTeModel } = useModel('khaibaosuckhoe');
  const [listLuaChonBang, setListLuaChonBang] = useState<{ idHang: string; idCot: string }[]>([]);
  const renderQuestion = (question: BieuMau.CauHoi, indexKhoi: number, indexCauHoi: number) => {
    let questionEleMent = <div></div>;
    // const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
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
    <Card loading={loading} title="Chi tiết khai báo y tế">
      <Form
        onFinish={(values) => {
          const danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[] = [];
          bieuMau?.danhSachKhoi?.forEach((item, indexKhoi) => {
            item?.danhSachCauHoi?.forEach((cauHoi, indexCauHoi) => {
              let traLoi: KhaiBaoSucKhoe.TraLoiRecord = {
                idCauHoi: cauHoi._id,
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
          khaiBaoYTeModel({ idBieuMau: bieuMau?._id, danhSachTraLoi });
        }}
        labelCol={{ span: 24 }}
        form={form}
      >
        <h3>{bieuMau?.tieuDe ?? ''}</h3>
        <p>{bieuMau?.moTa ?? ''}</p>
        <div>
          {bieuMau?.danhSachKhoi?.map((item: BieuMau.Khoi, indexKhoi) => (
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
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Hoàn thành
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTraLoiKhaoSat;
