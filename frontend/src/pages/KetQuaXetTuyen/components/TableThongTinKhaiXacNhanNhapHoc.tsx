import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { ETrangThaiXacNhanNhapHoc, Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Table, Tag, Tooltip, Form, Input } from 'antd';

import { useModel } from 'umi';

const { Item } = Descriptions;

export const TableThongTinKhaiXacNhanNhapHoc = (props: {
  mode: 'view' | 'handle';
  index?: number;
}) => {
  const { record } = useModel('ketquaxettuyen');
  const { record: recordDotTuyenSinh } = useModel('dottuyensinh');
  const columns: IColumn<KetQuaXetTuyen.ThongTinKhaiXacNhan>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      render: (val) => <div>{val + 1}</div>,
    },
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
                        {recordThongTin?.urlHuongDan?.length ? (
                          <div>File hướng dẫn đính kèm:</div>
                        ) : (
                          <div />
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
      hide: props.mode === 'handle',
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      width: 300,
      align: 'center',
      hide: props.mode === 'view',
      render: (val, recordThongTin) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          rules={recordThongTin.required ? [...rules.required, ...rules.text] : [...rules.text]}
          initialValue={val}
          name={['danhSachThongTinKhaiXacNhan', recordThongTin.index, 'noiDung']}
        >
          <Input placeholder="Nhập thông tin" />
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
        columns={columns.filter((item) => item.hide !== true)}
        dataSource={
          [
            ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN,
            ETrangThaiXacNhanNhapHoc.KHONG_XAC_NHAN,
          ].includes(
            record?.thongTinXacNhanNhapHoc?.trangThaiXacNhan ??
              ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN,
          )
            ? recordDotTuyenSinh?.danhSachThongTinKhaiXacNhan?.map((item, index) => ({
                ...item,
                index,
              }))
            : record?.thongTinXacNhanNhapHoc?.danhSachThongTinKhaiXacNhan?.map((item, index) => ({
                ...item,
                index,
              }))
        }
      />
    </>
  );
};
