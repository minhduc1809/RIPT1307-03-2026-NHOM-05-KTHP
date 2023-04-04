import { uploadFile } from '@/services/uploadFile';
import { message } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import { parse } from 'path';
import { useModel } from 'umi';

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const charMap = {
  a: '[aàáâãăăạảấầẩẫậắằẳẵặ]',
  e: '[eèéẹẻẽêềềểễệế]',
  i: '[iìíĩỉị]',
  o: '[oòóọỏõôốồổỗộơớờởỡợ]',
  u: '[uùúũụủưứừửữự]',
  y: '[yỳỵỷỹý]',
  d: '[dđ]',
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
  [...value].forEach((char: any) => (result += charMap[char] || char));
  return result;
}

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
  if (!value) return undefined;
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

export function currencyFormat(num?: number) {
  if (!num) return '';
  return num?.toFixed(0)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') ?? '';
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
  return decodeURI(url.split('/').slice(-1)[0]);
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
        remote: true,
      },
    ],
  };
}

export function renderFileListUrlWithName(url: string, fileName?: string) {
  if (!url) return { fileList: [] };
  return {
    fileList: [
      {
        name: fileName || getNameFile(url),
        remote: true,
        url,
        status: 'done',
        size: 0,
        type: 'img/png',
      },
    ],
  };
}
export function renderFileList(arr: string[]) {
  if (!arr || !Array.isArray(arr)) return { fileList: [] };
  return {
    fileList: arr.map((url, index) => ({
      remote: true, // file đã có trên server, ko phải là upload file mới
      name: getNameFile(url) || `File ${index + 1}`,
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

export function handlePhanNhom(initialState: any, code: string, idDoiTuong?: string) {
  if (
    initialState?.currentUser?.systemRole === 'Admin' ||
    initialState?.currentUser?.vai_tro === 'quan_tri'
  )
    return true;
  let flag = false;
  if (
    !initialState?.phanNhom?.danhSachPhanNhom ||
    initialState?.phanNhom?.danhSachPhanNhom?.length === 0
  ) {
    return false;
  }

  initialState?.phanNhom?.danhSachPhanNhom?.forEach((item: any) => {
    const mucDo = item?.mucDo;
    item?.nhomVaiTroId?.danhSachChucNang?.forEach((idChucNang: string) => {
      if (mucDo === 'Tất cả' && idChucNang === code) {
        flag = true;
      }
      if (mucDo !== 'Tất cả' && idChucNang === code) {
        if (idDoiTuong === undefined) {
          flag = true;
          return;
        }
        flag = item?.idDoiTuong === idDoiTuong;
      }
    });
  });
  return flag;
}

export function useCheckAccess(code: string, idDoiTuong?: string) {
  const { initialState } = useModel('@@initialState');
  return (
    initialState?.currentUser?.systemRole === 'Admin' ||
    initialState?.currentUser?.vai_tro === 'quan_tri' ||
    initialState?.phanNhom?.nhom_vai_tro?.includes(code) ||
    false
  );
  //return handlePhanNhom(initialState, code, idDoiTuong);
}

export const toISOString = (date: moment.MomentInput) => {
  if (date) {
    return moment(date).startOf('day').toISOString();
  }
  return undefined;
};

export const uploadMultiFile = async (
  arrFile: any[],
  returnFileType?: boolean,
  returnAllResponse?: boolean,
) => {
  const url: any[] = arrFile
    ?.filter((item) => item?.remote === true)
    ?.map((item) =>
      returnFileType === true ? { url: item?.url ?? '', type: item?.type } : item?.url ?? '',
    );
  if (!arrFile) return [];
  let arrUrl: any[] = [];
  const arrUpload = arrFile
    ?.filter((item) => item?.remote !== true)
    ?.map(async (file: { originFileObj: any; type: string; name: string }) => {
      const response = await uploadFile({
        file: file?.originFileObj,
        filename: parse(file?.name).name,
        public: true,
      });
      if (returnFileType) return { url: response?.data?.data?.url, type: file.type };
      else if (returnAllResponse) return response?.data?.data;
      else return response?.data?.data?.url;
    });
  arrUrl = await Promise.all(arrUpload);
  return [...url, ...arrUrl];
};

export const checkFileSize = (arrFile: any[]) => {
  let check = true;
  arrFile
    ?.filter((item) => item?.remote !== true)
    ?.forEach((item) => {
      if (item?.size / 1024 / 1024 > 8) {
        check = false;
        message.error(`file ${item?.name} có dung lượng > 25Mb`);
      }
    });
  return check;
};

export const convert4NumberScoreToAlphabet = (score: string | number): string => {
  const scoreValue = Number(score);
  if (scoreValue === 4) return 'A+';
  else if (scoreValue >= 3.7) return 'A';
  else if (scoreValue >= 3.5) return 'B+';
  else if (scoreValue >= 3) return 'B';
  else if (scoreValue >= 2.5) return 'C+';
  else if (scoreValue >= 2) return 'C';
  else if (scoreValue >= 1.5) return 'D+';
  else if (scoreValue >= 1) return 'D';
  else if (scoreValue >= 0) return 'F';
  else return '';
};

/**
 * Convert điểm hệ 10 sang hệ 4 và dạng chữ
 * @param  {string|number} score Điểm hệ 10
 * @returns [điểm dạng chữ, điểm hệ 4]
 */
export const convertNumberScoreToAlphabet = (score: string | number): [string, string] => {
  if (!score) return ['', ''];
  const scoreValue = Math.round(Number(score) * 10) / 10;
  let numberScore = -1;
  if (scoreValue >= 9.0 && scoreValue <= 10) numberScore = 4;
  else if (scoreValue >= 8.5) numberScore = 3.7;
  else if (scoreValue >= 8.0) numberScore = 3.5;
  else if (scoreValue >= 7.0) numberScore = 3;
  else if (scoreValue >= 6.5) numberScore = 2.5;
  else if (scoreValue >= 5.5) numberScore = 2;
  else if (scoreValue >= 5.0) numberScore = 1.5;
  else if (scoreValue >= 4.0) numberScore = 1;
  else if (scoreValue >= 0) numberScore = 0;

  return [convert4NumberScoreToAlphabet(numberScore), numberScore.toString()];
};

export const buildFormData = (payload: any) => {
  const form = new FormData();
  Object.keys(payload).map((key) => {
    if (isValue(payload[key])) {
      if (Array.isArray(payload[key])) {
        for (let i = 0; i < payload[key].length; i += 1) {
          form.append(key, payload[key][i]);
        }
        return;
      }
      form.set(key, trim(payload[key]));
    }
  });
  return form;
};

const _checkTrungLich = (
  lop: { start: number; end: number; idLop: number; maLop: string },
  danhSachLop: { start: number; end: number; idLop: number; maLop: string }[],
): boolean => {
  for (const x of danhSachLop.filter((l) => l.idLop !== lop.idLop)) {
    if ((x.start >= lop.start && x.start < lop.end) || (x.end > lop.start && x.end <= lop.end)) {
      return true;
    }
  }
  return false;
};

export const makeId = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

export const checkTrungLich = async (
  allowP: number,
  danhSachLop: { start: number; end: number; idLop: number; maLop: string; title: string }[],
): Promise<boolean> => {
  const mapSoBuoiHoc: Record<string, number> = {};

  const mapBuoiTrung: Record<string, number> = {};
  for (const lop of danhSachLop) {
    mapBuoiTrung[`${lop.maLop}||${lop.title}`] = mapBuoiTrung[`${lop.maLop}||${lop.title}`] || 0;
    mapSoBuoiHoc[`${lop.maLop}||${lop.title}`] = mapSoBuoiHoc[`${lop.maLop}||${lop.title}`] || 0;
    if (_checkTrungLich(lop, danhSachLop) === true) {
      ++mapBuoiTrung[`${lop.maLop}||${lop.title}`];
    }
    ++mapSoBuoiHoc[`${lop.maLop}||${lop.title}`];
  }
  let result = true;
  for (const lop of Object.keys(mapBuoiTrung)) {
    mapBuoiTrung[lop] = mapBuoiTrung[lop] / mapSoBuoiHoc[lop];
    if (mapBuoiTrung[lop] > allowP / 100) {
      message.error(`${lop?.split('||')?.[1]} bị trùng lịch, vui lòng kiểm tra lại`, 10);
      result = false;
    }
  }
  return result;
};

export const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disabledRangeTime = (
  current: Moment,
  type: 'start' | 'end',
  hour: string,
  minute: string,
) => {
  return current && current.format('DDMMYYYY') === moment().format('DDMMYYYY')
    ? {
        disabledHours: () => range(0, Number(hour)),
        disabledMinutes: () => range(0, hour === current.format('HH') ? Number(minute) : 0),
        disabledSeconds: () => [55, 56],
      }
    : {};
};

export const tienVietNam = (number: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

export const b64toBlob = (b64Data?: string, contentType = '', sliceSize = 512) => {
  if (!b64Data) return undefined;
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const blobToBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const ellipse = (text: string | any[], length: number = 20) => {
  let s = '';
  if (text?.length < length) return text;
  for (let i = 0; i < length; i++) {
    s += text[i];
  }
  s += '...';
  return s;
};

export const removeHtmlTags = (html: string) =>
  html
    ?.replace(/<\/?[^>]+(>|$)/g, '')
    ?.replace(/&nbsp;/g, '')
    ?.trim();

/**
 * Number to currency format
 * @param number value
 */
export const inputFormat = (value?: number): string =>
  `${value}`.replace(/(?=(\d{3})+(?!\d))\B/g, ',');

/**
 * Input value to number
 * @param string value
 */
export const inputParse = (value?: string): number =>
  +(value?.replace(/\₫\s?|(,*)[^\d]/g, '') ?? 0);

/**
 * Chuẩn hóa Object trước khi lưu
 * trim string
 */
export const chuanHoaObject = (obj: any) => {
  if (!obj) return obj; // undefined or null
  if (typeof obj !== 'object') return trim(obj);
  Object.keys(obj).forEach((key) => (obj[key] = chuanHoaObject(obj[key])));
  return obj;
};
