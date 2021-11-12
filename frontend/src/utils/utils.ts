/* eslint-disable no-return-assign */
import { getPhanNhomUserCurrent } from '@/services/PhanQuyen/phanquyen';
import moment from 'moment';
import { useModel } from 'umi';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const map = {
  a: '[aàáâãăăạảấầẩẫậắằẳẵặ]',
  e: '[eèéẹẻẽêềềểễệế]',
  i: '[iìíĩỉị]',
  o: '[oòóọỏõôốồổỗộơớờởỡợ]',
  u: '[uùúũụủưứừửữự]',
  y: '[yỳỵỷỹý]',
  ' ': ' ',
};

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function toHexa(str: string) {
  // render rgb color from a string
  if (!str) return '';
  const maxBase = 1000000007;
  const base = 16777216;
  let sum = 1;
  for (let i = 0; i < str.length; i += 1) {
    sum = (sum * str.charCodeAt(i)) % maxBase;
  }
  sum %= base;
  // return `#${sum.toString(16)}`;
  const colors = [
    'rgba(26, 94, 18, 0.7)',
    'rgba(84, 106, 47, 0.7)',
    'rgba(107, 143, 36, 0.7)',
    'rgba(45, 77, 0, 0.7)',
    'rgba(0, 100, 0, 0.7)',
    'rgba(47, 79, 79, 0.7)',
    'rgba(0, 128, 128, 0.7)',
    'rgba(0, 139, 139, 0.7)',
    'rgba(100, 149, 237, 0.7)',
  ];
  return colors[sum % colors.length];
}

export function tinhTuanHienTai(ngayHoc: moment.MomentInput) {
  const batDauKy1 = '2019-09-05';
  // Tìm thứ của ngày bắt đầu kỳ 1
  const dateBatDauKy1 = moment(batDauKy1);
  const thuBatDauKy1 = dateBatDauKy1.day();

  const dateBatDauTuan1 = dateBatDauKy1.subtract(thuBatDauKy1 - 1, 'days');
  const dateNgayHoc = moment(ngayHoc);

  return dateNgayHoc.diff(dateBatDauTuan1, 'weeks') + 1;
}

export function tinhNgayTheoTuan(
  tuan: moment.DurationInputArg1,
  thu: number,
  ngayBatDau: moment.MomentInput,
) {
  return moment(ngayBatDau)
    .add(tuan, 'weeks')
    .add(thu - 1, 'days');
}

function render(value: string) {
  // phục vụ hàm toRegex bên dưới
  let result = '';
  [...value].forEach((char) => (result += map[char] || char));
  return result;
}

// page: 1,
// limit: 10,
// cond: {
//   hoTen: toRegex('h')
// }

export function Format(str: string) {
  // xóa hết dấu + đưa về chữ thường
  if (!str) return '';
  return str
    .toString()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
}

export function toRegex(value: any) {
  // convert từ string sang dạng regex.
  return { $regex: `.*${render(Format(value))}.*`, $options: 'i' };
}

export function Object2Regex(obj: Record<string, any>) {
  // convert từ string sang dạng regex.
  return Object.keys(obj).map((key) => ({
    [key]: { $regex: `.*${render(Format(obj[key]))}.*`, $options: 'i' },
  }));
}

export function isValue(val: string | number | any[]) {
  // check xem nếu bị undefined, null, xâu rỗng -> false
  if (!val && val !== 0) return false; // undefined, null
  if (val && Array.isArray(val) && val?.length === 0) return false; // ""
  return true;
}

export function trim(str: string) {
  // nếu là moment thì cho sang string
  if (moment.isMoment(str)) return str?.toISOString() ?? '';
  // xóa tất cả dấu cách thừa
  if (typeof str !== 'string') return str;
  return str.replace(/[ ]{2,}/g, ' ').trim();
}

export function currencyFormat(num: number) {
  return num?.toFixed(0)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
export function chuanHoa(ten: any) {
  return trim(ten)
    .split(' ')
    .map((t: string) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(' ');
}

export function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getNameFile(url: string) {
  if (typeof url !== 'string') return 'Đường dẫn không đúng';
  return url.split('/').slice(-1)[0];
  // .substring(26);
}

export function renderFileListUrl(url: string) {
  if (!url) return { fileList: [] };
  return {
    fileList: [
      {
        name: getNameFile(url),
        url,
        status: 'done',
        size: 0,
        type: 'img/png',
      },
    ],
  };
}

export function renderFileList(arr: string[]) {
  if (!arr) return { fileList: [] };
  return {
    fileList: arr.map((url) => ({
      remote: true, // file đã có trên server, ko phải là upload file mới
      name: getNameFile(url),
      url,
      status: 'done',
      size: 0,
      type: 'img/png',
    })),
  };
}

export function includes(str1: string, str2: string) {
  // str1 có chứa str2 ko
  return Format(str1).includes(Format(str2));
}

export async function getPhanNhom() {
  const vaiTro = localStorage.getItem('vaiTro');
  const token = localStorage.getItem('token');
  let response: any = {};
  if (token && vaiTro) {
    response = await getPhanNhomUserCurrent();
  }
  return response?.data?.data ?? {};
}

export function handlePhanNhom(initialState: any, code: string, idDoiTuong?: string) {
  let flag = false;
  if (initialState?.phanNhom?.danhSachPhanNhom?.length === 0) return false;
  initialState?.phanNhom?.danhSachPhanNhom?.forEach((item: any) => {
    const mucDo = item?.mucDo;
    item?.nhomVaiTroId?.danhSachChucNang?.map((idChucNang: string) => {
      if (mucDo === 'Tất cả' && idChucNang === code) {
        flag = true;
      }
      if (mucDo !== 'Tất cả' && idChucNang === code) {
        if (idDoiTuong === undefined) return true;
        return item?.idDoiTuong === idDoiTuong;
      }
      return true;
    });
  });
  return flag;
}

export function useCheckAccess(code: string, idDoiTuong?: string) {
  const { initialState } = useModel('@@initialState');
  return handlePhanNhom(initialState, code, idDoiTuong);
}
