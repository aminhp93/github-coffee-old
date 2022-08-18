import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { useEffect } from 'react';

const myLayout: LayoutConfig = {
  root: {
    type: 'row',
    content: [
      {
        title: 'My Component 1',
        type: 'component',
        componentType: 'MyComponent',
        width: 50,
      },
      {
        title: 'My Component 2',
        type: 'component',
        componentType: 'MyComponent',
        // componentState: { text: 'Component 2' }
      },
    ],
  },
};

const MyComponent = () => {
  return <div>My compoent</div>;
};

const GoldenLayoutWrapper = () => {
  useEffect(() => {
    const menuContainerElement = document.querySelector('#menuContainer');
    const addMenuItemElement = document.querySelector('#addMenuItem');
    const layoutElement: any = document.querySelector('#layoutContainer');

    addMenuItemElement &&
      addMenuItemElement.addEventListener('click', (event) => {
        goldenLayout.addComponent('MyComponent', undefined, 'Added Component');
      });

    const goldenLayout = new GoldenLayout(layoutElement);

    goldenLayout.registerComponent('MyComponent', MyComponent);

    goldenLayout.loadLayout(myLayout);
  }, []);

  return (
    <div id="wrapper">
      <ul id="menuContainer">
        <li id="addMenuItem">Add another component</li>
      </ul>
      <div id="layoutContainer"></div>
    </div>
  );
};

export default GoldenLayoutWrapper;
