import { Drawer, InputNumber, Select } from 'antd';
import useHistoryStore, { useItemSelected } from './store/HistoryStore';
import { getTransformStyle } from './utils';

const Properties = () => {
  const selectedItems = useItemSelected();
  const patchItems = useHistoryStore((state) => state.patchItems);
  const item = Object.values(selectedItems)[0];

  console.log('selectedItems', selectedItems);

  const handleChange = (key: any, value: any) => {
    const newItem = {
      [item.id]: {
        ...item,
        legacy: {
          ...item.legacy,
          itemProperties: {
            ...item.legacy?.itemProperties,
            transform: {
              ...item.legacy?.itemProperties?.transform,
              [key]: value,
            },
          },
        },
      },
    };

    patchItems({
      [item.id]: {
        legacy: {
          itemProperties: {
            transform: {
              [key]: value,
            },
          },
        },
      } as any,
    });

    const itemSpring = item.currentState?.itemSpring;
    if (itemSpring) {
      const [, api] = itemSpring;
      api.start({
        x: newItem[item.id]?.legacy?.itemProperties?.transform?.x,
        y: newItem[item.id]?.legacy?.itemProperties?.transform?.y,
        transform: getTransformStyle(newItem[item.id]),
      });
    }
  };

  if (!selectedItems || Object.keys(selectedItems).length > 1) {
    return (
      <Drawer
        title="Properties"
        placement="right"
        mask={false}
        open={true}
        width={200}
      >
        Invalid selected items
      </Drawer>
    );
  }

  return (
    <Drawer
      title="Properties"
      placement="right"
      mask={false}
      open={false}
      width={200}
    >
      <div>
        x:
        <InputNumber
          onChange={(value) => handleChange('x', value)}
          value={item?.legacy?.itemProperties?.transform?.x}
        />
      </div>
      <div>
        y:{' '}
        <InputNumber
          onChange={(value) => handleChange('y', value)}
          value={item?.legacy?.itemProperties?.transform?.y}
        />
      </div>
      <div>
        anchor:{' '}
        <Select
          defaultValue="center"
          style={{ width: 120 }}
          onChange={(value) => handleChange('anchor', value)}
          options={[
            { value: 'ct', label: 'ct' },
            { value: 'rt', label: 'rt' },
            { value: 'rc', label: 'rc' },
            { value: 'rb', label: 'rb' },
            { value: 'cb', label: 'cb' },
            { value: 'lb', label: 'lb' },
            { value: 'lc', label: 'lc' },
            { value: 'lt', label: 'lt' },
            { value: 'center', label: 'center' },
          ]}
        />
      </div>
      <div>
        scale:{' '}
        <InputNumber
          onChange={(value) => handleChange('scale', value)}
          value={item?.legacy?.itemProperties?.transform?.scale}
        />
      </div>
      <div>
        rotate:{' '}
        <InputNumber
          onChange={(value) => handleChange('rotation', value)}
          value={item?.legacy?.itemProperties?.transform?.rotate}
        />
      </div>
      <div>
        width:{' '}
        <InputNumber
          onChange={(value) => handleChange('width', value)}
          value={item?.legacy?.itemProperties?.transform?.width}
        />
      </div>
      <div>
        height:{' '}
        <InputNumber
          onChange={(value) => handleChange('height', value)}
          value={item?.legacy?.itemProperties?.transform?.height}
        />
      </div>
    </Drawer>
  );
};

export default Properties;
