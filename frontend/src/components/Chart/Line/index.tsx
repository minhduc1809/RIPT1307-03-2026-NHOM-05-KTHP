import { Axis, Chart, Geom, Tooltip } from 'bizcharts';

const LineChart = (props: { xLabel?: string; yLabel?: string; data: { x: any; y: any }[] }) => {
  const cols = {
    y: {
      min: 0,
      range: [0, 0.9],
      alias: props?.yLabel ?? 'y',
    },
    x: {
      range: [0, 0.1],
      alias: props?.xLabel ?? 'x',
    },
  };
  return (
    <div>
      <Chart
        padding={{ top: 10, bottom: 40, left: 70, right: 30 }}
        height={400}
        data={props?.data ?? [{ x: '', y: 0 }]}
        scale={cols}
        forceFit
      >
        <Axis
          name="x"
          title={{
            position: 'end',
            offset: 15,
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
              fill: '#999',
              fontWeight: 'bold',
              rotate: 0,
            },
          }}
        />
        <Axis
          name="y"
          title={{
            position: 'end',
            offset: 5.5,
            textStyle: {
              fontSize: '12',
              textAlign: 'right',
              fill: '#999',
              fontWeight: 'bold',
              rotate: 0,
            },
          }}
        />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
        />
        <Geom
          type="line"
          position="x*y"
          size={2}
          tooltip={[
            'x*y',
            (x, y) => {
              return {
                name: x,
                value: y,
                title: props?.xLabel ?? 'x',
              };
            },
          ]}
        />
        <Geom
          type="point"
          position="x*y"
          size={4}
          shape={'circle'}
          style={{
            stroke: '#fff',
            lineWidth: 1,
          }}
          tooltip={[
            'x*y',
            (x, y) => {
              return {
                name: x,
                value: y,
              };
            },
          ]}
        />
      </Chart>
    </div>
  );
};

export default LineChart;
