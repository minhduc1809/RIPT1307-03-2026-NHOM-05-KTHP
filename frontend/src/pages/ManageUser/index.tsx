import { add } from '@/services/user/user';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import request from 'umi-request';

const columns: ProColumns<User.Result>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    key: 'index',
  },
  {
    title: 'username',
    key: 'username',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    tip: 'username',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Yêu cầu',
        },
      ],
    },
  },
  {
    title: 'email',
    key: 'email',

    dataIndex: 'email',
    copyable: true,
    ellipsis: true,
    tip: 'email',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Yêu cầu',
        },
      ],
    },
  },

  {
    title: 'lastname',
    key: 'lastname',

    dataIndex: ['profile', 'lastname'],
    copyable: true,
    ellipsis: true,
    tip: 'Họ',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Yêu cầu',
        },
      ],
    },
  },

  {
    title: 'dateOfBirth',
    key: 'showTime',
    dataIndex: ['profile', 'dateOfBirth'],
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },

  {
    title: 'Giới tính',
    dataIndex: ['profile', 'gender'],
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: 'Tất cả', status: 'Default' },
      Male: {
        text: 'Nam',
      },
      Female: {
        text: 'Nữ',
      },
    },
  },
  {
    title: 'phoneNumber',
    dataIndex: ['profile', 'phoneNumber'],
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
  },
  {
    title: 'Tùy chọn',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          // eslint-disable-next-line no-underscore-dangle
          action?.startEditable?.(record._id);
        }}
      >
        Sửa
      </a>,

      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: 'Copy' },
          { key: 'delete', name: 'Xóa' },
        ]}
      />,
    ],
  },
];

export default () => {
  const intl = useIntl();
  /**  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**  */
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  return (
    <div>
      <ProTable<User.Result>
        columns={columns}
        actionRef={actionRef}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter, params);

          const response = await request<{
            data: User.Result[];
          }>('/v2.2/user/pageable', {
            params: { ...params, page: params.current, limit: params.pageSize },
          });
          console.log(`responsessss`, response);
          return {
            data: response.data.result,
            success: response.statusCode <= 200 && response.statusCode <= 399,
            total: response.data.total,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          //
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="Quản lý người dùng"
        toolBarRender={() => [
          <Button
            onClick={() => {
              handleModalVisible(true);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            Thêm mới
          </Button>,
        ]}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'newRule',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await add(value as User.Result);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="pages.searchTable.ruleName" defaultMessage="ruleName" />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      {/* <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      /> */}
    </div>
  );
};
