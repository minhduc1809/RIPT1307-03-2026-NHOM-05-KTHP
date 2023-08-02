import { Card, Tree, Button } from 'antd';
import { type TExportField } from '../typing';
import { DownOutlined } from '@ant-design/icons';

const CardChooseFields = (props: {
  allFields: TExportField[];
  fields: TExportField[];
  setFields: (val: TExportField[]) => void;
}) => {
  const { allFields, fields, setFields } = props;

  const genTreeData = (data?: TExportField[]): any => {
    if (!data?.length) return [];
    return data?.map((item) => ({
      title: item.label,
      key: item._id,
      children: genTreeData(item.children),
    }));
  };
  const treeData = genTreeData(allFields);

  const onCheckAll = () => setFields(fields.map((item) => ({ ...item, selected: true })));

  return (
    <Card
      title="Các trường khả dụng"
      bordered={false}
      bodyStyle={{ padding: '8px 0 0' }}
      headStyle={{ padding: 0 }}
    >
      <div style={{ marginBottom: 8 }}>
        <Button size="small" onClick={onCheckAll}>
          Chọn tất cả
        </Button>
      </div>

      <div style={{ maxHeight: 385, overflowY: 'scroll', border: '1px solid #f0f0f0' }}>
        <Tree
          treeData={treeData}
          defaultExpandAll
          switcherIcon={<DownOutlined />}
          checkable
          checkedKeys={fields.filter((item) => item.selected).map((item) => item._id)}
          onCheck={(keys) => {
            if (Array.isArray(keys))
              setFields(fields.map((item) => ({ ...item, selected: keys.includes(item._id) })));
          }}
        />
      </div>
    </Card>
  );
};

export default CardChooseFields;
