const OneSignalDataToPath = (oneSignalData: any) => {
  let path = '';
  switch (oneSignalData?.notifType) {
    case 'LOP_HANH_CHINH':
      path = '/hoctap/lophanhchinh';
      break;
    case 'DAILY_NOTIF_ALL':
      path = '/calendar';
      break;
    case 'LOP_TIN_CHI':
    case 'DIEM_DANH':
      path = oneSignalData?.idLopTinChi ? '/hoctap/loptinchi/' + oneSignalData?.idLopTinChi : '';
      break;
    case 'LICH_TUAN':
      path = '/vanphongso/lichtuan';
      break;
    case 'THAC_MAC_DIEM':
      path = '/hoctap/gochoctap';
      break;
      // case 'DICH_VU_MOT_CUA':
      //   // path = sinhVien ? '/dichvumotcuasv' : '/vanphongsonhanvien/lichsu';
      //   path = sinhVien
      //     ? '/dichvumotcuasv'
      //     : oneSignalData?.maDichVu === MaDichVuVps.BAO_CAO_SU_CO
      //     ? '/vanphongso/baocaosuco'
      //     : oneSignalData?.maDichVu === MaDichVuVps.MUON_PHONG_HOC
      //     ? '/vanphongso/phonghop/dondangky'
      //     : '/vanphongso/xecong/dondangky';

      break;
    default:
      path = '';
  }
  return path;
};

export default OneSignalDataToPath;
