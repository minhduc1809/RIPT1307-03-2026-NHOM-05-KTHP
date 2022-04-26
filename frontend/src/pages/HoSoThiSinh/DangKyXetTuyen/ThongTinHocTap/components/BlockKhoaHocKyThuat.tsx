import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { Col, Input, Select } from 'antd';
import { useModel } from 'umi';

const BlockGiaiKHKT = (props: { fieldName: string; type: string; cauHinh: any }) => {
  const { recordHoSo } = useModel('hosoxettuyen');

  const cauHinhGiai = props?.cauHinh?.danhSach?.thongTinGiaiKHKT?.[props?.fieldName];

  return (
    <>
      {cauHinhGiai?.[`linhVucKHKT${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`linhVucKHKT${props.type}`]}
            rules={
              cauHinhGiai?.[`linhVucDatGiai${props.type}`]?.required ? [...rules.required] : []
            }
            label="Lĩnh vực đạt giải"
            name={[props.fieldName, `linhVucKHKT${props.type}`]}
          >
            <Input placeholder="Lĩnh vực đạt giải" />
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`loaiGiaiKHKT${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`loaiGiaiKHKT${props.type}`]}
            rules={cauHinhGiai?.[`loaiGiaiKHKT${props.type}`]?.required ? [...rules.required] : []}
            label="Loại giải"
            name={[props.fieldName, `loaiGiaiKHKT${props.type}`]}
          >
            <Select style={{ width: '100%' }} placeholder="Chọn loại giải">
              {cauHinhGiai?.[`loaiGiaiKHKT${props.type}`]?.enum?.map((item: string) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`tenDeTaiKHKT${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={recordHoSo?.[props.fieldName]?.[`tenDeTaiKHKT${props.type}`]}
            rules={cauHinhGiai?.[`tenDeTaiKHKT${props.type}`]?.required ? [...rules.required] : []}
            label="Năm đoạt giải"
            name={[props.fieldName, `tenDeTaiKHKT${props.type}`]}
          >
            <Input placeholder="Tên đề tài" />
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`urlBangKhenKHKT${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={renderFileList(
              recordHoSo?.[props.fieldName]?.[`urlBangKhenKHKT${props.type}`] ?? [],
            )}
            rules={
              cauHinhGiai?.[`urlBangKhenKHKT${props.type}`]?.required ? [...rules.fileRequired] : []
            }
            label={'Bằng khen/giấy chứng nhận'}
            name={[`urlBangKhenKHKT${props.type}`]}
          >
            <Upload
              otherProps={{
                accept: 'application/pdf, image/png, .jpg',
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
              limit={cauHinhGiai?.[`urlBangKhenKHKT${props.type}`]?.maxLength ?? 5}
            />
          </FormItem>
        </Col>
      )}
      {cauHinhGiai?.[`tomTatDeTaiKHKT${props.type}`] && (
        <Col xs={24} md={8} lg={6} sm={12}>
          <FormItem
            initialValue={renderFileList(
              recordHoSo?.[props.fieldName]?.[`tomTatDeTaiKHKT${props.type}`] ?? [],
            )}
            rules={
              cauHinhGiai?.[`tomTatDeTaiKHKT${props.type}`]?.required ? [...rules.fileRequired] : []
            }
            label={'Tệp tóm tắt đề tài'}
            name={[`tomTatDeTaiKHKT${props.type}`]}
          >
            <Upload
              otherProps={{
                accept: 'application/pdf, image/png, .jpg',
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
              limit={cauHinhGiai?.[`tomTatDeTaiKHKT${props.type}`]?.maxLength ?? 5}
            />
          </FormItem>
        </Col>
      )}
    </>
  );
};

export default BlockGiaiKHKT;
