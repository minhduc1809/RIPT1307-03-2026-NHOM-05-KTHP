/* eslint-disable no-return-assign */
// import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
// import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
// import { getPhanNhomUserCurrent } from '@/services/PhanQuyen/phanquyen';
import { uploadFile } from '@/services/uploadFile';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { parse } from 'path';
import { useModel } from 'umi';
import { arrKhuVucUuTien, EKhuVucUuTien, ESystemRole } from './constants';
import { ip3 } from './ip';

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

export function currencyFormat(num?: number) {
  return num?.toFixed(0)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ?? '';
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
      { remote: true, name: getNameFile(url), url, status: 'done', size: 0, type: 'img/png' },
    ],
  };
}

export function renderFileListUrlWithName(url: string, fileName?: string) {
  if (!url) return { fileList: [] };
  return {
    fileList: [
      {
        remote: true,
        name: fileName || getNameFile(url),
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
    fileList: arr.map((url, index) => ({
      remote: true, // file đã có trên server, ko phải là upload file mới
      name: `File đính kèm ${index + 1}`,
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

// export async function getPhanNhom() {
//   const vaiTro = localStorage.getItem('vaiTro');
//   const token = localStorage.getItem('token');
//   let response: any = {};
//   if (token && vaiTro) {
//     response = await getPhanNhomUserCurrent();
//   }
//   return response?.data?.data ?? {};
// }

export function handlePhanNhom(initialState: any, code: string): boolean {
  if (initialState?.currentUser?.systemRole === ESystemRole.Admin) return true;
  let flag = false;
  if (initialState?.phanNhom?.danhSachPhanNhom?.length === 0) return false;
  initialState?.phanNhom?.danhSachPhanNhom?.forEach((item: any) => {
    const mucDo = item?.mucDo;
    item?.nhomVaiTroId?.danhSachChucNang?.forEach((idChucNang: string) => {
      if (mucDo === 'Tất cả' && idChucNang === code) {
        flag = true;
      }
      // if (mucDo !== 'Tất cả' && idChucNang === code) {
      //   if (idDoiTuong === undefined) {
      //     flag = true;
      //     return;
      //   }
      //   flag = item?.idDoiTuong === idDoiTuong;
      // }
    });
  });
  return flag;
}

export function useCheckAccess(code: string): boolean {
  const { initialState } = useModel('@@initialState');
  return handlePhanNhom(initialState, code);
}

export const toISOString = (date: moment.MomentInput) => {
  if (date) {
    return moment(date).startOf('day').toISOString();
  }
  return undefined;
};

export const uploadMultiFile = async (
  arrFile: any[],
  returnAllResponse?: boolean,
  isPublic?: boolean,
) => {
  const url: any[] = arrFile
    ?.filter((item) => item?.remote === true)
    ?.map((item) => item?.url ?? '');
  if (!arrFile) return [];
  let arrUrl: string[] = [];
  const arrUpload = arrFile
    ?.filter((item) => item?.remote !== true)
    ?.map(async (file: { originFileObj: any; type: string; name: string }) => {
      const response = await uploadFile({
        file: file?.originFileObj,
        filename: parse(file?.name).name,
        public: isPublic || true,
      });
      return returnAllResponse === true ? response?.data?.data : response?.data?.data?.url;
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
        message.error(`file ${item?.name} có dung lượng > 8mb`);
      }
    });
  return check;
};

export async function getURLImg(payload: any) {
  const form = new FormData();
  // eslint-disable-next-line array-callback-return
  Object.keys(payload).map((key) => {
    form.set(key, payload[key]);
  });
  return axios.post(`${ip3}/file/image/single`, form);
}

// export function calculateChuyen(thongTinHocTapTHPT: HoSoXetTuyen.ThongTinHocTapTHPT): {
//   truongChuyen: boolean;
//   monChuyen: EMonHoc;
// } {
//   let truongChuyen = false;
//   let monChuyen = EMonHoc.EMPTY;

//   const dicTruongChuyen: Record<string, number> = {
//     'Không chuyên': 0,
//     Chuyên: 0,
//   };

//   const dicMonChuyen: Record<string, number> = {};

//   if (!thongTinHocTapTHPT.truongLop10.truongChuyen) {
//     dicTruongChuyen['Không chuyên'] += 1;
//   } else {
//     dicTruongChuyen['Chuyên'] += 1;
//     dicMonChuyen[thongTinHocTapTHPT.truongLop10.monChuyen ?? EMonHoc.EMPTY] =
//       (dicMonChuyen[thongTinHocTapTHPT.truongLop10.monChuyen ?? EMonHoc.EMPTY] ?? 0) + 1;
//   }

//   if (!thongTinHocTapTHPT.truongLop11.truongChuyen) {
//     dicTruongChuyen['Không chuyên'] += 1;
//   } else {
//     dicTruongChuyen['Chuyên'] += 1;
//     dicMonChuyen[thongTinHocTapTHPT.truongLop11.monChuyen ?? EMonHoc.EMPTY] =
//       (dicMonChuyen[thongTinHocTapTHPT.truongLop11.monChuyen ?? EMonHoc.EMPTY] ?? 0) + 1;
//   }

//   if (!thongTinHocTapTHPT.truongLop12.truongChuyen) {
//     dicTruongChuyen['Không chuyên'] += 1;
//   } else {
//     dicTruongChuyen['Chuyên'] += 1;
//     dicMonChuyen[thongTinHocTapTHPT.truongLop12.monChuyen ?? EMonHoc.EMPTY] =
//       (dicMonChuyen[thongTinHocTapTHPT.truongLop12.monChuyen ?? EMonHoc.EMPTY] ?? 0) + 1;
//   }
//   if (dicTruongChuyen['Chuyên'] > dicTruongChuyen['Không chuyên']) {
//     truongChuyen = true;
//     monChuyen = Object.keys(dicMonChuyen).reduce((mon1, mon2) =>
//       dicMonChuyen[mon1] >= dicMonChuyen[mon2] ? mon1 : mon2,
//     ) as EMonHoc;
//   }
//   return {
//     truongChuyen,
//     monChuyen,
//   };
// }

export function calculateKhuVuc(arrKhuVuc: [string, string, string]) {
  const countKhuVuc = {
    KV1: 0,
    KV2_NT: 0,
    KV2: 0,
    KV3: 0,
  };
  for (let i = 0; i < arrKhuVuc.length; i = i + 1) {
    if (arrKhuVucUuTien?.includes(arrKhuVuc[i])) countKhuVuc[EKhuVucUuTien[arrKhuVuc[i]]] += 1;
  }
  const arrCountKhuVuc = Object.values(countKhuVuc);
  return arrCountKhuVuc.indexOf(Math.max(...arrCountKhuVuc));
}

export const mergeCauHinh = (value1: any, value2: any, key: string) => {
  const type1 = typeof value1;
  const type2 = typeof value2;
  if (type1 === 'boolean' && type2 === 'boolean') return value1 || value2;
  if (
    (key === 'max' || key === 'namMax' || key === 'maxLength') &&
    type1 === 'number' &&
    type2 === 'number'
  ) {
    if (value1 >= value2) return value1;
    else return value2;
  }
  if ((key === 'min' || key === 'step') && type1 === 'number' && type2 === 'number') {
    if (value1 >= value2) return value2;
    else return value1;
  }
};

// export const mergeCauHinhDoiTuongXetTuyen = (
//   maDoiTuong: string[],
//   recordDot: DotTuyenSinh.Record,
// ) => {
//   const cauHinh = {};
//   for (let i = 0; i < maDoiTuong?.length; i += 1) {
//     const cauHinhEle = recordDot?.danhSachDoiTuongTuyenSinh?.find(
//       (item) => item.maDoiTuong === maDoiTuong?.[i],
//     )?.cauHinhDoiTuong;
//     _.mergeWith(cauHinh, cauHinhEle, mergeCauHinh);
//   }
//   return cauHinh;
// };

// export const calculateLuaChonToHopVaHienThiDiemQuyDoi = (
//   arrMaDoiTuong: string[],
//   arrDoiTuong: DotTuyenSinh.DoiTuongTuyenSinh[],
// ): {
//   luaChonToHop: boolean;
//   hienThiDiemQuyDoi: boolean;
// } => {
//   let luaChonToHop = false;
//   let hienThiDiemQuyDoi = false;

//   arrDoiTuong
//     ?.filter((item) => arrMaDoiTuong?.includes(item?.maDoiTuong))
//     ?.map((item) => {
//       luaChonToHop = luaChonToHop || item?.yeuCauLuaChonToHop;
//       hienThiDiemQuyDoi = hienThiDiemQuyDoi || item?.hienThiDiemQuyDoi;
//     });

//   return {
//     luaChonToHop,
//     hienThiDiemQuyDoi,
//   };
// };

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

// export const filterDiemUuTien = (thanhPhanDiemQuyDoi: HoSoXetTuyen.ThanhPhanDiemQuyDoi[]) => {
//   return thanhPhanDiemQuyDoi.filter((thanhPhan) =>
//     Object.values(ETenThanhPhanUuTien).includes(thanhPhan.tenThanhPhan as ETenThanhPhanUuTien),
//   );
// };

// export const tongDiemUuTien = (thanhPhanDiemQuyDoi: HoSoXetTuyen.ThanhPhanDiemQuyDoi[]) => {
//   return filterDiemUuTien(thanhPhanDiemQuyDoi).reduce(
//     (sum: number, thanhPhan: HoSoXetTuyen.ThanhPhanDiemQuyDoi) => {
//       return sum + thanhPhan.diem ?? 0;
//     },
//     0,
//   );
// };

export const makeId = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};
