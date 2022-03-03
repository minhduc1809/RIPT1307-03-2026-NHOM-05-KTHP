import moment from 'moment';
import { useState } from 'react';

const useInitTimeline = (recordDot?: DotTuyenSinh.Record) => {
  const [data, setData] = useState<any[]>([]);
  const [dayFinal, setDayFinal] = useState<any[]>([]);
  const [checkDay, setCheckDay] = useState<boolean | number>(false);
  const [diffTime, setDiffTime] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());
  const tab = '1';
  const setupTimeline = () => {
    const dataTemp =
      tab === '1'
        ? [
            {
              title: recordDot?.thoiGianMoDangKy ?? 'Chưa xác định',
              description: 'Mở đăng ký trực tuyến',
            },
            {
              title: recordDot?.thoiGianKetThucNopHoSo ?? 'Chưa xác định',
              description: 'Kết thúc nộp hồ sơ tuyển sinh',
            },
            {
              title: 'Chưa xác định',
              description: 'Công bố kết quả tuyển sinh',
            },
            {
              title: 'Chưa xác định',
              description: 'Bắt đầu nộp giấy tờ nhập học',
            },
            {
              title: 'Chưa xác định',
              description: 'Kết thúc nộp giấy tờ nhập học',
            },
          ]
        : [
            {
              title: 'Chưa xác định',
              description: 'Bắt đầu nộp minh chứng KQ thi THPT',
            },
            {
              title: 'Chưa xác định',
              description: 'Kết thúc nộp minh chứng KQ thi THPT',
            },
            {
              title: 'Chưa xác định',
              description: 'Bắt đầu nộp giấy tờ nhập học',
            },
            {
              title: 'Chưa xác định',
              description: 'Kết thúc nộp giấy tờ nhập học',
            },
          ];

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
