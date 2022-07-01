import { Counter } from "./features/counter/Counter";
import "./App.css";

import { Plate, TEditableProps } from "@udecode/plate";

const editableProps: TEditableProps = {
  placeholder: "Type...",
};

function App() {
  return (
    <div className="App">
      <Plate editableProps={editableProps} />

      <Counter />
    </div>
  );
}

export default App;
