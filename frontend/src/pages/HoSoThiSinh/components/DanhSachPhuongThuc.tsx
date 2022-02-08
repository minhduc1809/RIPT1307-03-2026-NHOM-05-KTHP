import { ContainerOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, List, Modal, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { history } from 'umi';

const DanhSachPhuongThuc = (props: {
  location: {
    query: {
      idDot: string;
    };
  };
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>();
  const data = [
    {
      content:
        'Phương thức xét tuyển dựa trên kết quả học tập THPT dành cho thí sinh tham gia thi HSG quốc gia (hoặc tham gia cuộc thi KHKT quốc gia thuộc lĩnh vực phù hợp với tổ hợp điểm xét tuyển của trường), đạt giải HSG cấp tỉnh/thành phố lớp 11 hoặc lớp 12 và thí sinh thuộc hệ chuyên của trường THPT trọng điểm quốc gia/THPT chuyên (theo Thông tư 06/2012/TT-BGDĐT)',
    },
    {
      content:
        'Phương thức xét tuyển kết hợp giữa Chứng chỉ Ngoại ngữ quốc tế và kết quả học tập THPT dành cho thí sinh hệ chuyên và hệ không chuyên áp dụng cho các chương trình giảng dạy bằng tiếng Anh và các chương trình Chất lượng cao ngành Ngôn ngữ',
    },
    {
      content:
        'Phương thức xét tuyển kết hợp giữa chứng chỉ Ngoại ngữ quốc tế và kết quả thi tốt nghiệp THPT năm 2022',
    },
    {
      content:
        'Phương thức xét tuyển dựa trên kết quả thi tốt nghiệp THPT năm 2021 theo các tổ hợp môn xét tuyển',
    },
    {
      content:
        'Phương thức xét tuyển dựa trên kết quả các kỳ thi ĐGNL do ĐHQG Hà Nội và ĐHQG tpHCM tổ chức trong năm 2022',
    },
    {
      content: 'Phương thức xét tuyển thẳng năm 2022',
    },
  ];

  return (
    <>
      <Card
        title={
          <Breadcrumb>
            <Breadcrumb.Item href="/hosothisinh/dottuyensinh">
              <ContainerOutlined />
              <span>Đợt {props.location.query.idDot} năm 2022</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Danh sách phương thức xét tuyển</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                style={{
                  boxShadow:
                    '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)',
                }}
                actions={[
                  <Tooltip key={2} title="Đăng ký xét tuyển">
                    <EditOutlined
                      onClick={() => {
                        history.push({
                          pathname: '/hosothisinh/dottuyensinh/phuongthuctuyensinh',
                          query: {
                            idDot: props.location.query.idDot,
                            idPhuongThuc: (index + 1).toString(),
                          },
                        });
                      }}
                      key="edit"
                    />
                  </Tooltip>,
                  <Tooltip key={1} title="Xem hướng dẫn">
                    <PlayCircleOutlined
                      onClick={() => {
                        setRecord(item);
                        setVisible(true);
                      }}
                      key="setting"
                    />
                  </Tooltip>,
                ]}
                hoverable
                bodyStyle={{
                  height: 120,
                }}
                title={`Phương thức ${index + 1}`}
              >
                <Typography.Paragraph
                  style={{ marginBottom: 0, textAlign: 'justify' }}
                  ellipsis={{ rows: 3, expandable: false }}
                >
                  {item.content}
                </Typography.Paragraph>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: record?.htmlContent ?? '' }} />
      </Modal>
    </>
  );
};

export default DanhSachPhuongThuc;
