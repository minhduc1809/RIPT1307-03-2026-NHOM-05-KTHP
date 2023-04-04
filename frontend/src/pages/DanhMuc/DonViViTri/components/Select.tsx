import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormVanBanQuyDinh from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectVanBanQuyDinh = (props: any) => {
  const { value, onChange, hasCreate } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('vanbanquydinh');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  const onAddNew = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        value={value}
        onChange={onChange}
        options={danhSach.map((item) => ({
          key: item._id,
          value: item._id,
          label: `${item.ten} (${item.ma})`,
        }))}
        showSearch
        optionFilterProp="label"
        placeholder="Chọn căn cứ pháp lý"
      />

      {hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        footer={null}
        onCancel={() => setVisibleForm(false)}
      >
        <FormVanBanQuyDinh title="Căn cứ pháp lý" />
      </Modal>
    </div>
  );
};

export default SelectVanBanQuyDinh;
