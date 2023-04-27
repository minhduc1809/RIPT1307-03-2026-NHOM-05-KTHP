import { Avatar, List, Skeleton } from 'antd';
import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModel } from 'umi';
import styles from './NoticeList.less';

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: string;
  onClick?: (item: ThongBao.Record) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: ThongBao.Record[];
  onViewMore?: (e: any) => void;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  const { totalNoticeIcon, limitNoticeIcon, setLimitNoticeIcon, loading } = useModel('thongbao');
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  const loadMoreData = () => {
    if (loading) return;
    setLimitNoticeIcon(limitNoticeIcon + 5);
  };
  return (
    <div>
      {/* <Scrollbars
        // autoHide
        // ref="scrollbars"
        id="scrollableDiv"
        style={{ height: '400px' }}
      > */}
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          style={{
            overflow: 'unset',
          }}
          dataLength={list.length}
          next={loadMoreData}
          hasMore={list.length < totalNoticeIcon}
          loader={
            <div style={{ padding: '12px 24px' }}>
              <Skeleton paragraph={{ rows: 1 }} active />
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <List<ThongBao.Record>
            className={styles.list}
            dataSource={list}
            renderItem={(item, i) => {
              const itemCls = classNames(styles.item, {
                [styles.read]: item.unread,
              });
              // eslint-disable-next-line no-nested-ternary
              const leftIcon = item.avatar ? (
                typeof item.avatar === 'string' ? (
                  <Avatar className={styles.avatar} src={item.avatar} />
                ) : (
                  <span className={styles.iconElement}>{item.avatar}</span>
                )
              ) : null;

              return (
                <List.Item
                  className={itemCls}
                  key={item.key || i}
                  onClick={() => {
                    onClick?.(item);
                  }}
                >
                  <List.Item.Meta
                    className={styles.meta}
                    avatar={leftIcon}
                    title={
                      <div className={styles.title}>
                        {item.title}
                        <div className={styles.extra}>{item.extra}</div>
                      </div>
                    }
                    description={
                      <div>
                        <div className={styles.description}>{item.description}</div>
                        <div className={styles.datetime}>{item.datetime}</div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
        {/* </Scrollbars> */}
      </div>
      <div className={styles.bottomBar}>
        {showClear ? <div onClick={onClear}>{clearText}</div> : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
