import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface IProps {
  layout?: any;
  cb?: any;
}

const DEFAULT_LAYOUT = [
  { i: 'a', x: 0, y: 0, w: 1, h: 2 },
  { i: 'b', x: 1, y: 0, w: 3, h: 1 },
  { i: 'c', x: 4, y: 0, w: 1, h: 2 },
];

export default function CustomGridLayout({
  layout = DEFAULT_LAYOUT,
  cb,
}: IProps) {
  const onBreakpointChange = (newBreakpoint: any, newCols: any) => {
    console.log(
      `Breakpoint nuevo: ${newBreakpoint}, cantidad de columnas: ${newCols}`
    );
  };
  const getBg = () => {
    return 'white';
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
      onBreakpointChange={onBreakpointChange}
    >
      {layout.map((i: any) => {
        return (
          <div
            key={i.i}
            style={{ background: getBg() }}
            onClick={() => cb && cb(i)}
          >
            {i.label}
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
