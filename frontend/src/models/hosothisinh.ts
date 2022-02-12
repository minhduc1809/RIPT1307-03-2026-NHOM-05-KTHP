import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState<number>(0);
  const [tab, setTab] = useState<string>('1');
  const [danhSachNguyenVong, setDanhSachNguyenVong] = useState<any[]>([]);
  const [visibleFormNguyenVong, setVisibleFormNguyenVong] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [recordNguyenVong, setRecordNguyenVong] = useState<any>();
  return {
    recordNguyenVong,
    setRecordNguyenVong,
    edit,
    setEdit,
    visibleFormNguyenVong,
    setVisibleFormNguyenVong,
    danhSachNguyenVong,
    setDanhSachNguyenVong,
    tab,
    setTab,
    current,
    setCurrent,
  };
};
