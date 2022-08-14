import update from 'immutability-helper';
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';

import { Box } from './Box';
import { Dustbin } from './Dustbin';
import { ItemTypes } from './ItemTypes';

interface DustbinState {
  accepts: string[];
  lastDroppedItem: any;
}

interface BoxState {
  name: string;
  type: string;
}

export interface DustbinSpec {
  accepts: string[];
  lastDroppedItem: any;
}
export interface BoxSpec {
  name: string;
  type: string;
}
export interface ContainerState {
  droppedBoxNames: string[];
  dustbins: DustbinSpec[];
  boxes: BoxSpec[];
}

const Container: FC = memo(function Container() {
  const [dustbins, setDustbins] = useState<DustbinState[]>([
    { accepts: [ItemTypes.task1], lastDroppedItem: null },
    { accepts: [ItemTypes.task2], lastDroppedItem: null },
    {
      accepts: [ItemTypes.task3, ItemTypes.task1, NativeTypes.URL],
      lastDroppedItem: null,
    },
    { accepts: [ItemTypes.task3, NativeTypes.FILE], lastDroppedItem: null },
  ]);

  const [boxes] = useState<BoxState[]>([
    { name: 'Task 1', type: ItemTypes.task1 },
    { name: 'Task 2', type: ItemTypes.task2 },
    { name: 'Task 3', type: ItemTypes.task3 },
  ]);

  const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([]);

  function isDropped(boxName: string) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item;
      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name] } : { $push: [] })
      );
      setDustbins(
        update(dustbins, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedBoxNames, dustbins]
  );

  return (
    <div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        {dustbins.map(({ accepts, lastDroppedItem }, index) => (
          <Dustbin
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => handleDrop(index, item)}
            key={index}
          />
        ))}
      </div>

      <div style={{ overflow: 'hidden', clear: 'both' }}>
        {boxes.map(({ name, type }, index) => (
          <Box
            name={name}
            type={type}
            isDropped={isDropped(name)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
});

export default Container;
