/* eslint-disable @typescript-eslint/no-shadow */
import moment from 'moment';
import _ from 'lodash';
import { chuanHoa } from '@/utils/utils';

const allCharacters =
  'a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹýếẾ';
// ten : trường tên
// text : trường text
// email
// soDienThoai
// ngaySinh
// required
// username
// password
// inputNumber
// CMND

const rules = {
  dacbiet: [
    {
      pattern: new RegExp(`^[0-9${allCharacters} \n]+$`),
      message: 'Không chứa kí tự đặc biệt',
    },
  ],
  ten: [
    {
      max: 50,
      message: 'Không quá 50 kí tự',
    },
    {
      whitespace: true,
      message: 'Toàn kí tự trắng không hợp lệ',
    },
    {
      pattern: new RegExp(`^[${allCharacters} ]+$`),
      message: 'Tên chỉ bao gồm chữ cái',
    },
  ],
  text: [
    {
      whitespace: true,
      message: 'Toàn kí tự trắng không hợp lệ',
    },
  ],
  sotaikhoan: [
    {
      pattern: new RegExp('^[0-9-]+$'),
      message: 'Chỉ được nhập số',
    },
  ],
  number: (max, min = 0) => [
    {
      pattern: new RegExp('^[0-9-]+$'),
      message: 'Chỉ được nhập số',
    },
    {
      validator: (__, value, callback) => {
        if (parseInt(value, 10) > max) callback('');
        callback();
      },
      message: `Giá trị tối đa: ${max}`,
    },
    {
      validator: (__, value, callback) => {
        if (parseInt(value, 10) < min) callback('');
        callback();
      },
      message: `Giá trị nhỏ nhất: ${min}`,
    },
  ],
  diem: [
    {
      validator: (__, value, callback) => {
        if (!Number.isInteger(value / 0.5)) callback('');
        callback();
      },
      message: `Điểm thi chỉ được lẻ tới 0.5`,
    },
  ],
  diemToeic: [
    {
      validator: (__, value, callback) => {
        if (!Number.isInteger(value / 5)) callback('');
        callback();
      },
      message: `Điểm thi là số chia hết cho 5`,
    },
  ],
  email: [
    {
      validator: (__, email, callback) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) callback('');
        callback();
      },
      message: 'Email chưa đúng định dạng',
    },
  ],
  soDienThoai: [
    {
      pattern: new RegExp(/(^(09|03|07|08|05|01|02|04|06){1}[0-9]{8}$){1}/g),
      message: 'Số điện thoại không đúng định dạng(10 số, không bao gồm kí tự đặc biệt)',
    },
  ],
  ngaySinh: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isAfter(moment())) callback('');
        callback();
      },
      message: 'Ngày sinh chưa đúng',
    },
  ],
  sauHomNay: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isBefore(moment().set({ hour: 0, minute: 0, second: 0 }))) callback('');
        callback();
      },
      message: 'Không được trước thời điểm hiện tại',
    },
  ],
  truocHomNay: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isAfter(moment().set({ hour: 0, minute: 0, second: 0 }))) callback('');
        callback();
      },
      message: 'Không được sau thời điểm hiện tại',
    },
  ],
  required: [
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],
  username: [
    {
      pattern: new RegExp('^[a-zA-Z0-9._]{4,32}$'),
      message: 'Độ dài 4 tới 32 kí tự, chỉ dùng chữ thường, chữ hoa, số, ".", "_"',
    },
    // {
    //   pattern: new RegExp('^(?![_.])[a-zA-Z0-9._]+(?<![_.])$'),
    //   message: 'Không bao gồm "_" hay "." ở đầu hoặc cuối'
    // }
  ],
  password: [
    {
      pattern: new RegExp('^[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]{4,}$'),
      message: 'Độ dài ít nhất 4 kí tự, không sử dụng ký tự khoảng trắng',
    },
    // {
    //   pattern: new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]+$'),
    //   message: 'Bao gồm cả chữ và số',
    // },
  ],
  CMND: [
    {
      pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
      message: 'Bao gồm 9 hoặc 12 chữ số',
    },
  ],
  length: (len) => [
    {
      max: len,
      message: `Không quá ${len} kí tự`,
    },
  ],
  textEditor: [
    {
      validator: (_, value, callback) => {
        const { text } = value;
        if (!text || !text.length || !text[0] || !chuanHoa(text).length) callback('');
        callback();
      },
      message: 'Hãy nhập nội dung',
    },
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],
  fileRequired: [
    {
      validator: (__, value, callback) => {
        if (_.get(value, 'fileList', []).length === 0) return Promise.reject();
        return Promise.resolve();
      },
      message: 'Hãy chọn file',
    },
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],

  fileName: [
    {
      validator: (__, value, callback) => {
        const re = new RegExp(
          '^[ 0-9a-z_\\-aàáạảãâầấậẩẫăằắặẳẵeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹdđ]{1,100}$',
        );

        value?.fileList?.map((item) => {
          if (!re.test(item?.name?.split('.')?.[0])) callback('');
        });
        callback();
      },
      message: 'Tên file chỉ bao gồm chữ cái viết thường, số, ký tự - và ký tự _',
    },
  ],

  fileType: (arrType) => [
    {
      validator: (__, value, callback) => {
        value?.fileList?.map((item) => {
          const type = item?.name?.split('.')?.pop();
          if (!arrType?.includes(type)) callback('');
        });
        callback();
      },
      message: `Chỉ được tải lên file dạng ${arrType?.join(', ')}`,
    },
  ],

  fileLimit: (len) => [
    {
      validator: (__, value, callback) => {
        if (_.get(value, 'fileList', []).length > len) callback('');
        callback();
      },
      message: `Số lượng không quá ${len} file`,
    },
  ],
};

export default rules;
