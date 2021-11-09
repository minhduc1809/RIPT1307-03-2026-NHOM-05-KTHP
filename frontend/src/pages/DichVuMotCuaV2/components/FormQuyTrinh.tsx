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
}) => {
  const { getTrangThaiDonModel, recordTrangThaiDon } = useModel('dichvumotcuav2');
  useEffect(() => {
    if (props.idDon) {
      getTrangThaiDonModel(props.idDon);
    }
  }, [props.idDon]);

  return (
    <Card title={props.type === 'view' ? false : 'Quy trình'}>
      {props?.record?.danhSachBuoc?.map((buoc) => {
        const recordBuoc = recordTrangThaiDon?.find((item) => item.idBuoc === buoc._id);
        const IconBuoc = IconTrangThai?.[recordBuoc?.trangThai ?? 'ANY'];
        return (
          <>
            <Timeline style={{ marginLeft: '-100px' }} mode="left">
              <Timeline.Item
                dot={IconBuoc}
                label={
                  <div>
                    <b>{buoc?.ten ?? ''}</b>
                    <br />
                    <b>{TrangThaiBuoc?.[recordBuoc?.trangThai ?? 'Chưa cập nhật']}</b>
                  </div>
                }
              ></Timeline.Item>
              <br />
              {buoc?.danhSachThaoTac?.map((thaoTac) => {
                const recordThaoTac = recordBuoc?.danhSachThongKeThaoTac?.find(
                  (item) => item.idThaoTac === thaoTac._id,
                );
                const IconThaoTac = IconTrangThai?.[recordThaoTac?.trangThai ?? 'ANY'];
                return (
                  <Timeline.Item dot={IconThaoTac}>
                    <div>
                      Trạng thái: {TrangThaiThaoTac?.[recordThaoTac?.trangThai ?? 'Chưa cập nhật']}
                    </div>
                    <div>
                      Số ngày xử lý:{' '}
                      {thaoTac?.soNgayXuLy ? `${thaoTac?.soNgayXuLy} ngày` : 'Chưa cập nhật'}
                    </div>
                    <div>Đơn vị: {thaoTac?.tenDonVi}</div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </>
        );
      })}
    </Card>
  );
};

export default FormQuyTrinh;
