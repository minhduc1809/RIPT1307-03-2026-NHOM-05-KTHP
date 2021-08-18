import { getDataTinTuc } from '@/services/ant-design-pro/api';
import { EyeOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Col, Empty, Row, Tooltip, Typography } from 'antd';
import moment from 'moment';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { IRecordTinTuc } from './typings';

export default () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [record, setRecord] = useState<IRecordTinTuc.Result>();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const renderParagraph = (text: string, rows: number, style?: object) => (
    <Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
      {text}
    </Typography.Paragraph>
  );

  const handleView = (): void => {};

  // eslint-disable-next-line @typescript-eslint/ban-types
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderItem = (item: any, handleView: (item: any) => void, index: number): ReactNode => {
    switch (index) {
      case 0: {
        return (
          <Col md={24} lg={12} style={{ padding: 8, height: '100%' }}>
            <div className="tin-tuc-card" onClick={() => handleView(item)}>
              <img
                width="100%"
                height="100%"
                style={{ borderRadius: 12, marginBottom: 16 }}
                src={item?.anh_dai_dien ?? ''}
                alt="Ảnh minh họa"
              />
              <Tooltip placement="bottomLeft" title={item?.tieuDe ?? ''}>
                {renderParagraph(item?.tieuDe ?? '', 2, {
                  fontSize: 'calc(1em + 0.2vw)',
                  fontWeight: 500,
                  marginBottom: 14,
                  color: 'black',
                })}
              </Tooltip>
              {renderParagraph(item?.moTa ?? '', 2, {
                fontSize: 'calc(0.8em + 0.2vw)',
                color: '#364954',
              })}
            </div>
          </Col>
        );
      }
      case 1: {
        return (
          <Col md={24} lg={12} style={{ padding: '0 8px' }}>
            <Col span={24} style={{ margin: '8px 0' }}>
              <div className="tin-tuc-card" onClick={() => handleView(item)}>
                <Row>
                  <Col xs={8} md={5} lg={8} xl={7} xxl={6}>
                    <div className="tt-container-image">
                      <div
                        className="tin-tuc-image"
                        style={{
                          borderRadius: 12,
                          backgroundImage: `url("${item?.anh_dai_dien ?? ''}")`,
                          backgroundSize: 'auto 100%',
                          backgroundPositionX: '50%',
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={16} md={19} lg={16} xl={17} xxl={18} style={{ paddingLeft: 16 }}>
                    <Tooltip placement="bottomLeft" title={item?.tieuDe ?? ''}>
                      {renderParagraph(item?.tieuDe ?? '', 2, {
                        fontSize: 'calc(1em + 0.2vw)',
                        fontWeight: 500,
                        marginBottom: 6,
                        color: 'black',
                      })}
                    </Tooltip>
                    {renderParagraph(item?.moTa ?? '', 2, {
                      fontSize: 'calc(0.8em + 0.2vw)',
                      color: '#364954',
                      marginBottom: 0,
                    })}
                  </Col>
                </Row>
              </div>
            </Col>
          </Col>
        );
      }
      case 2: {
        return (
          // <Row style={{ padding: 8 }}>
          <Col lg={24} xl={12} style={{ padding: 8 }}>
            <div className="tin-tuc-card" onClick={() => handleView(item)}>
              <Row>
                <Col xs={8} sm={5}>
                  <div className="tt-container-image">
                    <div
                      className="tin-tuc-image"
                      style={{
                        borderRadius: 12,
                        backgroundImage: `url("${item?.anh_dai_dien ?? ''}")`,
                        backgroundSize: 'auto 100%',
                        backgroundPositionX: '50%',
                      }}
                    />
                  </div>
                </Col>
                <Col xs={16} sm={19} style={{ paddingLeft: 16 }}>
                  <Tooltip placement="bottomLeft" title={item?.tieuDe ?? ''}>
                    {renderParagraph(item?.tieuDe ?? '', 1, {
                      fontSize: 'calc(1em + 0.2vw)',
                      fontWeight: 500,
                      marginBottom: 10,
                      color: 'black',
                    })}
                  </Tooltip>
                  {renderParagraph(item?.moTa ?? '', 2, {
                    fontSize: 'calc(0.8em + 0.2vw)',
                    color: '#364954',
                  })}
                </Col>
              </Row>
            </div>
          </Col>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  const viewMore = (rc: IRecordTinTuc.Result) => {
    setVisibleDrawer(true);
    setRecord(rc);
  };

  const renderLast = (rc: IRecordTinTuc.Result) => (
    <>
      <Button onClick={() => viewMore(rc)} icon={<EyeOutlined />} />
    </>
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const columns: ProColumns<IRecordTinTuc.Result>[] = [
    {
      dataIndex: 'index',
      width: 80,
      title: 'Số thứ tự',
      align: 'center',
    },
    {
      dataIndex: 'display_name',
      width: 250,
      title: 'Tiêu đề',
      align: 'center',
    },
    {
      dataIndex: 'mo_ta',
      width: 250,
      title: 'Mô tả',
      align: 'center',
    },
    {
      dataIndex: 'avatar_path',
      width: 250,
      title: 'Ảnh đại diện',
      align: 'center',
      render: (_) => {
        return <img src={`https://dhs.aisenote.com/${_}`} width={50} height={50} />;
      },
    },
    {
      dataIndex: 'nguoi_dang',
      width: 200,
      title: 'Người đăng',
      align: 'center',
    },
    {
      dataIndex: 'ngay_dang',
      width: 100,
      title: 'Ngày đăng',
      align: 'center',
      render: (_, rc: ITinTuc) => <span>{moment(rc.ngay_dang).format('DD/MM/YYYY')}</span>,
    },
    {
      fixed: 'right',
      width: 200,
      title: 'Thao tác',
      search: false,
      align: 'center',
      render: (_, rc: ITinTuc) => renderLast(rc),
    },
  ];

  const [dataTinTuc, setdataTinTuc] = useState<IRecordTinTuc.RootObject>({});
  useEffect(() => {
    const getData = async () => {
      const res = await getDataTinTuc({});
      // console.log('res :>> ', res);
      setdataTinTuc(res);
    };
    getData();
  }, []);

  const dsTinTuc = dataTinTuc?.data?.result?.map((value, index) => ({
    ...value,
    index: index + 1,
  }));

  return (
    <Row>
      <Col span={24}>
        <Row>
          {!dsTinTuc?.length && (
            <Empty
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              imageStyle={{
                height: 60,
              }}
              description={<span>Không có tin nào</span>}
            ></Empty>
          )}
          <Row>
            {dsTinTuc?.map((item, index) => {
              if (index === 0) {
                return renderItem(item, handleView, 0);
              }
              if (index > 0 && index < 4) {
                return renderItem(item, handleView, 1);
              }
              return <></>;
            })}
          </Row>
          <Row>
            {dsTinTuc?.map((item, index) => {
              if (index > 3) {
                return renderItem(item, handleView, 2);
              }
              return <></>;
            })}
          </Row>
        </Row>
      </Col>
    </Row>
  );
};
