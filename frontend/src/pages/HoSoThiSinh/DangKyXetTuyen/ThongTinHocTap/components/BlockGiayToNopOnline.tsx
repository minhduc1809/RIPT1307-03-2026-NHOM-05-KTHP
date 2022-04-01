import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tag, Table, Descriptions, Modal, Tooltip } from 'antd';

import { useModel } from 'umi';
const { Item } = Descriptions;

const BlockGiayToNopOnline = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên giấy tờ',
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
      title: 'File đính kèm',
      dataIndex: 'urlGiayToNop',
      width: 200,
      align: 'center',
      render: (val) => (
        <div>
          {val.map((x: string, indexFile: number) => (
            <a key={x} href={x} target="_blank" rel="noreferrer">
              <Tag color={Setting.primaryColor}> Xem tập tin {indexFile + 1}</Tag>
            </a>
          ))}
        </div>
      ),
    },
  ];
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''} Danh sách giấy tờ nộp
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={recordHoSo?.thongTinGiayToNopOnline?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
      />
    </>
  );
};

export default BlockGiayToNopOnline;
