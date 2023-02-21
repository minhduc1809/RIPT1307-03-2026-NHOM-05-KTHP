import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'umi';
import './style.less';

class ErrorBoundary extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = { error: '', errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <Result
            status="error"
            title="Có lỗi xảy ra"
            subTitle={
              <p>
                Rất tiếc, chức năng này hiện đang hoạt động không chính xác.
                <br />
                Vui lòng thử lại hoặc liên hệ với quản trị viên!
              </p>
            }
            extra={[
              <Link to="/" key="home">
                <Button>Về trang chủ</Button>
              </Link>,
              <Button key="buy" onClick={() => window.location.reload()} type="primary">
                Tải lại trang
              </Button>,
            ]}
          >
            <div className="desc">
              Thông tin lỗi: {this.state.error ? this.state.error.toString() : ''}
              <br />
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </details>
            </div>
          </Result>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;

type MyProps = {
  // using `interface` is also ok
  children: any;
};
type MyState = {
  error?: string; // like this
  errorInfo?: any;
};
