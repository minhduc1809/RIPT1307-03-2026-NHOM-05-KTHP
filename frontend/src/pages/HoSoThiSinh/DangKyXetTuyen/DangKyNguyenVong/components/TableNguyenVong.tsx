import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import { calculateLuaChonToHopVaHienThiDiemQuyDoi, tongDiemUuTien } from '@/utils/utils';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Divider, Modal, Popconfirm, Popover, Row, Table, Tooltip } from 'antd';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useModel } from 'umi';
import FormDangKyNguyenVong from './FormDangKyNguyenVong';

const TableNguyenVong = () => {
  const {
    danhSachNguyenVong,
    setDanhSachNguyenVong,
    visibleFormNguyenVong,
    setVisibleFormNguyenVong,
    setEdit,
    setRecordNguyenVong,
    recordHoSo,
  } = useModel('hosoxettuyen');

  const { record: recordDot } = useModel('dottuyensinh');
  const { hienThiDiemQuyDoi, luaChonToHop } = calculateLuaChonToHopVaHienThiDiemQuyDoi(
    recordHoSo?.maDoiTuong ?? [],
    recordDot?.danhSachDoiTuongTuyenSinh ?? [],
  );
  const [indexNV, setIndexNV] = useState<number>(-1);
  const PopoverDiv = styled.div`
    &:hover {
      border-left: 4px solid #d50000 !important;
    }
  `;
  const onDragEnd = (res: any) => {
    const { destination, source } = res;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const tmp = JSON.parse(JSON.stringify(danhSachNguyenVong[source.index]));

    danhSachNguyenVong.splice(source.index, 1);

    danhSachNguyenVong.splice(destination.index, 0, tmp);

    setDanhSachNguyenVong(
      danhSachNguyenVong?.map((item, index) => ({ ...item, soThuTu: index + 1 })),
    );
  };

  const upNguyenVong = (index: number) => {
    const temp = danhSachNguyenVong[index - 1];
    danhSachNguyenVong[index - 1] = danhSachNguyenVong[index];
    danhSachNguyenVong[index] = temp;
    setIndexNV(index);
    setDanhSachNguyenVong(
      danhSachNguyenVong?.map((item, indexTemp) => ({ ...item, soThuTu: indexTemp + 1 })),
    );
  };

  const downNguyenVong = (index: number) => {
    const temp = danhSachNguyenVong[index];
    danhSachNguyenVong[index] = danhSachNguyenVong[index + 1];
    danhSachNguyenVong[index + 1] = temp;
    setIndexNV(index);
    setDanhSachNguyenVong(
      danhSachNguyenVong?.map((item, indexTemp) => ({ ...item, soThuTu: indexTemp + 1 })),
    );
  };

  const suaNguyenVong = (recordNguyenVong: HoSoXetTuyen.NguyenVong) => {
    setRecordNguyenVong(recordNguyenVong);
    setVisibleFormNguyenVong(true);
    setEdit(true);
  };

  const xoaNguyenVong = (index: number) => {
    danhSachNguyenVong.splice(index, 1);
    setIndexNV(-1);
    setDanhSachNguyenVong(
      danhSachNguyenVong?.map((item, indexTemp) => ({ ...item, soThuTu: indexTemp + 1 })),
    );
  };

  const handleVisibleChange = (index: number) => {
    setIndexNV(index);
  };

  const styleHeader: any = {
    textAlign: 'center',
    padding: '20px 10px',
    backgroundColor: '#FAFAFA',
    fontWeight: 'bold',
    height: 105,
  };
  const styleRow: any = {
    textAlign: 'center',
    margin: 'auto auto',
    padding: '10px 10px 10px 10px',
  };

  const renderLast = (recordNguyenVong: HoSoXetTuyen.NguyenVong, index: number) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <Tooltip title="Chỉnh sửa">
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => suaNguyenVong(recordNguyenVong)}
          />
        </Tooltip>
        <Tooltip title="Xóa">
          <Popconfirm
            placement="top"
            title="Bạn có chắc muốn xóa nguyện vọng?"
            onConfirm={() => xoaNguyenVong(index)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} size="small" type="primary" />
          </Popconfirm>
        </Tooltip>
      </div>

      <div style={{ marginTop: 10 }}>
        <Button
          style={{ marginRight: 8 }}
          icon={<CaretUpOutlined />}
          size="small"
          onClick={() => upNguyenVong(index)}
          disabled={recordNguyenVong?.soThuTu === 1}
        />
        <Button
          icon={<CaretDownOutlined />}
          size="small"
          onClick={() => downNguyenVong(index)}
          disabled={index === danhSachNguyenVong.length - 1}
        />
      </div>
    </div>
  );
  const columnsNV: IColumn<HoSoXetTuyen.NguyenVong>[] = [
    {
      title: 'TT',
      dataIndex: 'soThuTu',
      align: 'center',
      width: '60px',
      render: (val, record) => (
        <div style={{ color: record?.wrong ? 'red' : '#000000D9' }}>{val}</div>
      ),
    },
    {
      title: 'Mã ngành',
      dataIndex: 'maNganhChuyenNganh',
      align: 'center',
      width: '100px',
      render: (val, record) => (
        <div style={{ color: record?.wrong ? 'red' : '#000000D9' }}>{val}</div>
      ),
    },
    {
      title: 'Tên ngành',
      dataIndex: 'tenNganhChuyenNganh',
      align: 'center',
      width: '150px',
      render: (val, record) => (
        <div style={{ color: record?.wrong ? 'red' : '#000000D9', whiteSpace: 'normal' }}>
          {val}
        </div>
      ),
    },
    {
      title: 'Cơ sở đào tạo',
      align: 'center',
      width: '150px',
      render: (nguyenVong) => (
        <div style={{ color: nguyenVong?.wrong ? 'red' : '#000000D9', whiteSpace: 'normal' }}>
          {nguyenVong?.coSoDaoTao?.ten || nguyenVong?.tenCoSoDaoTao}
        </div>
      ),
    },
    {
      title: 'Đối tượng xét tuyển',
      dataIndex: 'tenDoiTuong',
      align: 'center',
      width: '150px',
      render: (val, record) => (
        <div style={{ color: record?.wrong ? 'red' : '#000000D9', whiteSpace: 'normal' }}>
          {val}
        </div>
      ),
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'toHopXetTuyen',
      align: 'center',
      width: '60px',
      hide: !luaChonToHop,
      render: (val, record) => (
        <div style={{ color: record?.wrong ? 'red' : '#000000D9' }}>{val}</div>
      ),
    },
    {
      title: 'Điểm xét tuyển chưa có ưu tiên',
      dataIndex: ['diemQuyDoi', 'thanhPhan'],
      align: 'center',
      width: '100px',
      hide: !hienThiDiemQuyDoi,
      render: (val: HoSoXetTuyen.ThanhPhanDiemQuyDoi[], record) => {
        const hienThiDiemQuyDoiTemp = recordDot?.danhSachDoiTuongTuyenSinh?.find(
          (item) => item.maDoiTuong === record?.maDoiTuong,
        )?.hienThiDiemQuyDoi;
        const diem = record?.diemQuyDoi?.tongDiem
          ? record.diemQuyDoi.tongDiem - tongDiemUuTien(val)
          : 0;
        if (hienThiDiemQuyDoiTemp) {
          return (
            <div style={{ color: record?.wrong ? 'red' : '#000000D9' }}>{diem?.toFixed(2)}</div>
          );
        } else return <div />;
      },
    },
    {
      title: 'Điểm xét tuyển có ưu tiên',
      dataIndex: ['diemQuyDoi', 'tongDiem'],
      align: 'center',
      width: '100px',
      hide: !hienThiDiemQuyDoi,
      render: (val, record) => {
        const hienThiDiemQuyDoiTemp = recordDot?.danhSachDoiTuongTuyenSinh?.find(
          (item) => item.maDoiTuong === record?.maDoiTuong,
        )?.hienThiDiemQuyDoi;
        return (
          <div style={{ color: record?.wrong ? 'red' : '#000000D9' }}>
            {hienThiDiemQuyDoiTemp ? val : ''}
          </div>
        );
      },
    },
    {
      title: 'Chi tiết thành phần',
      dataIndex: ['diemQuyDoi', 'thanhPhan'],
      hide: !hienThiDiemQuyDoi,
      render: (val: HoSoXetTuyen.ThanhPhanDiemQuyDoi[], record) => {
        const hienThiDiemQuyDoiTemp = recordDot?.danhSachDoiTuongTuyenSinh?.find(
          (item) => item.maDoiTuong === record?.maDoiTuong,
        )?.hienThiDiemQuyDoi;
        return hienThiDiemQuyDoiTemp ? (
          val
            ?.filter((item) => item?.tenThanhPhan)
            ?.map((item) => (
              <div style={{ color: record?.wrong ? 'red' : '#000000D9' }} key={item?._id}>
                {item?.tenThanhPhan}: {item?.diem ?? 0}
              </div>
            ))
        ) : (
          <div />
        );
      },
      align: 'center',
      // width: '120px',
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (recordTemp: HoSoXetTuyen.NguyenVong) =>
        renderLast(recordTemp, recordTemp?.soThuTu - 1),
    },
  ];

  return (
    <div style={{ marginBottom: 30 }}>
      <Divider plain>
        <b>Danh sách nguyện vọng</b>
      </Divider>
      <p style={{ margin: '12px 0px', color: 'red' }}>
        Lưu ý: Thí sinh có thể thay đổi thứ tự nguyện vọng bằng cách click vào nút mũi tên lên hoặc
        xuống ở cột thao tác đối với mỗi nguyện vọng
      </p>
      <Button
        disabled={
          recordDot?.soLuongNguyenVongToiDa
            ? danhSachNguyenVong?.length >= recordDot.soLuongNguyenVongToiDa
            : false
        }
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setVisibleFormNguyenVong(true);
          setEdit(false);
          setRecordNguyenVong(undefined);
        }}
        style={{ marginBottom: '8px' }}
      >
        Thêm nguyện vọng
      </Button>

      <Row
        onMouseLeave={() => {
          setIndexNV(-1);
        }}
      >
        <Col xl={0} lg={0} md={0} xs={0} sm={0}>
          <Row>
            <Col span={3} style={styleHeader}>
              Thứ tự nguyện vọng
            </Col>
            <Col span={2} style={styleHeader}>
              Mã ngành
            </Col>
            <Col span={3} style={styleHeader}>
              Tên ngành
            </Col>
            <Col span={2} style={styleHeader}>
              Tổ hợp
            </Col>
            <Col span={3} style={styleHeader}>
              Điểm xét tuyển chưa có ưu tiên
            </Col>
            <Col span={3} style={styleHeader}>
              Điểm xét tuyển có ưu tiên
            </Col>
            <Col span={6} style={styleHeader}>
              Chi tiết thành phần
            </Col>
            <Col span={2} style={styleHeader}>
              {' '}
            </Col>
          </Row>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="khaosat">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {danhSachNguyenVong.map((item, index: number) => {
                    return (
                      <Draggable draggableId={index.toString()} index={index} key={index}>
                        {(providedTemp: any) => (
                          <div {...providedTemp.draggableProps} ref={providedTemp.innerRef}>
                            <PopoverDiv
                              style={{
                                borderLeft:
                                  index === indexNV ? '4px solid #D50000' : '4px solid transparent',
                              }}
                            >
                              <Popover
                                content={renderLast(item, indexNV)}
                                placement="right"
                                trigger="hover"
                                visible={index === indexNV}
                                onVisibleChange={() => handleVisibleChange(index)}
                              >
                                <Row
                                  style={{
                                    borderBottom: '1px solid black',
                                    color: item?.wrong ? '#D50000' : undefined,
                                    fontWeight: item?.wrong ? 'bold' : undefined,
                                  }}
                                >
                                  <Col span={3} style={{ ...styleRow }}>
                                    {item?.soThuTu ?? 1}
                                  </Col>
                                  <Col span={2} style={styleRow}>
                                    {item?.maNganhChuyenNganh ?? ''}
                                  </Col>
                                  <Col span={3} style={styleRow}>
                                    {item?.tenNganhChuyenNganh ?? ''}
                                  </Col>
                                  <Col span={2} style={{ ...styleRow }}>
                                    {item?.toHopXetTuyen ?? ''}
                                  </Col>
                                  <Col span={3} style={styleRow}>
                                    {item?.diemQuyDoi?.thanhPhan[0]?.diem ?? ''}
                                  </Col>
                                  <Col span={3} style={styleRow}>
                                    {item?.diemQuyDoi?.tongDiem ?? ''}
                                  </Col>
                                  <Col span={6} style={styleRow}>
                                    {item?.diemQuyDoi?.thanhPhan?.map(
                                      (diem: { tenThanhPhan: string; diem: number }) => (
                                        <div key={diem.tenThanhPhan}>
                                          {diem?.tenThanhPhan}: {diem?.diem}
                                        </div>
                                      ),
                                    )}
                                  </Col>
                                  <Col
                                    span={2}
                                    {...providedTemp.dragHandleProps}
                                    style={{
                                      ...styleRow,
                                      fontSize: '20px',
                                    }}
                                  >
                                    <EllipsisOutlined />
                                  </Col>
                                </Row>
                              </Popover>
                            </PopoverDiv>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
      </Row>
      <Row>
        <Col xl={24} lg={24} md={24} xs={24} sm={24}>
          <Table
            pagination={false}
            size="small"
            columns={columnsNV?.filter((item) => item?.hide !== true)}
            dataSource={danhSachNguyenVong?.map((item) => item)}
            scroll={{ x: 1000 }}
          />
        </Col>
      </Row>
      <Modal
        footer={false}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setVisibleFormNguyenVong(false)}
        visible={visibleFormNguyenVong}
        closable
        destroyOnClose
      >
        <FormDangKyNguyenVong />
      </Modal>
    </div>
  );
};

export default TableNguyenVong;
