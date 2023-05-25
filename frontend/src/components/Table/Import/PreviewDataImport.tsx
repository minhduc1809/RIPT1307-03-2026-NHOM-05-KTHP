import { ArrowLeftOutlined, QuestionOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import { type IColumn } from '../typing';
import moment from 'moment';

const PreviewDataImport = (props: { onChange: () => void; onBack: any }) => {
  const { onChange, onBack } = props;
  const { importHeaders, matchedColumns, fileData, setDataImport, dataImport, startLine } =
    useModel('import');
  const [loading, setLoading] = useState(false);
  const columns: IColumn<any>[] = [
    {
      dataIndex: 'row',
      title: 'Thứ tự hàng',
      width: 80,
      align: 'center',
    },
    ...importHeaders?.map((item) => ({
      dataIndex: item.field,
      title: item.label,
      width: 120,
    })),
  ];

  const getData = () => {
    if (matchedColumns) {
      setLoading(true);
      const tempData: any = [];

      fileData?.forEach((row, index) => {
        const temp: any = { row: index + startLine };
        let valid = true;

        importHeaders?.every((col) => {
          const content = row[matchedColumns[col.field]];
          if (col.required && !content) {
            valid = false;
            return false;
          }
          switch (col.type) {
            case 'Boolean':
              temp[col.field] = content === 'Có';
              break;
            case 'Number':
              temp[col.field] = Number.parseFloat(content) || 0;
              break;
            case 'String':
              temp[col.field] = content?.toString();
              break;
            case 'Date':
              temp[col.field] = content ? moment(content, 'DD/MM/YYYY').toISOString() : undefined;
              break;
            default:
              temp[col.field] = content;
              break;
          }
          return true;
        });

        if (valid) tempData.push(temp);
      });
      setDataImport(tempData);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <div className="fw500">Danh sách dữ liệu từ tập tin</div>
        <i>Các dòng dữ liệu trống hoặc không thỏa mản yêu cầu bắt buộc đã bị loại bỏ</i>
      </Col>

      <Col span={24}>
        <TableStaticData
          columns={columns}
          data={dataImport ?? []}
          loading={loading}
          size="small"
          otherProps={{ bordered: true }}
          hasTotal
        />
      </Col>

      <Col span={24}>
        <Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
            Quay lại
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            onClick={() => onChange()}
            icon={<QuestionOutlined />}
            disabled={!dataImport?.length}
          >
            Kiểm tra dữ liệu
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default PreviewDataImport;
