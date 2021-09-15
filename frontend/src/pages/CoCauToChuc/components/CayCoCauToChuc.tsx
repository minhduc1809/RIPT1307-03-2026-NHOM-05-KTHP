/* eslint-disable consistent-return */

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Spin, Tree } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useModel } from 'umi';
import { Format } from '@/utils/utils';

const CayCoCauToChuc = () => {
  const { danhSach, expandedKeys, loading, setExpandedKeys, setRecord } = useModel('donvi');
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [arrFilter, setArrFilter] = useState<any[]>([]);
  const [position, setPosition] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const findIndex = (maDonViCapTren?: string | boolean): number => {
    let ans = -1;
    danhSach?.map((item, index) => {
      if (item.ma_don_vi === maDonViCapTren) {
        ans = index;
        return ans;
      }
      return -2;
    });
    return ans;
  };

  const duyet = (child: any, i: number, keyParent: string) => {
    if (!danhSach?.[i]) {
      return;
    }
    if (child[i].length === 0) {
      return {
        ...danhSach[i],
        title: danhSach[i].ten_don_vi,
        key: keyParent !== '' ? `${keyParent}-${i}` : `${i}`,
      };
    }
    return {
      ...danhSach[i],
      title: danhSach[i].ten_don_vi,
      key: keyParent !== '' ? `${keyParent}-${i}` : `${i}`,
      children: child[i]?.map((val: number) => duyet(child, val, `${i}`)),
    };
  };

  const onExpand = (expandedKeysNew: any[]) => {
    setExpandedKeys(expandedKeysNew);
  };

  const handleSelect = async (
    selectedKey: any[],
    info: {
      event: 'select';
      selected: boolean;
      node: any;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    },
  ) => {
    setRecord(danhSach.find((item) => item.id === info.node?.id));
  };

  const filterTree = (node: any) => {
    const check = searchValue.length > 0 && Format(node.props.title).includes(Format(searchValue));
    return check;
  };

  useEffect(() => {
    const child: any = { '-1': [] };
    danhSach?.forEach((item, index) => {
      child[index] = [];
    });
    danhSach?.forEach((item, index) => {
      child[item?.is_root === true ? -1 : findIndex(item?.ma_don_vi_cap_tren ?? false)]?.push(
        index,
      );
    });
    const dataFinal = child[-1]?.map((item: number) => {
      return duyet(child, item, '');
    });
    setData(dataFinal);
  }, [danhSach]);

  return (
    <Spin spinning={loading}>
      <div>
        <Row>
          <Col span={24}>
            <Input.Group compact style={{ width: '100%' }}>
              <Input.Search
                style={{ marginBottom: 8, width: '80%', height: '100%' }}
                placeholder="Tìm kiếm theo tên đơn vị"
                // onSearch={value => {
                //   this.onChange(value);
                // }}
                allowClear
              />
              <Button
                // onClick={() => this.findResult('next')}
                style={{ width: '10%' }}
                title="Tiếp theo"
                icon={<DownOutlined />}
              />
              <Button
                // onClick={() => this.findResult('pre')}
                style={{ width: '10%' }}
                title="Trước"
                icon={<UpOutlined />}
              />
            </Input.Group>
          </Col>
        </Row>

        <Scrollbars
          autoHide
          // ref="scrollbars"
          style={{ height: '429px', border: '1px solid #d9d9d9', borderRadius: 4 }}
        >
          {isSearch && (
            <Tree
              style={{ margin: '12px 12px' }}
              showLine
              treeData={data}
              expandedKeys={expandedKeys}
              selectedKeys={[arrFilter[position]?.id]}
              onExpand={onExpand}
              filterTreeNode={filterTree}
              onSelect={handleSelect}
            />
          )}
          {!isSearch && (
            <Tree
              style={{ margin: '12px 12px' }}
              showLine
              expandedKeys={expandedKeys}
              treeData={data}
              onExpand={onExpand}
              filterTreeNode={filterTree}
              onSelect={handleSelect}
            />
          )}
        </Scrollbars>
      </div>
    </Spin>
  );
};

export default CayCoCauToChuc;
