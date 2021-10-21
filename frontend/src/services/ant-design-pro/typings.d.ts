// @ts-ignore
/* eslint-disable */

declare module IRecordCalendar {
  export interface Datum {
    id: number;
    name: string;
    attendee_status: string;
    display_time: string;
    start: Date;
    stop: Date;
    allday: boolean;
    start_date: boolean;
    stop_date: boolean;
    duration: number;
    location: boolean;
    show_as: string;
    privacy: string;
    user_id: any[];
  }

  export interface RootObject {
    forEach(arg0: (x: any) => void);
    count?: number;
    data: Datum[];
  }
}

export declare module IInfoSV {
  export interface DataSV {
    id: number;
    HoLotSV: string;
    TenSV: string;
    ma_sv: string;
    DC_DT1LLSV: boolean;
    DC_DCLLSV: boolean;
    lop_hanh_chinh_id: any[];
    khoa_nganh_id: any[];
    khoa_sinh_vien_id: any[];
    khoi_lop_id: any[];
    sv_ltc_ds_ids: number[];
    MaNg: boolean;
    MaChngNg: boolean;
    user_id: any[];
    TenDayDu: string;
    ngay_sinh: boolean;
    gioi_tinh: string;
    so_cmnd: boolean;
    ngay_cap: boolean;
    tinh_tp_hk: boolean;
    quan_huyen_hk: boolean;
    so_nha_ten_duong_hk: boolean;
    tinh_tp_no: boolean;
    quan_huyen_no: boolean;
    phuong_xa_no: boolean;
    so_nha_ten_duong_no: boolean;
    tinh_tp_ns: boolean;
    quan_huyen_ns: boolean;
    phuong_xa_ns: boolean;
    so_nha_ten_duong_ns: boolean;
    avatar_path: boolean;
    email_dang_nhap: string;
    dia_chi_hien_nay: string;
    so_dien_thoai: string;
    so_dien_thoai_thay_the: string;
    vai_tro: string;
  }
  export interface Data {
    id: number;
    ghi_chu: boolean;
    ma_sv: string;
    TenDayDu: string;
    HoLotSV: string;
    TenSV: string;
    VtSV: boolean;
    NgaySinhC: string;
    Phai: string;
    NoiSinh: boolean;
    AvatarSV: boolean;
    MaDT: boolean;
    MaTG: boolean;
    MaNg: boolean;
    MaChngNg: boolean;
    TheThuVien: boolean;
    SoTaiKhoan: boolean;
    MaNH: boolean;
    CHINHANHNH: boolean;
    SoNamBD: number;
    SoNamTNXP: number;
    SoCMND: boolean;
    CanNang: number;
    ChieuCao: number;
    MADBQUOCTICH: boolean;
    CoNghe: number;
    CQCT: boolean;
    CVCQCT: boolean;
    DangHoc: number;
    DC_DCHK: boolean;
    DC_DCHK2: boolean;
    DC_DCLLSV: boolean;
    DC_DCTT: boolean;
    DC_DCVC: boolean;
    DC_DT1HK: boolean;
    DC_DT1LLSV: boolean;
    DC_DT1TT: boolean;
    DC_DT1VC: boolean;
    DC_DT2HK: boolean;
    DC_DT2LLSV: boolean;
    DC_DT2TT: boolean;
    DC_DT2VC: boolean;
    DC_Eml1HK: boolean;
    DC_EML1LLSV: boolean;
    DC_Eml1TT: boolean;
    DC_Eml1VC: boolean;
    DC_Eml2HK: boolean;
    DC_EML2LL: boolean;
    DC_Eml2TT: boolean;
    DC_Eml2VC: boolean;
    DC_GcHK: boolean;
    DC_GcLL: boolean;
    DC_GcTT: boolean;
    DC_GcVC: boolean;
    MADBHKSV: boolean;
    MADBLLSV: boolean;
    MADBTTSV: boolean;
    MADBVCSV: boolean;
    DCCQCT: boolean;
    DKKinhTe: boolean;
    GcSV: boolean;
    GcThPhanGD: boolean;
    MADBCQCTSV: boolean;
    LoaiCuTru: boolean;
    MatCha: number;
    MatMe: number;
    NgayNgTru: boolean;
    NgNghiepVC: boolean;
    NgSinhCha: boolean;
    NgSinhMe: boolean;
    NguoiLL: boolean;
    NguonTuyen: boolean;
    NNgCha: boolean;
    NNgMe: boolean;
    NoiCapCMND: boolean;
    PhongKTX: boolean;
    QueQuan: boolean;
    SoAnhChiEm: number;
    TenCha: boolean;
    TenChuHo: boolean;
    TenChuHoHK: boolean;
    TenMe: boolean;
    TenVC: boolean;
    ThPhanGD: boolean;
    TrChuyen: boolean;
    NgCapCMND: boolean;
    MADBNOISINHSV: boolean;
    DC_EML2LLSV: boolean;
    DC_DT1Me: boolean;
    DC_DT1Cha: boolean;
    GhiChuView1: boolean;
    TenHo: boolean;
    DC_DTNgLL: boolean;
    DC_EmlNgLL: boolean;
    SoBD: boolean;
    Diem1: number;
    Diem2: number;
    Diem3: number;
    Diem4: number;
    DiemUT: number;
    Diem5: number;
    DiemTong: number;
    NganhThi: boolean;
    KhoiThi: boolean;
    NhomKVTS: boolean;
    DOITUONGTS: boolean;
    NAMTN: number;
    MaSoThue: boolean;
    TenDVThue: boolean;
    TTSV: number;
    TGianCT: boolean;
    DotTS: boolean;
    DIEMCHUAN: number;
    HocLuc: boolean;
    HanhKiem: boolean;
    SoBHSV: boolean;
    MaBVKCB: boolean;
    NgSinhGH: boolean;
    TenGiamHo: boolean;
    LoaiKhuyetTat: boolean;
    NNgGH: boolean;
    NgayNHOC: boolean;
    DVDKDTHI: boolean;
    lop_hanh_chinh_id: boolean;
    lop_tin_chi_ids: any[];
    khoa_sinh_vien_id: boolean;
    dia_chi_hien_nay: boolean;
    ten_goi_khac: boolean;
    ngay_sinh: string;
    gioi_tinh: string;
    tinh_tp_ns: boolean;
    quan_huyen_ns: boolean;
    phuong_xa_ns: boolean;
    so_nha_ten_duong_ns: boolean;
    tinh_tp_hk: boolean;
    quan_huyen_hk: boolean;
    phuong_xa_hk: boolean;
    so_nha_ten_duong_hk: boolean;
    dan_toc: boolean;
    ton_giao: boolean;
    tinh_tp_no: boolean;
    quan_huyen_no: boolean;
    phuong_xa_no: boolean;
    so_nha_ten_duong_no: boolean;
    so_cmnd: boolean;
    ngay_cap: boolean;
    so_so_bhxh: boolean;
    ngay_bat_dau: boolean;
    ngay_ket_thuc: boolean;
    partner_id: any[];
    user_id: any[];
    email_dang_nhap: string;
    password: string;
    anh_dai_dien: boolean;
    image_1024: boolean;
    image_512: boolean;
    image_256: boolean;
    image_128: boolean;
    image_path: boolean;
    display_name: string;
    create_uid: any[];
    create_date: string;
    write_uid: any[];
    write_date: string;
    __last_update: string;
    name: string;
    date: boolean;
    title: boolean;
    parent_id: boolean;
    parent_name: boolean;
    child_ids: any[];
    ref: boolean;
    lang: string;
    active_lang_count: number;
    tz: string;
    tz_offset: string;
    vat: boolean;
    same_vat_partner_id: boolean;
    bank_ids: any[];
    website: boolean;
    comment: boolean;
    category_id: any[];
    credit_limit: number;
    active: boolean;
    employee: boolean;
    function: boolean;
    type: string;
    street: boolean;
    street2: boolean;
    zip: boolean;
    city: boolean;
    state_id: boolean;
    country_id: boolean;
    partner_latitude: number;
    partner_longitude: number;
    email_formatted: string;
    mobile: boolean;
    is_company: boolean;
    industry_id: boolean;
    company_type: string;
    company_id: boolean;
    color: number;
    user_ids: number[];
    partner_share: boolean;
    contact_address: string;
    commercial_partner_id: any[];
    commercial_company_name: boolean;
    company_name: boolean;
    barcode: boolean;
    self: any[];
    im_status: string;
    activity_ids: any[];
    activity_state: boolean;
    activity_user_id: boolean;
    activity_type_id: boolean;
    activity_type_icon: boolean;
    activity_date_deadline: boolean;
    activity_summary: boolean;
    activity_exception_decoration: boolean;
    activity_exception_icon: boolean;
    message_is_follower: boolean;
    message_follower_ids: any[];
    message_partner_ids: any[];
    message_channel_ids: any[];
    message_ids: any[];
    message_unread: boolean;
    message_unread_counter: number;
    message_needaction: boolean;
    message_needaction_counter: number;
    message_has_error: boolean;
    message_has_error_counter: number;
    message_attachment_count: number;
    message_main_attachment_id: boolean;
    email_normalized: string;
    is_blacklisted: boolean;
    message_bounce: number;
    email: string;
    phone: boolean;
    channel_ids: number[];
    signup_token: boolean;
    signup_type: boolean;
    signup_expiration: boolean;
    signup_valid: boolean;
    signup_url: string;
    calendar_last_notif_ack: string;
    phone_sanitized: boolean;
    phone_sanitized_blacklisted: boolean;
    phone_blacklisted: boolean;
    mobile_blacklisted: boolean;
    partner_gid: number;
    additional_info: boolean;
    website_message_ids: any[];
    message_has_sms_error: boolean;
    team_id: boolean;
    opportunity_ids: any[];
    meeting_ids: any[];
    opportunity_count: number;
    meeting_count: number;
    task_ids: any[];
    task_count: number;
    is_seo_optimized: boolean;
    website_meta_title: boolean;
    website_meta_description: boolean;
    website_meta_keywords: boolean;
    website_meta_og_img: boolean;
    seo_name: boolean;
    website_id: boolean;
    is_published: boolean;
    can_publish: boolean;
    website_url: string;
    website_published: boolean;
    visitor_ids: number[];
    website_description: boolean;
    website_short_description: boolean;
    image_1920: string;
    slide_channel_ids: any[];
    subjects: any[];
    slide_channel_count: number;
    slide_channel_company_count: number;
    username: string;
    email: string;
    systemRole: string;
    vai_tro: string;
    ngay_sinh: string;
    gioi_tinh: string;
    tinh_tp_hk: string;
    quan_huyen_hk: string;
    phuong_xa_hk: string;
    so_nha_ten_duong_hk: string;
    tinh_tp_no: string;
    quan_huyen_no: string;
    phuong_xa_no: string;
    so_nha_ten_duong_no: string;
    tinh_tp_ns: string;
    quan_huyen_ns: string;
    phuong_xa_ns: string;
    so_nha_ten_duong_ns: string;
    email_dang_nhap: string;
    avatar_path: string;
    so_dien_thoai: string;
    so_dien_thoai_thay_the: string;
    dia_chi_hien_nay: string;
  }

  export interface RootObject {
    data: IInfoGV.Data | IInfoSV.Data;
    statusCode: number;
  }
}

declare module IInfoGV {
  export interface Data {
    id: number;
    ghi_chu: boolean;
    ma_sv: string;
    TenDayDu: string;
    HoLotSV: string;
    TenSV: string;
    VtSV: boolean;
    NgaySinhC: string;
    Phai: string;
    NoiSinh: boolean;
    AvatarSV: boolean;
    MaDT: boolean;
    MaTG: boolean;
    MaNg: boolean;
    MaChngNg: boolean;
    TheThuVien: boolean;
    SoTaiKhoan: boolean;
    MaNH: boolean;
    CHINHANHNH: boolean;
    SoNamBD: number;
    SoNamTNXP: number;
    SoCMND: boolean;
    CanNang: number;
    ChieuCao: number;
    MADBQUOCTICH: boolean;
    CoNghe: number;
    CQCT: boolean;
    CVCQCT: boolean;
    DangHoc: number;
    DC_DCHK: boolean;
    DC_DCHK2: boolean;
    DC_DCLLSV: boolean;
    DC_DCTT: boolean;
    DC_DCVC: boolean;
    DC_DT1HK: boolean;
    DC_DT1LLSV: boolean;
    DC_DT1TT: boolean;
    DC_DT1VC: boolean;
    DC_DT2HK: boolean;
    DC_DT2LLSV: boolean;
    DC_DT2TT: boolean;
    DC_DT2VC: boolean;
    DC_Eml1HK: boolean;
    DC_EML1LLSV: boolean;
    DC_Eml1TT: boolean;
    DC_Eml1VC: boolean;
    DC_Eml2HK: boolean;
    DC_EML2LL: boolean;
    DC_Eml2TT: boolean;
    DC_Eml2VC: boolean;
    DC_GcHK: boolean;
    DC_GcLL: boolean;
    DC_GcTT: boolean;
    DC_GcVC: boolean;
    MADBHKSV: boolean;
    MADBLLSV: boolean;
    MADBTTSV: boolean;
    MADBVCSV: boolean;
    DCCQCT: boolean;
    DKKinhTe: boolean;
    GcSV: boolean;
    GcThPhanGD: boolean;
    MADBCQCTSV: boolean;
    LoaiCuTru: boolean;
    MatCha: number;
    MatMe: number;
    NgayNgTru: boolean;
    NgNghiepVC: boolean;
    NgSinhCha: boolean;
    NgSinhMe: boolean;
    NguoiLL: boolean;
    NguonTuyen: boolean;
    NNgCha: boolean;
    NNgMe: boolean;
    NoiCapCMND: boolean;
    PhongKTX: boolean;
    QueQuan: boolean;
    SoAnhChiEm: number;
    TenCha: boolean;
    TenChuHo: boolean;
    TenChuHoHK: boolean;
    TenMe: boolean;
    TenVC: boolean;
    ThPhanGD: boolean;
    TrChuyen: boolean;
    NgCapCMND: boolean;
    MADBNOISINHSV: boolean;
    DC_EML2LLSV: boolean;
    DC_DT1Me: boolean;
    DC_DT1Cha: boolean;
    GhiChuView1: boolean;
    TenHo: boolean;
    DC_DTNgLL: boolean;
    DC_EmlNgLL: boolean;
    SoBD: boolean;
    Diem1: number;
    Diem2: number;
    Diem3: number;
    Diem4: number;
    DiemUT: number;
    Diem5: number;
    DiemTong: number;
    NganhThi: boolean;
    KhoiThi: boolean;
    NhomKVTS: boolean;
    DOITUONGTS: boolean;
    NAMTN: number;
    MaSoThue: boolean;
    TenDVThue: boolean;
    TTSV: number;
    TGianCT: boolean;
    DotTS: boolean;
    DIEMCHUAN: number;
    HocLuc: boolean;
    HanhKiem: boolean;
    SoBHSV: boolean;
    MaBVKCB: boolean;
    NgSinhGH: boolean;
    TenGiamHo: boolean;
    LoaiKhuyetTat: boolean;
    NNgGH: boolean;
    NgayNHOC: boolean;
    DVDKDTHI: boolean;
    lop_hanh_chinh_id: boolean;
    lop_tin_chi_ids: any[];
    khoa_sinh_vien_id: boolean;
    dia_chi_hien_nay: boolean;
    ten_goi_khac: boolean;
    ngay_sinh: string;
    gioi_tinh: string;
    tinh_tp_ns: boolean;
    quan_huyen_ns: boolean;
    phuong_xa_ns: boolean;
    so_nha_ten_duong_ns: boolean;
    tinh_tp_hk: boolean;
    quan_huyen_hk: boolean;
    phuong_xa_hk: boolean;
    so_nha_ten_duong_hk: boolean;
    dan_toc: boolean;
    ton_giao: boolean;
    tinh_tp_no: boolean;
    quan_huyen_no: boolean;
    phuong_xa_no: boolean;
    so_nha_ten_duong_no: boolean;
    so_cmnd: boolean;
    ngay_cap: boolean;
    so_so_bhxh: boolean;
    ngay_bat_dau: boolean;
    ngay_ket_thuc: boolean;
    partner_id: any[];
    user_id: any[];
    email_dang_nhap: string;
    password: string;
    anh_dai_dien: boolean;
    image_1024: boolean;
    image_512: boolean;
    image_256: boolean;
    image_128: boolean;
    image_path: boolean;
    display_name: string;
    create_uid: any[];
    create_date: string;
    write_uid: any[];
    write_date: string;
    __last_update: string;
    name: string;
    date: boolean;
    title: boolean;
    parent_id: boolean;
    parent_name: boolean;
    child_ids: any[];
    ref: boolean;
    lang: string;
    active_lang_count: number;
    tz: string;
    tz_offset: string;
    vat: boolean;
    same_vat_partner_id: boolean;
    bank_ids: any[];
    website: boolean;
    comment: boolean;
    category_id: any[];
    credit_limit: number;
    active: boolean;
    employee: boolean;
    function: boolean;
    type: string;
    street: boolean;
    street2: boolean;
    zip: boolean;
    city: boolean;
    state_id: boolean;
    country_id: boolean;
    partner_latitude: number;
    partner_longitude: number;
    email_formatted: string;
    mobile: boolean;
    is_company: boolean;
    industry_id: boolean;
    company_type: string;
    company_id: boolean;
    color: number;
    user_ids: number[];
    partner_share: boolean;
    contact_address: string;
    commercial_partner_id: any[];
    commercial_company_name: boolean;
    company_name: boolean;
    barcode: boolean;
    self: any[];
    im_status: string;
    activity_ids: any[];
    activity_state: boolean;
    activity_user_id: boolean;
    activity_type_id: boolean;
    activity_type_icon: boolean;
    activity_date_deadline: boolean;
    activity_summary: boolean;
    activity_exception_decoration: boolean;
    activity_exception_icon: boolean;
    message_is_follower: boolean;
    message_follower_ids: any[];
    message_partner_ids: any[];
    message_channel_ids: any[];
    message_ids: any[];
    message_unread: boolean;
    message_unread_counter: number;
    message_needaction: boolean;
    message_needaction_counter: number;
    message_has_error: boolean;
    message_has_error_counter: number;
    message_attachment_count: number;
    message_main_attachment_id: boolean;
    email_normalized: string;
    is_blacklisted: boolean;
    message_bounce: number;
    email: string;
    phone: boolean;
    channel_ids: number[];
    signup_token: boolean;
    signup_type: boolean;
    signup_expiration: boolean;
    signup_valid: boolean;
    signup_url: string;
    calendar_last_notif_ack: string;
    phone_sanitized: boolean;
    phone_sanitized_blacklisted: boolean;
    phone_blacklisted: boolean;
    mobile_blacklisted: boolean;
    partner_gid: number;
    additional_info: boolean;
    website_message_ids: any[];
    message_has_sms_error: boolean;
    team_id: boolean;
    opportunity_ids: any[];
    meeting_ids: any[];
    opportunity_count: number;
    meeting_count: number;
    task_ids: any[];
    task_count: number;
    is_seo_optimized: boolean;
    website_meta_title: boolean;
    website_meta_description: boolean;
    website_meta_keywords: boolean;
    website_meta_og_img: boolean;
    seo_name: boolean;
    website_id: boolean;
    is_published: boolean;
    can_publish: boolean;
    website_url: string;
    website_published: boolean;
    visitor_ids: number[];
    website_description: boolean;
    website_short_description: boolean;
    image_1920: string;
    slide_channel_ids: any[];
    subjects: any[];
    slide_channel_count: number;
    slide_channel_company_count: number;
    username: string;
    email: string;
    systemRole: string;
    vai_tro: string;
    ngay_sinh: string;
    gioi_tinh: string;
    tinh_tp_hk: string;
    quan_huyen_hk: string;
    phuong_xa_hk: string;
    so_nha_ten_duong_hk: string;
    tinh_tp_no: string;
    quan_huyen_no: string;
    phuong_xa_no: string;
    so_nha_ten_duong_no: string;
    tinh_tp_ns: string;
    quan_huyen_ns: string;
    phuong_xa_ns: string;
    so_nha_ten_duong_ns: string;
    email_dang_nhap: string;
    avatar_path: string;
    so_dien_thoai: string;
    so_dien_thoai_thay_the: string;
    dia_chi_hien_nay: string;
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}

declare module IRecordThongTinNguoiDung {
  export interface Datum {
    id: number;
    name: string;
    display_name: string;
    date: boolean;
    title: boolean;
    parent_id: boolean;
    parent_name: boolean;
    child_ids: any[];
    ref: boolean;
    lang: string;
    active_lang_count: number;
    tz: string;
    tz_offset: string;
    user_id: boolean;
    vat: boolean;
    same_vat_partner_id: boolean;
    bank_ids: any[];
    website: boolean;
    comment: boolean;
    category_id: any[];
    credit_limit: number;
    active: boolean;
    employee: boolean;
    function: boolean;
    type: string;
    street: boolean;
    street2: boolean;
    zip: boolean;
    city: boolean;
    state_id: boolean;
    country_id: boolean;
    partner_latitude: number;
    partner_longitude: number;
    email: string;
    email_formatted: string;
    phone: boolean;
    mobile: boolean;
    is_company: boolean;
    industry_id: boolean;
    company_type: string;
    company_id: any[];
    color: number;
    user_ids: number[];
    partner_share: boolean;
    contact_address: string;
    commercial_partner_id: any[];
    commercial_company_name: boolean;
    company_name: boolean;
    barcode: boolean;
    self: any[];
    image_1920: string;
    image_1024: string;
    image_512: string;
    image_256: string;
    image_128: string;
    create_uid: any[];
    create_date: Date;
    write_uid: any[];
    write_date: Date;
    __last_update: Date;
    im_status: string;
    channel_ids: number[];
    signup_token: boolean;
    signup_type: boolean;
    signup_expiration: boolean;
    signup_valid: boolean;
    signup_url: string;
    calendar_last_notif_ack: Date;
    partner_gid: number;
    additional_info: boolean;
    visitor_ids: number[];
    activity_ids: any[];
    activity_state: boolean;
    activity_user_id: boolean;
    activity_type_id: boolean;
    activity_type_icon: boolean;
    activity_date_deadline: boolean;
    activity_summary: boolean;
    activity_exception_decoration: boolean;
    activity_exception_icon: boolean;
    email_normalized: string;
    is_blacklisted: boolean;
    message_bounce: number;
    message_is_follower: boolean;
    message_follower_ids: any[];
    message_partner_ids: any[];
    message_channel_ids: any[];
    message_ids: any[];
    message_unread: boolean;
    message_unread_counter: number;
    message_needaction: boolean;
    message_needaction_counter: number;
    message_has_error: boolean;
    message_has_error_counter: number;
    message_attachment_count: number;
    message_main_attachment_id: boolean;
    website_message_ids: any[];
    message_has_sms_error: boolean;
    phone_sanitized: boolean;
    phone_sanitized_blacklisted: boolean;
    phone_blacklisted: boolean;
    mobile_blacklisted: boolean;
    is_seo_optimized: boolean;
    website_meta_title: boolean;
    website_meta_description: boolean;
    website_meta_keywords: boolean;
    website_meta_og_img: boolean;
    seo_name: boolean;
    website_published: boolean;
    website_id: boolean;
    is_published: boolean;
    can_publish: boolean;
    website_url: string;
    website_description: boolean;
    website_short_description: boolean;
    slide_channel_ids: any[];
    subjects: any[];
    slide_channel_count: number;
    slide_channel_company_count: number;
    vai_tro: string;
    username: string;
    email: string;
    systemRole: string;
    ngay_sinh: string;
    gioi_tinh: string;
    tinh_tp_hk: string;
    quan_huyen_hk: string;
    phuong_xa_hk: string;
    so_nha_ten_duong_hk: string;
    tinh_tp_no: string;
    quan_huyen_no: string;
    phuong_xa_no: string;
    so_nha_ten_duong_no: string;
    tinh_tp_ns: string;
    quan_huyen_ns: string;
    phuong_xa_ns: string;
    so_nha_ten_duong_ns: string;
    email_dang_nhap: string;
    avatar_path: string;
    so_dien_thoai: string;
    so_dien_thoai_thay_the: string;
    dia_chi_hien_nay: string;
  }

  export interface RootObject {
    count: number;
    data: Datum[];
    name?: string;
  }
}

declare module IRecordLogin {
  export interface User {
    systemRole: string;
    ho_ten: string;
    ho_dem: string;
    ten: string;
    uid: number;
    vai_tro: string;
  }

  export interface Data {
    user: User;
    accessToken: string;
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}

declare module IRecordCalendar {
  export interface Datum {
    id: number;
    name: string;
    title?: string;
    attendee_status: string;
    display_time: string;
    start: Date;
    end?: Date;
    stop: Date;
    allday: boolean;
    start_date: boolean;
    stop_date: boolean;
    duration: number;
    location: boolean;
    show_as: string;
    privacy: string;
    user_id: any[];
  }

  export interface RootObject {
    count: number;
    data: Datum[];
  }
}

declare namespace API {
  declare module LoginResponse {
    export interface Profile {
      _id: string;
      firstname: string;
      lastname: string;
      dateOfBirth: Date;
      gender: string;
      phoneNumber: string;
      address: string;
    }

    export interface AuthorizationVersion {
      props: any[];
      version: number;
      _id: string;
    }

    export interface User {
      _id: string;
      username: string;
      email: string;
      systemRole: string;
      idCoSoDangGoc: string;
      profile: Profile;
      authorizationVersion: AuthorizationVersion;
      createdAt: Date;
      updatedAt: Date;
      __v: number;
      listChucVuCapUy: any[];
    }

    export interface AuthorizedRole {
      accessToken: string;
      systemRole: string;
      coSoDang: CoSoDang;
    }

    export interface Data {
      user: User;
      authorizedRoles: AuthorizedRole[];
    }

    export interface RootObject {
      data: Data;
      status?: string;
      type?: any;
      statusCode: number;
    }
  }

  declare module UserMe {
    export interface AuthorizationVersion {
      version: number;
      updateAt: Date;
      props: string[];
    }

    export interface PasswordReset {
      token: string;
      createdAt: Date;
      expiredAt: Date;
      resetAt: Date;
      reset: boolean;
    }

    export interface EmailVerify {
      token: string;
      createdAt: Date;
      expiredAt: Date;
      verifiedAt: Date;
      verified: boolean;
    }

    export interface IdCoSoDangGoc {}

    export interface IdCoSoDang {}

    export interface NguoiCapQuyen {
      username: string;
      firstname: string;
      lastname: string;
    }

    export interface ListChucVuCapUy {
      idCoSoDang: IdCoSoDang;
      vaiTro: string;
      nhom: string;
      nguoiCapQuyen: NguoiCapQuyen;
    }

    export interface Profile {
      firstname: string;
      lastname: string;
      dateOfBirth: Date;
      gender: string;
      phoneNumber: string;
      address: string;
    }

    export interface IdCoSoDang2 {}

    export interface Data {
      username: string;
      password: string;
      email: string;
      authorizationVersion: AuthorizationVersion;
      passwordReset: PasswordReset;
      emailVerify: EmailVerify;
      systemRole: string;
      idCoSoDangGoc: IdCoSoDangGoc;
      listChucVuCapUy: ListChucVuCapUy[];
      profile: Profile;
      idCoSoDang: IdCoSoDang2;
      nhomDangVien: string;
      clientDeviceId: string;
      clientPlatform: string;
      jti: string;
    }

    export interface RootObject {
      data: Data;
      statusCode: number;
    }
  }

  // type CurrentUser = {
  //   name?: string;
  //   avatar?: string;
  //   userid?: string;
  //   email?: string;
  //   signature?: string;
  //   title?: string;
  //   group?: string;
  //   tags?: { key?: string; label?: string }[];
  //   notifyCount?: number;
  //   unreadCount?: number;
  //   country?: string;
  //   access?: string;
  //   geographic?: {
  //     province?: { label?: string; key?: string };
  //     city?: { label?: string; key?: string };
  //   };
  //   address?: string;
  //   phone?: string;
  // };

  // type LoginResult = {
  //   status?: string;
  //   type?: string;
  //   currentAuthority?: string;
  // };

  type PageParams = {
    current?: number;
    pageSize?: number;
    page?: number;
    limit?: number;
  };

  type RuleListItem = {
    index: number;
    id: number;
    mo_ta: string;
    noi_dung: string;
    ngay_dang: string;
    nguoi_dang: string;
    avatar_path: string;
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    login?: string;
    password?: string;
    db: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
