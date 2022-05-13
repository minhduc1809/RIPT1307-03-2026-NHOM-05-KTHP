import Upload from '@/components/Upload/UploadMultiFile';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Modal, Table, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';

const TableGiayTo = (props: {
  fieldName: 'danhSachGiayToNop' | 'danhSachGiayToNopOnline';
  fieldData: 'danhSachGiayToCanNop' | 'danhSachGiayToCanNopOnline';
  mode: 'view' | 'submit' | 'handle';
}) => {
  const { record } = useModel('huongdannhaphoc');
  const { record: recordKetQua } = useModel('ketquaxettuyen');
  const styleFormItem = {
    marginBottom: 0,
  };
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
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 80,
      align: 'center',
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 80,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
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
      width: 150,
      align: 'center',
      hide: props.mode !== 'handle',
      fixed: 'right',
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <Form.Item
          style={styleFormItem}
          initialValue={
            recordKetQua?.[props.fieldName]?.find(
              (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
            )?.soLuongTiepNhan
          }
          rules={recordGiayTo?.required ? [...rules.required] : []}
          name={[props.fieldName, recordGiayTo?.index ?? 0, 'soLuongTiepNhan']}
        >
          <InputNumber placeholder="Số lượng" min={0} max={100} />
        </Form.Item>
      ),
    },
    {
      title: 'Số lượng tiếp nhận',
      dataIndex: 'soLuongTiepNhan',
      width: 150,
      align: 'center',
      hide: !['submit', 'view'].includes(props.mode),
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <div>
          {
            recordKetQua?.[props.fieldName]?.find(
              (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
            )?.soLuongTiepNhan
          }
        </div>
      ),
    },
    {
      title: 'Ghi chú tiếp nhận',
      dataIndex: 'ghiChuTiepNhan',
      width: 250,
      align: 'center',
      fixed: 'right',
      hide: props.mode !== 'handle',
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <Form.Item
          style={styleFormItem}
          initialValue={
            recordKetQua?.[props.fieldName]?.find(
              (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
            )?.ghiChuTiepNhan
          }
          rules={[...rules.text]}
          name={[props.fieldName, recordGiayTo?.index ?? 0, 'ghiChuTiepNhan']}
        >
          <Input placeholder="Ghi chú (nếu có)" min={0} max={100} />
        </Form.Item>
      ),
    },
    {
      title: 'Ghi chú tiếp nhận',
      dataIndex: 'ghiChuTiepNhan',
      width: 250,
      align: 'center',
      hide: !['submit', 'view'].includes(props.mode),
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <div>
          {
            recordKetQua?.[props.fieldName]?.find(
              (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
            )?.ghiChuTiepNhan
          }
        </div>
      ),
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlGiayToNop',
      width: 200,
      align: 'center',
      fixed: 'right',
      hide: props.mode === 'view',
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) =>
        recordGiayTo?.requiredOnline ? (
          <Form.Item
            style={styleFormItem}
            initialValue={renderFileList(
              recordKetQua?.[props.fieldName]?.find(
                (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
              )?.urlGiayToNop ?? [],
            )}
            rules={recordGiayTo?.required ? [...rules.fileRequired] : []}
            name={[props.fieldName, recordGiayTo?.index ?? 0, 'urlGiayToNop']}
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
        ) : (
          <div>Nộp bản cứng</div>
        ),
    },
    {
      title: 'File đính kèm',
      width: 200,
      align: 'center',
      hide: props.mode === 'submit' || props.mode === 'handle',
      fixed: 'right',
      render: (recordGiayTo: DotTuyenSinh.GiayTo) => {
        const urlGiayTo: string[] =
          recordKetQua?.[props.fieldName]?.find(
            (item: DotTuyenSinh.GiayTo) => item.maGiayTo === recordGiayTo.maGiayTo,
          )?.urlGiayToNop ?? [];

        return (
          <div>
            {recordGiayTo?.requiredOnline ? (
              <div>
                {urlGiayTo?.map((item, index) => (
                  <a key={item} href={item} target="_blank" rel="noreferrer">
                    <Tag style={{ marginTop: 8 }} color={Setting.primaryColor}>{`Xem tập tin ${
                      index + 1
                    }  `}</Tag>
                  </a>
                ))}
              </div>
            ) : (
              <div>Nộp bản cứng</div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      scroll={{ x: 1300 }}
      size="small"
      pagination={false}
      columns={columns?.filter((item) => item?.hide !== true)}
      dataSource={record?.[props.fieldData]?.map((item: DotTuyenSinh.GiayTo, index: number) => ({
        ...item,
        index,
      }))}
    />
  );
};

export default TableGiayTo;
