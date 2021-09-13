import { Card, List } from 'antd';

const HocLieuSo = () => {
  const data = [
    {
      title: 'Bài 1',
    },
    {
      title: 'Bài 2',
    },
    {
      title: 'Bài 3',
    },
    {
      title: 'Bài 4',
    },
  ];

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Card hoverable title={<b>{item.title}</b>}>
            <div
              style={{ marginTop: 10 }}
              dangerouslySetInnerHTML={{
                __html:
                  "<iframe src='https://dhs.aisenote.com/website_scorm_elearning/static/media/scorm/b1/res/index.html' allowFullScreen='true' width='100%' height='500px' frameborder='0'></iframe>",
              }}
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default HocLieuSo;
