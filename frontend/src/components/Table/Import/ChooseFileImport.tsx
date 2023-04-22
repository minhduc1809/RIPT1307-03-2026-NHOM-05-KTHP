import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Select, Space, message } from 'antd';
import { pick } from 'lodash';
import { useState } from 'react';
import { useModel } from 'umi';
import * as XLSX from 'xlsx';

const ChooseFileImport = (props: { onChange: () => void; onCancel: any }) => {
  const { onChange, onCancel } = props;
  const { setHeadLine, setFileData } = useModel('import');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook>();
  const [sheetNames, setSheetNames] = useState<string[]>();
  const [form] = Form.useForm();

  const indexToExcelColumn = (num: number) => {
    let letters = '';
    while (num >= 0) {
      letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
      // eslint-disable-next-line no-param-reassign
      num = Math.floor(num / 26) - 1;
    }
    return letters;
  };

  const getWorksheets = (data: any) => {
    const wb = XLSX.read(data, { type: 'binary' });
    setWorkbook(wb);
    const sheets = wb.SheetNames;
    setSheetNames(sheets);
    form.setFieldsValue({ sheet: sheets[0] });
  };

  const onChangeUpload = (value: { fileList: any[] }) => {
    const file = value.fileList?.[0]?.originFileObj;
    if (typeof FileReader !== 'undefined' && file) {
      const reader = new FileReader();
      reader.onload = (e) => getWorksheets(e.target?.result);
      reader.readAsBinaryString(file);
    } else {
      message.error('Trình duyệt không hỗ trợ');
      if (onCancel) onCancel();
    }
  };

  const onFinish = (values: any) => {
    const { sheet, line } = values;
    const ws = workbook?.Sheets[sheet];
    if (ws) {
      // Lấy hàng tiêu đề trong excel
      const headRow = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: `A${line}:ZZ${line}`,
        defval: '',
      });
      const header = Object.values(headRow[0] as any) as string[];
      // Map Excel column - column title: A: "Mã"
      let hline: Record<string, string> = {};
      header.forEach((item, index) => {
        if (!!item) hline = { ...hline, [indexToExcelColumn(index)]: item };
      });

      const cols = Object.values(hline); // Những tên cột thực tế, bỏ các cột trống
      // Lấy toàn bộ data trong file
      const sheetData = XLSX.utils.sheet_to_json(ws, { header }) as any[];
      const data = sheetData
        .filter((item) => item.__rowNum__ >= line)
        .map((item) => pick(item, cols)); // Chỉ lấy từ data những trường cần lấy

      if (data.length > 0 && cols.length > 0) {
        setHeadLine(hline);
        setFileData(data);
        onChange();
        return;
      }
    }
    message.error('Không lấy được dữ liệu');
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Row gutter={[12, 0]}>
        <Col span={24}>
          <Form.Item name="file" label="Tập tin dữ liệu" rules={[...rules.fileRequired]}>
            <UploadFile
              onChange={onChangeUpload}
              accept=".xls, .xlsx"
              drag
              draggerDescription="Chọn tập tin dữ liệu để nhập vào hệ thống"
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="sheet" label="Trang tính chứa dữ liệu" rules={[...rules.required]}>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn trang tính chứa dữ liệu"
              options={sheetNames?.map((item) => ({
                key: item,
                value: item,
                label: item,
              }))}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="line" label="Dòng làm tiêu đề cột" rules={[...rules.required]}>
            <InputNumber
              placeholder="Chọn dòng tiêu đề cột trong trang tính"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={() => onCancel()} icon={<CloseOutlined />}>
              Hủy
            </Button>
            <Button htmlType="submit" type="primary">
              Tiếp theo <ArrowRightOutlined />
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default ChooseFileImport;
