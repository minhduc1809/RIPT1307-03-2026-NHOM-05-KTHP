import { useModel } from 'umi';
import { FormItem } from '@/components/FormItem';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { renderFileList } from '@/utils/utils';
import { Modal, Table, Tag, Tooltip } from 'antd';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Setting } from '@/utils/constants';

const TableGiayToXacNhanNhapHoc = () => {
  const { record } = useModel('dottuyensinh');
  const { record: recordKetQua } = useModel('ketquaxettuyen');
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
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 80,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlGiayTo',
      width: 200,
      align: 'center',
      render: (val, recordGiayTo: DotTuyenSinh.GiayTo) => (
        <FormItem
          initialValue={renderFileList(
            recordKetQua?.thongTinXacNhanNhapHoc?.danhSachGiayToXacNhanNhapHoc?.find(
              (item) => item.maGiayTo === recordGiayTo.maGiayTo,
            )?.urlGiayTo ?? [],
          )}
          rules={recordGiayTo?.required ? [...rules.fileRequired] : []}
          name={['danhSachGiayToXacNhanNhapHoc', recordGiayTo?.index ?? 0]}
        >
          <Upload
            otherProps={{
              accept: 'application/pdf, image/png, .jpg',
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
            limit={5}
          />
        </FormItem>
      ),
    },
  ];

  return (
    <Table
      pagination={false}
      columns={columns?.filter((item) => item?.hide !== true)}
      dataSource={record?.danhSachGiayToXacNhanNhapHoc?.map((item, index) => ({ ...item, index }))}
    />
  );
};

export default TableGiayToXacNhanNhapHoc;
