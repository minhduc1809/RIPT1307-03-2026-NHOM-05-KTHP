import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { readAllNotification, readOneNotification } from '@/services/ThongBao';
import { Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import NoticeIcon from './NoticeIcon';

const NoticeIconView = () => {
  const {
    danhSachNoticeIcon,
    getThongBaoModel,
    totalNoticeIcon,
    pageNoticeIcon,
    limitNoticeIcon,
    loading,
    record,
    setRecord,
  } = useModel('thongbao');
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);

  useEffect(() => {
    getThongBaoModel();
  }, [pageNoticeIcon, limitNoticeIcon]);

  const unreadMsg = danhSachNoticeIcon; //?.filter((item) => item.unread);

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
          setVisibleDetail(true);
          setVisiblePopup(false);
          // await readOneNotification({ notificationId: item?._id });
          getThongBaoModel();
        }}
        loading={loading}
        onClear={() => clearReadState()}
        clearText="Đánh dấu tất cả là đã đọc"
        popupVisible={visiblePopup}
        clearClose
        onPopupVisibleChange={(visible) => {
          setVisiblePopup(visible);
        }}
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={totalNoticeIcon}
          list={danhSachNoticeIcon}
          title="Thông báo"
          emptyText="Bạn đã xem tất cả thông báo"
        />
      </NoticeIcon>

      <Modal
        width={800}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        onCancel={() => setVisibleDetail(false)}
        visible={visibleDetail}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
      >
        <ViewThongBao
          record={record}
          afterViewDetail={() => {
            setVisibleDetail(false);
            setVisiblePopup(false);
          }}
        />
      </Modal>
    </>
  );
};

export default NoticeIconView;
