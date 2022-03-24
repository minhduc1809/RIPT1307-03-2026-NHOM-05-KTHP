import useInitTimeline from '@/hooks/useInitTimeline';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { Setting } from '@/utils/constants';
import { Statistic } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const { Countdown } = Statistic;

const TimeLineChonDot = (props: { record: DotTuyenSinh.Record }) => {
  const isMediumScreen = useMediaQuery({
    query: '(min-width: 753px)',
  });
  const { data, checkDay, setupTimeline, finishStep } = useInitTimeline();

  useEffect(() => {
    if (props?.record?._id) setupTimeline(props?.record);
  }, [props?.record?._id]);

  return (
    <>
      {typeof checkDay === 'number' && checkDay + 1 < data.length && (
        <>
          <div
            style={{
              color: Setting.primaryColor,
              display: 'flex',
              alignItems: 'baseline',
              fontSize: 16,
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
                    fontSize: 16,
                    marginLeft: isMediumScreen ? 5 : 0,
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
      {checkDay === false && <i style={{ color: '#0065ca' }}>Đã kết thúc đợt xét tuyển.</i>}
    </>
  );
};

export default TimeLineChonDot;
