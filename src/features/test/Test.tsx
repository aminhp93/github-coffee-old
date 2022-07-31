import * as React from 'react';
import CustomGridLayout from 'components/CustomGridLayout';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  return (
    <div>
      <CustomGridLayout />
    </div>
  );
}
