import { Setting } from '@/utils/constants';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
const { Item } = Descriptions;

export const TableGiayToXacNhanNhapHoc = (props: { index?: number }) => {
  const { record } = useModel('ketquaxettuyen');

  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''} Danh sách giấy tờ xác nhận nhập học
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Table
        size="small"
        pagination={false}
        columns={[
          { title: 'STT', dataIndex: 'index', width: 80, align: 'center' },
          {
            title: 'Tên giấy tờ',
            dataIndex: 'tieuDe',
            width: 300,
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
                              {recordGiayTo?.urlHuongDan?.length && (
                                <div>File hướng dẫn đính kèm:</div>
                              )}
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
            dataIndex: 'urlGiayTo',
            width: 300,
            align: 'center',
            render: (value) =>
              Array.isArray(value) &&
              value.map((item, indexChungChi) => (
                <>
                  <a href={item} target="_blank" rel="noreferrer">
                    <Tag style={{ marginTop: 8 }} color={Setting.primaryColor}>{`Xem tập tin ${
                      indexChungChi + 1
                    }  `}</Tag>
                  </a>{' '}
                </>
              )),
          },
        ]}
        dataSource={record?.thongTinXacNhanNhapHoc?.danhSachGiayToXacNhanNhapHoc?.map(
          (item, index) => ({ ...item, index: index + 1 }),
        )}
      />
    </>
  );
};
