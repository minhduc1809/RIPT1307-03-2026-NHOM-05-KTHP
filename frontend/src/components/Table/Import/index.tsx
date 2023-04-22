import { Modal, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { type TableBaseProps } from '../typing';
import ChooseFileImport from './ChooseFileImport';
import MatchColumns from './MatchColumns';
import PreviewDataImport from './PreviewDataImport';

const ModalImport = (props: { visible: boolean; setVisible: any; tableOption: TableBaseProps }) => {
  const { visible, setVisible, tableOption } = props;
  const { setFileData, setMatchedColumns, setColumns } = useModel('import');
  const [currentStep, setCurrentStep] = useState(0);

  const reduceColumns = () => {
    const columnsHasDataIndex = tableOption.columns
      .filter(
        (item) =>
          typeof item.dataIndex === 'string' &&
          !['createdAt', 'updatedAt'].includes(item.dataIndex),
      )
      .map(({ filterType, sortable, ...val }) => val); // Bỏ filter, search, sort
    setColumns(columnsHasDataIndex);
  };

  useEffect(() => {
    reduceColumns();
  }, [tableOption.columns]);

  const onCancel = () => {
    setVisible(false);
    setMatchedColumns(undefined);
    setFileData(undefined);
    setCurrentStep(0);
  };

  return (
    <Modal
      title="Nhập dữ liệu"
      visible={visible}
      onCancel={() => onCancel()}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={tableOption.maskCloseableForm || false}
    >
      <Steps current={currentStep} style={{ marginBottom: 18 }}>
        <Steps.Step title="Chọn tập tin" />
        <Steps.Step title="Ghép cột dữ liệu" />
        <Steps.Step title="Xem trước dữ liệu" />
        <Steps.Step title="Kết quả" />
      </Steps>

      {currentStep === 0 ? (
        <ChooseFileImport onChange={() => setCurrentStep(1)} onCancel={onCancel} />
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
          modelName={tableOption.modelName}
        />
      ) : null}
    </Modal>
  );
};

export default ModalImport;
