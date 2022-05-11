import Table from '@/components/Table/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormGiayTo from './FormGiayTo';

const TableGiayTo = (props: { fieldName: 'danhSachGiayToCanNop' }) => {
  const modelDotTuyenSinh = useModel('dotnhaphoc');
  const {
    visibleFormGiayTo,
    setVisibleFormGiayTo,

    setEditGiayTo,
    setRecordGiayTo,
  } = modelDotTuyenSinh;

  const visibleForm = (show: boolean) => {
    setVisibleFormGiayTo(show);
  };

  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 200,
      align: 'center',
      render: (val, recordGiayTo) => (
        <div>
          {val}
          {recordGiayTo?.textHuongDan?.length || recordGiayTo?.urlHuongDan?.length ? (
            <Tooltip placement="bottom" title="Xem hướng dẫn">
              <QuestionCircleOutlined
                style={{ marginLeft: '5px' }}
                onClick={() => {
                  Modal.info({
                    title: (
                      <div>
                        <div>{recordGiayTo?.textHuongDan ?? ''}</div>
                        {recordGiayTo?.urlHuongDan?.length && <div>File hướng dẫn đính kèm:</div>}
                        {recordGiayTo?.urlHuongDan?.map((item, indexChungChi) => (
                          <a key={item} href={item} target="_blank" rel="noreferrer">
                            <Tag
                              style={{ marginTop: 8 }}
                              color={Setting.primaryColor}
                            >{`Xem tập tin ${indexChungChi + 1}  `}</Tag>
                          </a>
                        ))}
                      </div>
                    ),
                  });
                }}
              />
            </Tooltip>
          ) : (
            <div />
          )}
        </div>
      ),
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record: DotTuyenSinh.GiayTo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditGiayTo(true);
                visibleForm(true);
                setRecordGiayTo(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => {
                const listGiayToTemp = [...modelDotTuyenSinh?.[props.fieldName]];
                listGiayToTemp.splice(record.index - 1, 1);
                modelDotTuyenSinh?.[`set${props.fieldName}`](listGiayToTemp);
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        otherProps={{
          pagination: false,
          size: 'small',
        }}
        data={modelDotTuyenSinh?.[props.fieldName]?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns?.filter((item) => item.hide !== true)}
      >
        <Button
          icon={<PlusCircleFilled />}
          style={{ marginBottom: 8 }}
          type="primary"
          onClick={() => {
            visibleForm(true);
            setEditGiayTo(false);
            setRecordGiayTo(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        destroyOnClose
        visible={visibleFormGiayTo}
        onCancel={() => {
          visibleForm(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormGiayTo fieldName={props?.fieldName} />
      </Modal>
    </>
  );
};

export default TableGiayTo;
