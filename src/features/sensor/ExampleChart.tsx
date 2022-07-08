interface IExampleChartProps {
  component: any;
}

export default function ExampleChart({
  component: Component,
}: IExampleChartProps) {
  return <Component />;
}
