import { ArrowLeftOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Popconfirm, Row, Space, Spin, Tag } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import { type IColumn, type TImportResponse } from '../typing';

const ValidateDataImport = (props: { onChange: () => void; onBack: any; modelName: any }) => {
  const { onChange, onBack, modelName } = props;
  const { dataImport } = useModel('import');
  const { postValidateModel, postExecuteImpotModel, formSubmiting } = useModel(modelName);
  const [importResponses, setImportResponses] = useState<TImportResponse[]>([]);
  const [step, setStep] = useState(0);
  const columns: IColumn<TImportResponse>[] = [
    {
      dataIndex: 'row',
      title: 'Thứ tự hàng',
      width: 80,
      align: 'center',
    },
    {
      dataIndex: 'importStatus',
      title: 'Trạng thái',
      width: 120,
      align: 'center',
      render: (val) =>
        val === 'fail' ? (
          <Tag color="red">{step === 0 ? 'Không hợp lệ' : 'Không thành công'}</Tag>
        ) : (
          <Tag color="green">{step === 0 ? 'Hợp lệ' : 'Thành công'}</Tag>
        ),
    },
    {
      dataIndex: 'errorMess',
      title: 'Ghi chú',
      width: 200,
    },
  ];
  const errorCount = importResponses?.filter((item) => item.importStatus === 'fail')?.length;
  const successCount = importResponses?.filter((item) => item.importStatus !== 'fail')?.length;

  const validateData = async () => {
    if (postValidateModel)
      postValidateModel(dataImport)
        .then((res: TImportResponse[]) => {
          const temp = _.sortBy(res, (item) => item.row);
          setImportResponses(temp);
        })
        .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    validateData();
  }, []);

  const onExecute = () => {
    postExecuteImpotModel(dataImport)
      .then((res: TImportResponse[]) => {
        const temp = _.sortBy(res, (item) => item.row);
        setImportResponses(temp);
        setStep(1);
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <div className="fw500">Kết quả kiểm tra</div>
        <i>Dữ liệu đã được kiểm tra trên hệ thống. Vui lòng xem danh sách chi tiết dưới đây.</i>
      </Col>

      {!formSubmiting ? (
        errorCount ? (
          <Col span={24}>
            {step === 0 ? (
              <>
                <span className="fw500">Hiện tại có </span>
                <Tag color="red">{errorCount} dòng không hợp lệ</Tag>
                <br />
                Bạn hãy kiểm tra lại dữ liệu hoặc loại bỏ những dòng không hợp lệ để có thể Lưu dữ
                liệu vào hệ thống.
                {/* Bạn có thể kiểm tra lại trước khi Lưu dữ liệu vào hệ thống! */}
              </>
            ) : (
              <>
                <span className="fw500">Thực hiện lưu </span>
                <Tag color="red">{errorCount} dòng không thành công</Tag>
              </>
            )}
          </Col>
        ) : successCount ? (
          <Col span={24}>
            <Space
              style={{ marginTop: 12, marginBottom: 12, justifyContent: 'center', width: '100%' }}
              align="center"
            >
              <CheckCircleOutlined style={{ fontSize: 24, color: '#08b34f' }} />
              <span className="fw500" style={{ fontSize: 18, color: '#08b34f' }}>
                Tất cả dữ liệu {importResponses.length} hàng đã được{' '}
                {step === 0 ? 'kiểm tra hợp lệ' : 'lưu thành công'}
              </span>
            </Space>
          </Col>
        ) : (
          <Col span={24}>
            <div style={{ color: 'red' }}>Có lỗi xảy ra!</div>
          </Col>
        )
      ) : (
        <div style={{ width: '100%', textAlign: 'center', marginTop: 12, marginBottom: 12 }}>
          <Spin spinning />
        </div>
      )}

      {step === 0 ? (
        <Col span={24}>
          <Popconfirm
            title={
              errorCount ? (
                <>
                  Tồn tại dữ liệu không hợp lệ
                  <br />
                  Vẫn xác nhận Lưu dữ liệu?
                </>
              ) : (
                'Xác nhận lưu dữ liệu vào hệ thống?'
              )
            }
            onConfirm={onExecute}
            disabled={!successCount || !!errorCount}
          >
            <Button
              htmlType="submit"
              type="primary"
              loading={formSubmiting}
              icon={<SaveOutlined />}
              disabled={!successCount || !!errorCount}
            >
              Lưu dữ liệu
            </Button>
          </Popconfirm>
        </Col>
      ) : null}

      {importResponses.length ? (
        <Col span={24}>
          <Collapse defaultActiveKey={errorCount ? 0 : undefined}>
            <Collapse.Panel key={0} header="Danh sách chi tiết">
              <TableStaticData
                columns={columns}
                data={importResponses}
                loading={formSubmiting}
                size="small"
                otherProps={{ bordered: true }}
                hasTotal
              />
            </Collapse.Panel>
          </Collapse>
        </Col>
      ) : null}

      <Col span={24}>
        <Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
            Quay lại
          </Button>
          <Button onClick={onChange}>Hoàn thành</Button>
        </Space>
      </Col>
    </Row>
  );
};

export default ValidateDataImport;
