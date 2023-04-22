import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableBaseStatic from '../Table';

const PreviewDataImport = (props: { onChange: () => void; onBack: any; modelName: any }) => {
  const { onChange, onBack, modelName } = props;
  const { columns, matchedColumns, fileData } = useModel('import');
  const model = useModel(modelName);
  const [dataImport, setDataImport] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  const getData = () => {
    if (matchedColumns) {
      setLoading(true);
      const tempData: any = [];

      fileData?.forEach((row) => {
        const temp: any = {};
        let valid = true;

        columns.every((col) => {
          const content = row[matchedColumns[col.dataIndex as string]];
          if (col.importRequired && !content) {
            valid = false;
            return false;
          }
          temp[col.dataIndex as string] = content;
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

  const handleImport = () => {
    // Do Import
    if (onChange) onChange();
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <div className="fw500">Danh sách dữ liệu hợp lệ</div>
        <i>Các dòng dữ liệu trống hoặc không hợp lệ đã bị loại bỏ</i>
      </Col>

      <Col span={24}>
        <TableBaseStatic columns={columns} addStt data={dataImport} loading={loading} />
      </Col>

      <Col span={24}>
        <Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
            Quay lại
          </Button>
          <Popconfirm title="Xác nhận lưu dữ liệu đã xử lý?" onConfirm={handleImport}>
            <Button htmlType="submit" type="primary">
              Lưu dữ liệu
            </Button>
          </Popconfirm>
        </Space>
      </Col>
    </Row>
  );
};

export default PreviewDataImport;
