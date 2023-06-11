import React from 'react';
import GridMatrix from './GridMatrix';
import { Item } from './schema/item.schema';
import { get } from 'lodash';

type Props = {
  item: Item;
  children: React.ReactNode;
};

const ProcessView = ({ item, children }: Props) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          // top: item.property.y,
          // left: item.property.x,
          zIndex: item?.legacy?.itemProperties?.transform?.zIndex ?? 0,

          width: get(item, 'legacy.viewProperties.dimensions[0]'),
          height: get(item, 'legacy.viewProperties.dimensions[1]'),
          // backgroundColor: 'red',
        }}
      >
        <GridMatrix
          width={get(item, 'legacy.viewProperties.dimensions[0]') || 0}
          height={get(item, 'legacy.viewProperties.dimensions[1]') || 0}
          gridSize={10}
        />
      </div>
      {children}
    </>
  );
};

export default ProcessView;
