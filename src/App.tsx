import { FC } from "react";
import { Counter } from "./features/counter/Counter";
import Todo from "./views/Todo";

const App: FC = () => {
  return (
    <div className="App">
      {/* <Counter></Counter> */}
      <Todo></Todo>
    </div>
  );
}

export default App;
