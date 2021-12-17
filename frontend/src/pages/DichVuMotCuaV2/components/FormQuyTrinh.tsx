/* eslint-disable no-underscore-dangle */
import { Setting, TrangThaiBuoc, TrangThaiThaoTac } from '@/utils/constants';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Timeline } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormBieuMau from './FormBieuMau';

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
  const access = useAccess();
  const {
    sinhVienGetTrangThaiDonModel,
    chuyenVienDieuPhoiGetTrangThaiDonModel,
    chuyenVienTiepNhanGetTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordDonThaoTac,
    recordDonThaoTac: recordDonThaoTacModel,
    setRecordTrangThaiDon,
    loading,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    adminGetTrangThaiDonModel,
    danhSachDonThaoTac,
    setDanhSachDonThaoTac,
  } = useModel('dichvumotcuav2');

  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const [checkLastStep, setCheckLastStep] = useState<boolean>(false);
  const lastStep = props?.record?.danhSachBuoc?.[props?.record?.danhSachBuoc?.length - 1 ?? 0];
  const [type, setType] = useState<string>('handle');
  useEffect(() => {
    if (props.idDon) {
      if (access.admin) adminGetTrangThaiDonModel(props.idDon);
      else if (access.sinhVien) sinhVienGetTrangThaiDonModel(props.idDon);
      else {
        if (arrPathName?.includes('quanlydondieuphoi'))
          chuyenVienDieuPhoiGetTrangThaiDonModel(props.idDon);
        else chuyenVienTiepNhanGetTrangThaiDonModel(props.idDon);
      }
    }
  }, [props.idDon]);

  useEffect(() => {
    return () => {
      setRecordTrangThaiDon([]);
      setDanhSachDonThaoTac([]);
    };
  }, []);

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
        const recordDonThaoTac = danhSachDonThaoTac?.find((item) => item.idBuoc === buoc._id);
        const IconBuoc = IconTrangThai?.[recordBuoc?.trangThai ?? 'ANY'];
        const isDonThaoTacOBuocCuoi = recordDonThaoTac?.idBuoc === lastStep?._id;
        return (
          <>
            <Timeline key={recordBuoc?._id} style={{ marginLeft: '-100px' }} mode="left">
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
                const checkThaoTac = thaoTac._id === recordDonThaoTac?.idThaoTac;
                const IconThaoTac = IconTrangThai?.[recordThaoTac?.trangThai ?? 'ANY'];
                return (
                  <Timeline.Item key={recordThaoTac?._id} dot={IconThaoTac}>
                    <b
                      style={{
                        color:
                          recordDonThaoTac &&
                          recordDonThaoTac?.trangThai === 'PENDING' &&
                          checkThaoTac
                            ? Setting.primaryColor
                            : '#000',
                      }}
                    >
                      {thaoTac?.tenThaoTac ?? ''}
                    </b>
                    <div>Đơn vị: {thaoTac?.tenDonVi || 'Đơn vị quản lý'}</div>
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
                        {recordDonThaoTac && checkThaoTac && (
                          <Button
                            onClick={() => {
                              setType('handle');
                              setRecordDonThaoTac(recordDonThaoTac);
                              setVisibleFormBieuMau(true);
                              setCheckLastStep(isDonThaoTacOBuocCuoi);
                            }}
                            style={{ padding: 0 }}
                            type="link"
                          >
                            Xử lý
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          {recordThaoTac?.updatedAt
                            ? `Vào lúc: ${moment(recordThaoTac?.updatedAt).format(
                                'HH:mm DD/MM/YYYY',
                              )}`
                            : ''}
                        </div>
                        {recordDonThaoTac && checkThaoTac && (
                          <Button
                            onClick={() => {
                              setType('view');
                              setRecordDonThaoTac(recordDonThaoTac);
                              setVisibleFormBieuMau(true);
                            }}
                            style={{ padding: 0 }}
                            type="link"
                          >
                            Chi tiết
                          </Button>
                        )}
                      </>
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
      {access.nhanVien && (
        <Modal
          destroyOnClose
          width="850px"
          footer={false}
          visible={visibleFormBieuMau}
          onCancel={() => {
            setVisibleFormBieuMau(false);
          }}
        >
          <FormBieuMau
            hideCamKet
            infoNguoiTaoDon={recordDonThaoTacModel?.nguoiTao}
            type={type}
            record={recordDonThaoTacModel?.idDon}
            traKetQua={checkLastStep}
          />
        </Modal>
      )}
    </Card>
  );
};

export default FormQuyTrinh;
