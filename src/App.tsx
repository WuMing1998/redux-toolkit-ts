import { FC } from "react";
import { addTodo } from "./store/todos/todosReducer";
import { Counter } from "./features/counter/Counter";

const App: FC = () => {
  return (
    <div className="App">
      <Counter></Counter>
    </div>
  );
}

export default App;
