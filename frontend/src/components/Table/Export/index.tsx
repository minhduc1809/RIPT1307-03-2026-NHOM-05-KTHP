import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Modal, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { type TExportField, type TFilter } from '../typing';
import CardChooseFields from './CardChooseFields';
import CardExportFields from './CardExportFields';

const ModalExport = (props: {
  visible: boolean;
  onCancel: () => void;
  modelName: any;
  maskCloseableForm?: boolean;
  fileName: string;
  condition?: Record<string, any>;
  filters?: TFilter<any>[];
}) => {
  const { visible, onCancel, modelName, maskCloseableForm, fileName, condition, filters } = props;
  const { getExportFieldsModel, postExportModel, formSubmiting } = useModel(modelName);
  const [allFields, setAllFields] = useState<TExportField[]>([]); // Export Fields lấy từ API
  const [exportFields, setExportFields] = useState<TExportField[]>([]);
  const finalFields = exportFields.filter((item) => item.selected);

  const genFlatData = (data?: TExportField[]): TExportField[] => {
    if (!data?.length) return [];
    // Nếu có field con thì populate hết các field con,
    // còn ko thì trả về chính nó
    return data.map((item) => (!item.children ? [item] : genFlatData(item.children))).flat();
  };

  const getFields = () => {
    if (getExportFieldsModel)
      getExportFieldsModel().then((fields: TExportField[]) => {
        setAllFields(fields);

        const flatData = genFlatData(fields);
        setExportFields(flatData);
      });
  };

  useEffect(() => {
    getFields();
  }, [modelName]);

  const onCancelModal = () => onCancel();

  const onFinish = () => {
    if (finalFields.length)
      postExportModel({ definitions: finalFields }, condition, filters).then((blob: Blob) => {
        fileDownload(blob, fileName);
        onCancel();
      });
  };

  return (
    <Modal
      title="Xuất dữ liệu"
      visible={visible}
      onCancel={onCancelModal}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={maskCloseableForm || false}
    >
      {!!exportFields.length ? (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
            <Col span={24}>Chọn các trường dữ liệu cần trích xuất</Col>

            <Col span={24} md={12}>
              <CardChooseFields
                allFields={allFields}
                fields={exportFields}
                setFields={setExportFields}
              />
            </Col>
            <Col span={24} md={12}>
              <CardExportFields fields={exportFields} setFields={setExportFields} />
            </Col>
          </Row>

          <div className="form-footer">
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={onFinish}
              disabled={!finalFields.length}
              loading={formSubmiting}
            >
              Tải xuống dữ liệu
            </Button>
            <Button onClick={onCancelModal}>Hủy</Button>
          </div>
        </>
      ) : (
        <Empty description="Chức năng chưa được hỗ trợ" />
      )}
    </Modal>
  );
};

export default ModalExport;
