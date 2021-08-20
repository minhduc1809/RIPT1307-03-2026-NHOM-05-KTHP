import { Button } from 'antd';
import type { FC } from 'react';
import type { IndexModelState, ConnectProps, Loading } from 'umi';
import { connect } from 'umi';

interface PageProps extends ConnectProps {
  dvaSample: IndexModelState;
  loading: boolean;
}

const IndexPage: FC<PageProps> = ({ dvaSample, dispatch }) => {
  const { name } = dvaSample;
  return (
    <div>
      Hello {name}{' '}
      <Button
        onClick={() => {
          dispatch?.({
            type: 'dvaSample/save',
            payload: {
              name: new Date().toISOString(),
            },
          });
        }}
      >
        getTime
      </Button>
    </div>
  );
};

export default connect(
  ({ dvaSample, loading }: { dvaSample: IndexModelState; loading: Loading }) => ({
    dvaSample,
    loading: loading.models.dvaSample,
  }),
)(IndexPage);
