/* eslint-disable no-underscore-dangle */
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { readAllNotification, readOneNotification } from '@/services/ThongBao/thongbao';
import { Button, message, Modal } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import NoticeIcon from './NoticeIcon';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const getNoticeData = (notices: ThongBao.Record[]): ThongBao.Record[] => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return [];
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };

    if (newNotice.createdAt) {
      newNotice.datetime = moment(notice.createdAt as string).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    return newNotice;
  });

  return newNotices;
};

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { danhSachNoticeIcon, getThongBaoModel, totalNoticeIcon, pageNoticeIcon, limitNoticeIcon } =
    useModel('thongbao');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<ThongBao.Record[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [record, setRecord] = useState<ThongBao.Record>();

  useEffect(() => {
    getThongBaoModel();
  }, [pageNoticeIcon, limitNoticeIcon]);

  useEffect(() => {
    setNotices(danhSachNoticeIcon);
  }, [danhSachNoticeIcon]);

  const noticeData = getNoticeData(notices);
  const unreadMsg = noticeData?.filter((item) => item.unread);

  const clearReadState = async () => {
    await readAllNotification();
    getThongBaoModel();
    setVisiblePopup(false);
    message.success('Đã đọc tất cả thông báo');
  };

  return (
    <>
      <NoticeIcon
        count={unreadMsg.length}
        onItemClick={async (item) => {
          setRecord(item);
          setView(true);
          setVisiblePopup(false);
          await readOneNotification({ notificationId: item?._id });
          getThongBaoModel();
        }}
        onClear={() => clearReadState()}
        loading={false}
        clearText="Đánh dấu tất cả là đã đọc"
        popupVisible={visiblePopup}
        clearClose
        onPopupVisibleChange={(visible) => {
          setVisiblePopup(visible);
        }}
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={currentUser && totalNoticeIcon}
          list={noticeData}
          title="Thông báo"
          emptyText="Bạn đã xem tất cả thông báo"
        />
      </NoticeIcon>
      <Modal
        footer={
          <Button
            type="primary"
            onClick={() => {
              setView(false);
              setVisiblePopup(true);
            }}
          >
            OK
          </Button>
        }
        width="70%"
        // maskClosable={false}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        onCancel={() => {
          setView(false);
          setVisiblePopup(true);
        }}
        visible={view}
      >
        <ViewThongBao record={record} />
      </Modal>
    </>
  );
};

export default NoticeIconView;
