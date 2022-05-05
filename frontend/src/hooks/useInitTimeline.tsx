import moment from 'moment';
import { useState } from 'react';

const useInitTimeline = () => {
  const [data, setData] = useState<any[]>([]);
  const [dayFinal, setDayFinal] = useState<any[]>([]);
  const [checkDay, setCheckDay] = useState<boolean | number>(false);
  const [diffTime, setDiffTime] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());

  const setupTimeline = (
    recordDot?: any,
    dataTimeLine?: { title: string; description: string }[],
  ) => {
    debugger;
    const type = window.location.pathname;
    const dataTemp =
      dataTimeLine ||
      [
        {
          title: recordDot?.thoiGianMoDangKy ?? 'Chưa xác định',
          description: 'Mở đăng ký trực tuyến',
        },
        {
          title: recordDot?.thoiGianKetThucNopHoSo ?? 'Chưa xác định',
          description: 'Kết thúc nộp hồ sơ tuyển sinh',
        },
        {
          title: recordDot?.thoiGianCongBoKetQua ?? 'Chưa xác định',
          description: 'Công bố kết quả tuyển sinh',
        },
        {
          title: recordDot?.thoiGianBatDauXacNhanNhapHoc ?? 'Chưa xác định',
          description: 'Bắt đầu xác nhận nhập học',
          hide: type?.includes('dangkyxettuyen'),
        },
        {
          title: recordDot?.thoiGianKetThucXacNhanNhapHoc ?? 'Chưa xác định',
          description: 'Kết thúc xác nhận nhập học',
          hide: type?.includes('dangkyxettuyen'),
        },
      ]?.filter((item) => item?.hide !== true);

    const dayFinalTemp = dataTemp.map((item) => {
      const currentDate = moment(new Date(item?.title));
      return parseFloat((currentDate.diff(moment(new Date())) / 86400000).toString()).toFixed(0);
    });

    let checkDayTemp: number | boolean = false;
    for (let i = 0; i < dataTemp?.length; i += 1) {
      if (new Date(dataTemp[i]?.title) < new Date()) {
        checkDayTemp = i;
      }
    }
    if (checkDayTemp === false) checkDayTemp = -1;
    const nowTemp = Date.now();
    if (checkDayTemp) {
      const diffTimeTemp = moment(new Date(dataTemp[checkDayTemp + 1]?.title)).diff(nowTemp);
      setDiffTime(diffTimeTemp);
    }

    setData(dataTemp);
    setDayFinal(dayFinalTemp);
    setCheckDay(checkDayTemp);
    setNow(nowTemp);
  };

  const finishStep = () => {
    let step = typeof checkDay === 'number' ? checkDay : -2;
    step += 1;
    if (checkDay !== false && typeof checkDay === 'number' && checkDay + 2 < data.length) {
      const nowTemp = Date.now();
      const diffTimeTemp = moment(new Date(data[step + 1]?.title)).diff(nowTemp);
      setNow(nowTemp);
      setDiffTime(diffTimeTemp);
    }
    setCheckDay(step);
  };

  return {
    finishStep,
    setupTimeline,
    data,
    dayFinal,
    checkDay,
    diffTime,
    now,
  };
};

export default useInitTimeline;
