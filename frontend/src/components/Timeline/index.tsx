import { Setting } from '@/utils/constants';
import { Card, Steps, Statistic, Popover } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import mm from 'moment-timezone';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const { Countdown } = Statistic;

const Timeline = (props: { idDot: string }) => {
  const { tab } = useModel('hosothisinh');

  const isLargeScreen = useMediaQuery({
    query: '(min-width: 831px)',
  });
  const [data, setData] = useState<any[]>([]);
  const [dayFinal, setDayFinal] = useState<any[]>([]);
  const [checkDay, setCheckDay] = useState<boolean | number>(false);
  const [diffTime, setDiffTime] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());
  const deadline = now + diffTime;
  const setupTimeline = () => {
    const dataTemp =
      tab === '1'
        ? [
            {
              title: 'Chưa xác định',
              description: 'Mở đăng ký trực tuyến',
            },
            {
              title: 'Chưa xác định',
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

  const customDot = (
    dot: any,
    info: {
      index: number;
      status: any;
      title: React.ReactNode;
      description: React.ReactNode;
    },
  ) => (
    <Popover
      content={
        Number(dayFinal[info.index]) > 0 ? (
          <span>
            Còn <b>{dayFinal[info.index]} ngày</b> đến hạn {info.description}
          </span>
        ) : Number(dayFinal[info.index]) === 0 ? (
          <span>Hôm nay là hạn cuối</span>
        ) : dayFinal[info.index] === 'NaN' ? (
          <span>Chưa xác định thời gian {info.description}</span>
        ) : (
          <span>Đã qua thời gian {info.description}</span>
        )
      }
    >
      {dot}
    </Popover>
  );

  useEffect(() => {
    setupTimeline();
  }, [tab]);

  return (
    <>
      <b style={{ fontSize: 18 }}>Các mốc thời gian đợt {props.idDot} năm 2022</b>
      <br />
      {typeof checkDay === 'number' && checkDay + 1 < data.length && (
        <>
          <div
            style={{
              color: Setting.primaryColor,
              display: 'flex',
              alignItems: 'baseline',
              fontSize: 18,
            }}
          >
            {data[checkDay + 1].description ?? ''}:
            {deadline ? (
              <>
                <Countdown
                  style={{ marginRight: 5 }}
                  value={deadline}
                  format="Còn D ngày H giờ m phút s giây"
                  valueStyle={{
                    color: '#0065ca',
                    fontStyle: 'italic',
                    marginLeft: 5,
                  }}
                  onFinish={finishStep}
                />{' '}
                ({moment(deadline)?.format('HH:mm DD/MM/YYYY')})
              </>
            ) : (
              <div
                style={{
                  color: Setting.primaryColor,
                  display: 'flex',
                  alignItems: 'baseline',
                  fontSize: 18,
                  marginLeft: 5,
                }}
              >
                {' '}
                Chưa xác định
              </div>
            )}
          </div>
        </>
      )}
      {checkDay === false && <i style={{ color: '#0065ca' }}>Đã kết thúc đợt xét tuyển.</i>}
      <Card>
        <Steps
          direction={isLargeScreen ? 'horizontal' : 'vertical'}
          current={typeof checkDay === 'number' ? checkDay : data.length - 1}
          progressDot={customDot}
        >
          {data.map((item) => (
            <Steps.Step
              key={item.title}
              title={
                item?.title !== 'Chưa xác định'
                  ? moment(item?.title).format('HH:mm DD/MM/YYYY')
                  : item?.title
              }
              description={item?.description}
            />
          ))}
        </Steps>
      </Card>
    </>
  );
};

export default Timeline;
