import textinput from '@/assets/DichVuMotCua/Input.png';
import textarea from '@/assets/DichVuMotCua/TextArea.png';
import inputnumber from '@/assets/DichVuMotCua/InputNumber.png';
import datepicker from '@/assets/DichVuMotCua/DatePicker.png';
import uploadsingle from '@/assets/DichVuMotCua/UploadSingle.png';
import uploadmulti from '@/assets/DichVuMotCua/UploadMultiple.png';
import selectmulti from '@/assets/DichVuMotCua/SelectMulti.png';
import selectone from '@/assets/DichVuMotCua/SelectOne.png';
import radio from '@/assets/DichVuMotCua/Radio.png';
import checkbox from '@/assets/DichVuMotCua/Checkbox.png';
import diachi from '@/assets/DichVuMotCua/DiaChi.png';
import table from '@/assets/DichVuMotCua/Table.png';
import textblock from '@/assets/DichVuMotCua/TextBlock.png';

const valueByType = {
  TEXT_INPUT: {
    img: textinput,
    text: 'Text 1 dòng',
  },
  TEXT_AREA: {
    img: textarea,
    text: 'Text nhiều dòng',
  },
  INPUT_NUMBER: {
    img: inputnumber,
    text: 'Nhập số',
  },
  DATE_PICKER: {
    img: datepicker,
    text: 'Chọn thời gian',
  },
  UPLOAD_SINGLE: {
    img: uploadsingle,
    text: 'Tải lên 1 file',
  },
  UPLOAD_MULTI: {
    img: uploadmulti,
    text: 'Tải lên nhiều file',
  },
  DROP_LIST_MULTI: {
    img: selectmulti,
    text: 'Lựa chọn nhiều (Droplist)',
  },
  DROP_LIST_SINGLE: {
    img: selectone,
    text: 'Lựa chọn một (Droplist)',
  },
  RADIO_BUTTON: {
    img: radio,
    text: 'Lựa chọn một (Radio)',
  },
  CHECKLIST: {
    img: checkbox,
    text: 'Lựa chọn nhiều (Checklist)',
  },
  DON_VI_HANH_CHINH: {
    img: diachi,
    text: 'Đơn vị hành chính',
  },
  TABLE: {
    img: table,
    text: 'Dữ liệu dạng bảng',
  },
  TEXT_BLOCK: {
    img: textblock,
    text: 'Đoạn văn bản',
  },
};

const ElementDescription = (props: { type: string; text: string }) => {
  return (
    <div style={{ width: 180, height: 180, padding: 8, borderRadius: 5, backgroundColor: '#000' }}>
      <img
        style={{
          width: 164,
          height: 130,
          objectFit: 'cover',
          borderRadius: 5,
          backgroundColor: '#fff',
        }}
        src={valueByType?.[props?.type]?.img}
      />
      <div style={{ color: '#fff' }}>{valueByType?.[props?.type]?.text}</div>
    </div>
  );
};

export default ElementDescription;
