interface IExampleChartProps {
  component: any;
  data: any;
}

export default function ExampleChart({
  component: Component,
  data,
}: IExampleChartProps) {
  return <Component selectedSensor={data?.selectedSensor} />;
}
