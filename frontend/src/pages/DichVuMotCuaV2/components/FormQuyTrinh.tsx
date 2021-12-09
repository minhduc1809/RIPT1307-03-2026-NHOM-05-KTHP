/* eslint-disable no-underscore-dangle */
import { TrangThaiBuoc, TrangThaiThaoTac } from '@/utils/constants';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Card, Timeline } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const IconTrangThai = {
  PENDING: (
    <PauseCircleOutlined
      style={{
        fontSize: '16px',
        color: 'gray',
      }}
    />
  ),
  OK: (
    <CheckCircleOutlined
      style={{
        fontSize: '16px',
        color: '#73d13d',
      }}
    />
  ),
  NOT_OK: (
    <CloseCircleOutlined
      style={{
        fontSize: '16px',
        color: '#d9363e',
      }}
    />
  ),
  PROCESSING: (
    <LoadingOutlined
      style={{
        fontSize: '16px',
        color: '#1890ff',
      }}
    />
  ),
  ANY: (
    <ClockCircleOutlined
      style={{
        fontSize: '16px',
        color: 'gray',
      }}
    />
  ),
};

const FormQuyTrinh = (props: {
  idDon?: string;
  record?: DichVuMotCuaV2.QuyTrinh;
  type?: string;
  thoiGianTaoDon?: string;
}) => {
  const {
    getTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordTrangThaiDon,
    loading,
    adminGetTrangThaiDonModel,
  } = useModel('dichvumotcuav2');

  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  useEffect(() => {
    if (props.idDon) {
      if (arrPathName?.includes('quanlydonadmin')) adminGetTrangThaiDonModel(props.idDon);
      else getTrangThaiDonModel(props.idDon);
    }
    return () => {
      setRecordTrangThaiDon([]);
    };
  }, [props.idDon]);

  return (
    <Card loading={loading} title={props?.type === 'view' ? false : 'Quy trình'}>
      {props?.type === 'view' && (
        <Timeline style={{ marginLeft: '-100px' }} mode="left">
          <Timeline.Item
            style={{ marginBottom: 20 }}
            dot={IconTrangThai?.OK}
            label={
              <div style={{ width: 200, float: 'right' }}>
                <b>
                  Tạo đơn thành công
                  {props?.thoiGianTaoDon
                    ? ` vào lúc ${moment(props?.thoiGianTaoDon).format('HH:mm DD/MM/YYYY')}`
                    : ''}
                </b>
              </div>
            }
          >
            <div style={{ height: 30 }} />
          </Timeline.Item>
          <Timeline.Item style={{ display: 'none' }}>
            <div style={{ height: 20 }} />
          </Timeline.Item>
        </Timeline>
      )}
      {props?.record?.danhSachBuoc?.map((buoc, index) => {
        const recordBuoc = recordTrangThaiDon?.find((item) => item.idBuoc === buoc._id);
        const IconBuoc = IconTrangThai?.[recordBuoc?.trangThai ?? 'ANY'];
        return (
          <>
            <Timeline style={{ marginLeft: '-100px' }} mode="left">
              <Timeline.Item
                style={{ marginBottom: 20 }}
                dot={IconBuoc}
                label={
                  <div style={{ width: 200, float: 'right' }}>
                    <b>{buoc?.ten ?? ''}</b>
                    <br />
                    <div>
                      Trạng thái: {TrangThaiBuoc?.[recordBuoc?.trangThai ?? ''] ?? 'Đang chờ'}
                    </div>
                  </div>
                }
              >
                <div style={{ height: 30 }} />
              </Timeline.Item>

              {buoc?.danhSachThaoTac?.map((thaoTac) => {
                const recordThaoTac = recordBuoc?.danhSachThongKeThaoTac?.find(
                  (item) => item.idThaoTac === thaoTac._id,
                );
                const IconThaoTac = IconTrangThai?.[recordThaoTac?.trangThai ?? 'ANY'];
                return (
                  <Timeline.Item dot={IconThaoTac}>
                    <b>{thaoTac?.tenThaoTac ?? ''}</b>
                    <div>Đơn vị: {thaoTac?.tenDonVi ?? ''}</div>
                    <div>
                      Trạng thái:{' '}
                      {TrangThaiThaoTac?.[recordThaoTac?.trangThai ?? ''] ?? 'Chưa xử lý'}
                    </div>
                    {!['OK', 'NOT_OK'].includes(recordThaoTac?.trangThai ?? '') ? (
                      <div>
                        {recordThaoTac?.hanXuLy ? (
                          <div>
                            Hạn xử lý: {moment(recordThaoTac?.hanXuLy)?.format('DD/MM/YYYY')}
                          </div>
                        ) : (
                          <div>
                            Số ngày xử lý:{' '}
                            {thaoTac?.soNgayXuLy ? `${thaoTac?.soNgayXuLy} ngày` : 'Chưa cập nhật'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {recordThaoTac?.updatedAt
                          ? `Vào lúc: ${moment(recordThaoTac?.updatedAt).format(
                              'HH:mm DD/MM/YYYY',
                            )}`
                          : ''}
                      </div>
                    )}
                  </Timeline.Item>
                );
              })}
              {index !== (props.record?.danhSachBuoc?.length ?? 0) - 1 && (
                <Timeline.Item style={{ display: 'none' }}>
                  <div style={{ height: 20 }} />
                </Timeline.Item>
              )}
            </Timeline>
          </>
        );
      })}
    </Card>
  );
};

export default FormQuyTrinh;
