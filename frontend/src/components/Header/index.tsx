import { Setting } from '@/utils/constants';
import { useMediaQuery } from 'react-responsive';
import AvatarDropdown from '../RightContent/AvatarDropdown';

const Header = () => {
  const isMediumScreen = useMediaQuery({
    query: '(min-width: 950px)',
  });

  return (
    <div
      style={{
        padding: '0px 24px',
        height: 48,
        maxHeight: 48,
        backgroundColor: '#001529',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img style={{ width: 32, height: 32 }} src={Setting.logo} />{' '}
        <div
          style={{ display: 'inline-block', marginLeft: 12, fontSize: 16, verticalAlign: 'top' }}
        >
          {Setting.title}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isMediumScreen && (
          <>
            <div style={{ marginRight: 24 }}>
              <span>
                <svg
                  style={{ marginBottom: -2, marginRight: 8 }}
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00008 6.99999C5.26675 6.99999 4.66675 6.39999 4.66675 5.66666C4.66675 4.93333 5.26675 4.33333 6.00008 4.33333C6.73341 4.33333 7.33341 4.93333 7.33341 5.66666C7.33341 6.39999 6.73341 6.99999 6.00008 6.99999ZM10.0001 5.79999C10.0001 3.37999 8.23341 1.66666 6.00008 1.66666C3.76675 1.66666 2.00008 3.37999 2.00008 5.79999C2.00008 7.35999 3.30008 9.42666 6.00008 11.8933C8.70008 9.42666 10.0001 7.35999 10.0001 5.79999ZM6.00008 0.333328C8.80008 0.333328 11.3334 2.47999 11.3334 5.79999C11.3334 8.01333 9.55341 10.6333 6.00008 13.6667C2.44675 10.6333 0.666748 8.01333 0.666748 5.79999C0.666748 2.47999 3.20008 0.333328 6.00008 0.333328Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span>Phòng Đào tạo - Học viện CN BCVT</span>
            </div>
            {/* 2 */}
            <div style={{ marginRight: 24 }}>
              <svg
                style={{ marginBottom: -2, marginRight: 8 }}
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.7819 12.5H10.7034C1.6342 11.9785 0.346505 4.32615 0.166505 1.99077C0.152002 1.80919 0.173469 1.62653 0.229678 1.45327C0.285888 1.28 0.375733 1.11952 0.494067 0.981039C0.612402 0.842554 0.756899 0.728779 0.919279 0.646234C1.08166 0.563688 1.25873 0.513995 1.44035 0.5H3.98343C4.1683 0.499821 4.34897 0.555159 4.50203 0.658844C4.65509 0.76253 4.77349 0.909786 4.84189 1.08154L5.54343 2.80769C5.61097 2.97548 5.62774 3.15942 5.59163 3.33666C5.55553 3.51389 5.46815 3.67662 5.34035 3.80462L4.35727 4.79692C4.51084 5.66958 4.92874 6.474 5.55446 7.10137C6.18017 7.72873 6.98349 8.14876 7.85574 8.30462L8.85727 7.31231C8.9872 7.18592 9.15145 7.10058 9.32956 7.06693C9.50766 7.03327 9.69173 7.0528 9.85881 7.12308L11.5988 7.82C11.768 7.89056 11.9123 8.00989 12.0134 8.16277C12.1145 8.31566 12.1678 8.49518 12.1665 8.67846V11.1154C12.1665 11.4826 12.0206 11.8348 11.761 12.0945C11.5013 12.3541 11.1491 12.5 10.7819 12.5ZM1.55112 1.42308C1.42871 1.42308 1.31132 1.4717 1.22476 1.55826C1.13821 1.64481 1.08958 1.76221 1.08958 1.88462V1.92154C1.30189 4.65385 2.66343 11.1154 10.7542 11.5769C10.8148 11.5807 10.8756 11.5724 10.933 11.5526C10.9905 11.5328 11.0434 11.5019 11.0889 11.4616C11.1343 11.4213 11.1714 11.3724 11.1979 11.3177C11.2244 11.2631 11.2399 11.2037 11.2434 11.1431V8.67846L9.50343 7.98154L8.17881 9.29692L7.95727 9.26923C3.94189 8.76615 3.39727 4.75077 3.39727 4.70923L3.36958 4.48769L4.68035 3.16308L3.98804 1.42308H1.55112Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.1"
                />
              </svg>

              <span>(024) 33528122</span>
            </div>
            {/* 3 */}
            <div style={{ marginRight: 24 }}>
              <svg
                style={{ marginBottom: -4, marginRight: 8 }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.16667 3.33334H12.5C13.1417 3.33334 13.6667 3.85834 13.6667 4.5V11.5C13.6667 12.1417 13.1417 12.6667 12.5 12.6667H3.16667C2.525 12.6667 2 12.1417 2 11.5V4.5C2 3.85834 2.525 3.33334 3.16667 3.33334Z"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.6667 4.5L7.83333 8.58333L2 4.5"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>tuyensinh@ptit.edu.vn</span>
            </div>
          </>
        )}
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default Header;
