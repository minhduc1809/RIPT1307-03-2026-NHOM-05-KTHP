import { Setting } from '@/utils/constants';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';

const { Item } = Descriptions;

export const TableThongTinKhaiXacNhanNhapHoc = (props: { index?: number }) => {
  const { record } = useModel('ketquaxettuyen');

  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''} Thông tin khai xác nhận nhập học
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
            title: 'Tên',
            dataIndex: 'tieuDe',
            width: 200,
            align: 'center',
            render: (val, recordThongTin) => (
              <div>
                {val}
                {recordThongTin?.textHuongDan?.length || recordThongTin?.urlHuongDan?.length ? (
                  <Tooltip placement="bottom" title="Xem hướng dẫn">
                    <QuestionCircleOutlined
                      style={{ marginLeft: '5px' }}
                      onClick={() => {
                        Modal.info({
                          title: (
                            <div>
                              <div>{recordThongTin?.textHuongDan ?? ''}</div>
                              {recordThongTin?.urlHuongDan?.length && (
                                <div>File hướng dẫn đính kèm:</div>
                              )}
                              {recordThongTin?.urlHuongDan?.length ? (
                                recordThongTin?.urlHuongDan?.map((item, indexChungChi) => (
                                  <a key={item} href={item} target="_blank" rel="noreferrer">
                                    <Tag
                                      style={{ marginTop: 8 }}
                                      color={Setting.primaryColor}
                                    >{`Xem tập tin ${indexChungChi + 1}  `}</Tag>
                                  </a>
                                ))
                              ) : (
                                <div />
                              )}
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
            title: 'Nội dung',
            dataIndex: 'noiDung',
            width: 300,
            align: 'center',
          },
        ]}
        dataSource={record?.thongTinXacNhanNhapHoc?.danhSachThongTinKhaiXacNhan?.map(
          (item, index) => ({ ...item, index: index + 1 }),
        )}
      />
    </>
  );
};
