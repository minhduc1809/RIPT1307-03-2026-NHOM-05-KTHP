import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { Col, Input, InputNumber, Select } from 'antd';
import { useModel } from 'umi';

const BlockGiaiHSG = (props: { fieldName: string; type: string; cauHinh: any }) => {
  const { recordHoSo } = useModel('hosoxettuyen');

  const cauHinhGiai = props?.cauHinh?.danhSach?.thongTinGiaiHSG?.[props?.fieldName];

  return (
    <>
      {cauHinhGiai?.[`monThiHSG${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`monThiHSG${props.type}`]}
            rules={cauHinhGiai?.[`monThiHSG${props.type}`]?.required ? [...rules.required] : []}
            label="Môn đoạt giải"
            name={[props.fieldName, `monThiHSG${props.type}`]}
          >
            <Select style={{ width: '100%' }} placeholder="Chọn môn đoạt giải">
              {cauHinhGiai?.[`monThiHSG${props.type}`]?.enum?.map((item: string) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`giaiHSG${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`giaiHSG${props.type}`]}
            rules={cauHinhGiai?.[`giaiHSG${props.type}`]?.required ? [...rules.required] : []}
            label="Loại giải"
            name={[props.fieldName, `giaiHSG${props.type}`]}
          >
            <Select style={{ width: '100%' }} placeholder="Chọn loại giải">
              {cauHinhGiai?.[`giaiHSG${props.type}`]?.enum?.map((item: string) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`namDatGiaiHSG${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`namDatGiaiHSG${props.type}`]}
            rules={cauHinhGiai?.[`namDatGiaiHSG${props.type}`]?.required ? [...rules.required] : []}
            label="Năm đoạt giải"
            name={[props.fieldName, `namDatGiaiHSG${props.type}`]}
          >
            <InputNumber
              placeholder="Nhập năm đoạt giải"
              max={2100}
              min={2010}
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`noiCapGiaiHSG${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`noiCapGiaiHSG${props.type}`]}
            rules={cauHinhGiai?.[`noiCapGiaiHSG${props.type}`]?.required ? [...rules.required] : []}
            label="Nơi cấp giải"
            name={[props.fieldName, `noiCapGiaiHSG${props.type}`]}
          >
            <Input placeholder="Nhập nơi cấp giải" style={{ width: '100%' }} />
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`urlBangKhenHSG${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={renderFileList(
              recordHoSo?.[props.fieldName]?.[`urlBangKhenHSG${props.type}`] ?? [],
            )}
            rules={
              cauHinhGiai?.[`urlBangKhenHSG${props.type}`]?.required ? [...rules.fileRequired] : []
            }
            label={'Bằng khen đính kèm'}
            name={[`urlBangKhenHSG${props.type}`]}
          >
            <Upload
              otherProps={{
                accept: 'application/pdf, image/png, .jpg',
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
              limit={cauHinhGiai?.[`urlBangKhenHSG${props.type}`]?.maxLength ?? 5}
            />
          </FormItem>
        </Col>
      )}
    </>
  );
};

export default BlockGiaiHSG;
