import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
const { Item } = Descriptions;

const BlockGiayTo = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
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
      search: 'search',
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
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 80,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
    },
    {
      title: 'Số lượng tiếp nhận',
      dataIndex: 'soLuongTiepNhan',
      align: 'center',
      width: 100,
    },
    {
      title: 'Ghi chú tiếp nhận',
      dataIndex: 'ghiChuTiepNhan',
      align: 'center',
      width: 150,
    },
  ];
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''}Thông tin giấy tờ nộp
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Table
        size="small"
        pagination={false}
        bordered
        columns={columns}
        dataSource={recordHoSo?.thongTinGiayToNopHoSo?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
      />
    </>
  );
};

export default BlockGiayTo;
