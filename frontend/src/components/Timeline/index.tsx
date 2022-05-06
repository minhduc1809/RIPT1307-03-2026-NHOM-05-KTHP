import useInitTimeline from '@/hooks/useInitTimeline';
import { Setting } from '@/utils/constants';
import { Card, Popover, Statistic, Steps } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const { Countdown } = Statistic;

const Timeline = (props: {
  record: any;
  dataTimeline?: { title: string; description: string }[];
}) => {
  const isMediumScreen = useMediaQuery({
    query: '(min-width: 1261px)',
  });

  const isLargeScreen = useMediaQuery({
    query: '(min-width: 831px)',
  });

  const { data, dayFinal, checkDay, setupTimeline, finishStep } = useInitTimeline();
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
    if (props?.record?._id) setupTimeline(props.record, props?.dataTimeline);
  }, [props?.record?._id]);

  return (
    <>
      <Card bodyStyle={{ padding: '13px 24px' }}>
        <div>
          {/* <b style={{ fontSize: 16 }}>Các mốc thời gian đợt {idDot} năm 2022</b>
          <br /> */}
          {typeof checkDay === 'number' && checkDay + 1 < data.length && (
            <>
              <div style={{ color: Setting.primaryColor }}>
                {' '}
                {props?.record?.tenDotTuyenSinh || props?.record?.tenDot},
              </div>
              <div
                style={{
                  color: Setting.primaryColor,
                  display: isMediumScreen ? 'flex' : 'unset',
                  alignItems: 'baseline',
                  fontSize: 14,
                }}
              >
                {data[checkDay + 1].description ?? ''}:
                {data[checkDay + 1]?.title && data[checkDay + 1]?.title !== 'Chưa xác định' ? (
                  <>
                    <Countdown
                      style={{ marginRight: 5 }}
                      value={data[checkDay + 1]?.title}
                      format="Còn D ngày H giờ m phút s giây"
                      valueStyle={{
                        color: Setting.primaryColor,
                        fontSize: 14,
                        marginLeft: 5,
                      }}
                      onFinish={finishStep}
                    />{' '}
                    ({moment(data[checkDay + 1]?.title)?.format('HH:mm DD/MM/YYYY')})
                  </>
                ) : (
                  <div
                    style={{
                      color: Setting.primaryColor,
                      display: 'flex',
                      alignItems: 'baseline',
                      fontSize: 16,
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
          {checkDay === false && <i style={{ color: Setting.primaryColor }}>Đã kết thúc đợt.</i>}
        </div>
        <Steps
          size="small"
          direction={isLargeScreen ? 'horizontal' : 'vertical'}
          current={typeof checkDay === 'number' ? checkDay : data.length - 1}
          progressDot={customDot}
        >
          {data.map((item) => (
            <Steps.Step
              key={item.title}
              title={
                <b style={{ fontSize: 14 }}>
                  {item?.title !== 'Chưa xác định'
                    ? moment(item?.title).format('HH:mm DD/MM/YYYY')
                    : item?.title}
                </b>
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
