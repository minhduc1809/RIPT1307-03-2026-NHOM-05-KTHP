import { Empty, Modal, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { type TImportHeader } from '../typing';
import ChooseFileImport from './ChooseFileImport';
import MatchColumns from './MatchColumns';
import PreviewDataImport from './PreviewDataImport';
import ValidateDataImport from './ValidateDataImport';

const ModalImport = (props: {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  modelName: any;
  maskCloseableForm?: boolean;
}) => {
  const { visible, onCancel, onOk, modelName, maskCloseableForm } = props;
  const { setFileData, setMatchedColumns, setImportHeaders, setDataImport, importHeaders } =
    useModel('import');
  const { getImportHeaderModel } = useModel(modelName);
  const [currentStep, setCurrentStep] = useState(0);

  const getHeaders = () => {
    if (getImportHeaderModel)
      getImportHeaderModel().then((data: TImportHeader[]) => setImportHeaders(data));
  };

  useEffect(() => {
    getHeaders();
  }, [modelName]);

  const onCancelModal = () => {
    onCancel();
    setMatchedColumns(undefined);
    setFileData(undefined);
    setDataImport(undefined);
    setCurrentStep(0);
  };

  return (
    <Modal
      title="Nhập dữ liệu"
      visible={visible}
      onCancel={() => onCancelModal()}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={maskCloseableForm || false}
    >
      {!!importHeaders.length ? (
        <>
          <Steps current={currentStep} style={{ marginBottom: 18 }}>
            <Steps.Step title="Chọn tập tin" />
            <Steps.Step title="Ghép cột dữ liệu" />
            <Steps.Step title="Xem trước dữ liệu" />
            <Steps.Step title="Kết quả xử lý" />
          </Steps>

          {currentStep === 0 ? (
            <ChooseFileImport onChange={() => setCurrentStep(1)} onCancel={onCancelModal} />
          ) : currentStep === 1 ? (
            <MatchColumns
              onChange={() => setCurrentStep(2)}
              onBack={() => {
                setCurrentStep(0);
                setMatchedColumns(undefined);
              }}
            />
          ) : currentStep === 2 ? (
            <PreviewDataImport
              onChange={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          ) : (
            <ValidateDataImport
              onChange={() => onOk()}
              onBack={() => setCurrentStep(2)}
              modelName={modelName}
            />
          )}
        </>
      ) : (
        <Empty description="Chức năng chưa được hỗ trợ" />
      )}
    </Modal>
  );
};

export default ModalImport;
