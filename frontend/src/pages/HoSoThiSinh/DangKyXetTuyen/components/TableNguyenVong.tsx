import { Setting } from '@/utils/constants';
import Icon, {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Divider, Modal, Popconfirm, Popover, Row, Table } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useModel } from 'umi';
import FormDangKyNguyenVong from '../FormDangKyNguyenVong';

const TableNguyenVong = () => {
  const {
    danhSachNguyenVong,
    setDanhSachNguyenVong,
    visibleFormNguyenVong,
    setVisibleFormNguyenVong,
    setEdit,
    setRecordNguyenVong,
  } = useModel('hosoxettuyen');

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

  const suaNguyenVong = (recordTemp: any) => {
    setRecordNguyenVong(recordTemp);
  };

  const xoaNguyenVong = (index: number) => {
    danhSachNguyenVong.splice(index - 1, 1);

    setIndexNV(-1);
    setDanhSachNguyenVong(
      danhSachNguyenVong?.map((item, indexTemp) => ({ ...item, index: indexTemp + 1 })),
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
  const styleRow: any = { textAlign: 'center', padding: '0px 10px 20px 10px' };
  const renderLast = (recordTemp: any, index: number) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <Button size="small" onClick={() => suaNguyenVong(recordTemp)} style={{ width: '100%' }}>
          <Icon type="form" />
          Chỉnh sửa
        </Button>
      </div>
      <div style={{ marginBottom: 10 }} />
      <Popconfirm
        placement="top"
        title="Bạn có chắc muốn xóa nguyện vọng?"
        onConfirm={() => xoaNguyenVong(index)}
        okText="Có"
        cancelText="Không"
      >
        <Button icon={<DeleteOutlined />} size="small" type="primary" style={{ width: '100%' }}>
          Xóa
        </Button>
      </Popconfirm>
      <div style={{ marginTop: 10 }}>
        <Button
          style={{ marginRight: 8 }}
          icon={<CaretUpOutlined />}
          size="small"
          onClick={() => upNguyenVong(index)}
          disabled={recordTemp?.soThuTu === 1}
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
  const columnsNV: any = [
    {
      title: 'STT',
      dataIndex: 'soThuTu',
      align: 'center',
      width: '80px',
    },
    {
      title: 'Tên ngành',
      dataIndex: 'tenNganh',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'toHopXetTuyen',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Điểm 3 môn của tổ hợp',
      render: (recordTemp: any) => {
        return recordTemp?.diemQuyDoi?.thanhPhan?.map(
          (item: any, index: number) =>
            index < 3 && (
              <div>
                {item?.tenThanhPhan}: {item?.diem}
              </div>
            ),
        );
      },
      align: 'center',
      width: '200px',
    },
    {
      title: 'Điểm ưu tiên',
      render: (recordTemp: any) => {
        return recordTemp?.diemQuyDoi?.thanhPhan?.map(
          (item: any, index: number) =>
            index > 2 && (
              <div>
                {item?.tenThanhPhan}: {item?.diem}
              </div>
            ),
        );
      },
      align: 'center',
      width: '120px',
    },
    {
      title: 'Điểm xét tuyển',
      dataIndex: 'diemQuyDoi.tongDiem',
      align: 'center',
      width: '120px',
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (recordTemp: any) => renderLast(recordTemp, recordTemp?.index),
    },
  ];

  return (
    <div style={{ marginBottom: 30 }}>
      <Divider plain>
        <b>Danh sách nguyện vọng</b>
      </Divider>
      <p style={{ margin: '12px 0px', color: Setting.primaryColor }}>
        Lưu ý: Thí sinh có thể thay đổi thứ tự nguyện vọng bằng cách click vào
        {window.screen.width > 991
          ? ' dấu ba chấm ở mỗi nguyện vọng và kéo thả theo ý muốn hoặc di chuột vào một nguyện vọng và click vào nút mũi tên lên hoặc xuống.'
          : ' nút mũi tên lên hoặc xuống ở cột thao tác đối với mỗi nguyện vọng'}
      </p>
      <Button
        disabled={danhSachNguyenVong?.length > 1}
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setVisibleFormNguyenVong(true);
          setEdit(false);
        }}
      >
        Thêm nguyện vọng
      </Button>

      <Row
        onMouseLeave={() => {
          setIndexNV(-1);
        }}
      >
        <Col xl={24} lg={24} md={0} xs={0} sm={0}>
          <Row>
            <Col span={3} style={styleHeader}>
              Thứ tự nguyện vọng
            </Col>
            <Col span={2} style={styleHeader}>
              Mã ngành
            </Col>
            <Col span={4} style={styleHeader}>
              Tên ngành
            </Col>
            <Col span={3} style={styleHeader}>
              Tổ hợp
            </Col>
            <Col span={4} style={styleHeader}>
              Điểm 3 môn của tổ hợp
            </Col>
            <Col span={6} style={styleHeader}>
              Điểm ưu tiên
            </Col>
            <Col span={2} style={styleHeader}>
              Điểm xét tuyển
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
                              <div
                                {...providedTemp.dragHandleProps}
                                style={{
                                  // width: '100%',
                                  textAlign: 'center',
                                  // position: 'absolute',
                                  // top: 3,
                                }}
                              >
                                <EllipsisOutlined />
                              </div>
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
                                    {_.get(item, 'soThuTu', 1)}
                                  </Col>
                                  <Col span={2} style={styleRow}>
                                    {_.get(item, 'maNganh', '')}
                                  </Col>
                                  <Col span={4} style={styleRow}>
                                    {_.get(item, 'tenNganh', '')}
                                  </Col>
                                  <Col span={3} style={{ ...styleRow }}>
                                    {_.get(item, 'toHopXetTuyen', '')}
                                  </Col>
                                  <Col span={4} style={styleRow}>
                                    {item?.diemQuyDoi?.thanhPhan?.map(
                                      (diem: any, indexTemp: number) =>
                                        indexTemp < 3 && (
                                          <div>
                                            {diem?.tenThanhPhan}: {diem?.diem}
                                          </div>
                                        ),
                                    )}
                                  </Col>
                                  <Col span={6} style={styleRow}>
                                    {item?.diemQuyDoi?.thanhPhan?.map(
                                      (diem: any, indexTemp: number) =>
                                        indexTemp > 2 && (
                                          <div>
                                            {diem?.tenThanhPhan}: {diem?.diem}
                                          </div>
                                        ),
                                    )}
                                  </Col>
                                  <Col span={2} style={styleRow}>
                                    {item?.diemQuyDoi?.tongDiem ?? ''}
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
        <Col xl={0} lg={0} md={24} xs={24} sm={24}>
          <Table
            size="small"
            columns={columnsNV}
            dataSource={danhSachNguyenVong}
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
