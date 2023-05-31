import { ArrowLeftOutlined, QuestionOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import { type TImportHeader, type IColumn } from '../typing';
import moment from 'moment';
import ExpandText from '@/components/ExpandText';

const PreviewDataImport = (props: {
  onChange: () => void;
  onBack: any;
  importHeaders: TImportHeader[];
}) => {
  const { onChange, onBack, importHeaders } = props;
  const { matchedColumns, fileData, setDataImport, dataImport, startLine } = useModel('import');
  const [hasInvalid, setHasInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const invalidText = 'Dữ liệu không hợp lệ';

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
      width: item.type === 'String' ? 120 : 90,
      align: (item.type === 'String' ? 'left' : 'center') as any,
      render: (val: any) =>
        val === invalidText ? (
          <i style={{ color: 'red' }}>{val}</i>
        ) : item.type === 'Boolean' ? (
          <Checkbox checked={!!val} />
        ) : item.type === 'Date' && val ? (
          moment(val).format('DD/MM/YYYY')
        ) : item.type === 'String' ? (
          <ExpandText>{val}</ExpandText>
        ) : (
          val
        ),
    })),
  ];

  const getData = () => {
    if (matchedColumns) {
      setLoading(true);
      const tempData: any = [];
      let tmp;

      fileData?.forEach((row, index) => {
        const temp: any = { row: index + startLine };
        const valid = true;

        importHeaders?.every((col) => {
          const content = row[matchedColumns[col.field]]?.toString()?.trim();
          // if (col.required && !content) {
          //   valid = false;
          //   return false;
          // }

          if (content) {
            switch (col.type) {
              case 'Boolean':
                temp[col.field] = content === 'Có' || content === '1' || content === 'x';
                break;
              case 'Number':
                tmp = Number.parseFloat(content) || invalidText;
                temp[col.field] = tmp;
                if (tmp === invalidText) setHasInvalid(true);
                break;
              // case 'String':
              //   temp[col.field] = content?.toString();
              //   break;
              case 'Date':
                tmp =
                  moment(content, 'DD/MM/YYYY').toISOString() ||
                  moment(content, 'D/M/YYYY').toISOString() ||
                  moment.unix(Number.parseInt(content)).toISOString() ||
                  moment(content).toISOString() ||
                  invalidText;
                temp[col.field] = tmp;
                if (tmp === invalidText) setHasInvalid(true);
                break;
              default:
                temp[col.field] = content;
                break;
            }
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
        {hasInvalid ? (
          <i style={{ color: 'red' }}>Có cột dữ liệu không hợp lệ, vui lòng kiểm tra lại!</i>
        ) : null}
      </Col>

      <Col span={24}>
        <TableStaticData
          columns={columns}
          data={dataImport ?? []}
          loading={loading}
          size="small"
          otherProps={{ bordered: true, rowKey: (rec: any) => rec.row }}
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
            disabled={!dataImport?.length || hasInvalid}
          >
            Kiểm tra dữ liệu
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default PreviewDataImport;
