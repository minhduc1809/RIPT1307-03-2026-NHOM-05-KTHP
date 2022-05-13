import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Form, Modal, Table, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import Upload from '@/components/Upload/UploadMultiFile';
const { Item } = Descriptions;

export const TableGiayToXacNhanNhapHoc = (props: { mode: 'view' | 'handle'; index?: number }) => {
  const { record } = useModel('ketquaxettuyen');
  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      render: (val) => <div>{val + 1}</div>,
    },
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
      dataIndex: 'urlGiayTo',
      width: 300,
      align: 'center',
      hide: props.mode === 'handle',
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
    {
      title: 'File đính kèm',
      dataIndex: 'urlGiayTo',
      width: 200,
      align: 'center',
      fixed: 'right',
      hide: props.mode === 'view',
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={renderFileList(
            record?.thongTinXacNhanNhapHoc?.danhSachGiayToXacNhanNhapHoc?.find(
              (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
            )?.urlGiayTo ?? [],
          )}
          rules={recordGiayTo?.required ? [...rules.fileRequired] : []}
          name={['danhSachGiayToXacNhanNhapHoc', recordGiayTo?.index ?? 0, 'urlGiayTo']}
        >
          <Upload
            otherProps={{
              accept: 'application/pdf, image/png, .jpg',
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
            limit={5}
          />
        </Form.Item>
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
        columns={columns.filter((item) => item.hide !== true)}
        dataSource={record?.thongTinXacNhanNhapHoc?.danhSachGiayToXacNhanNhapHoc?.map(
          (item, index) => ({ ...item, index }),
        )}
      />
    </>
  );
};
