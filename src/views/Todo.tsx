import { createContext, FC, useEffect, useState } from "react";
// import { flushSync } from "react-dom";
import { useAppSelector, useAppDispatch } from "../hooks/useStore";
import {
  todoState,
  addTodo,
  removeTodo,
  updateTodo,
  ITodo,
} from "../store/todos/todosReducer";
import { tw } from "twind";
import {
  ActionCreatorWithPayload,
  PayloadAction,
} from "@reduxjs/toolkit/dist/createAction";
import TItem from "../components/TItem";

interface ITodoContextDefalutValue {
  todos: ITodo[];
  addTodo: ActionCreatorWithPayload<ITodo, string>;
  removeTodo: ActionCreatorWithPayload<ITodo, string>;
  updateTodo: ActionCreatorWithPayload<ITodo, string>;
}

export const ToDoContext = createContext<ITodoContextDefalutValue>(
  {} as ITodoContextDefalutValue
);

const Todo: FC = () => {
  const todos = useAppSelector(todoState).todos;
  const [clicked, setClicked] = useState<number>(0);
  // useEffect(() => {
  //   //   flushSync用于关闭react18的自动批处理.这样会引起dom的强制更新
  //   flushSync(() => {
  //     setClicked(clicked + 1);
  //   });
  // }, [todos]);

  useEffect(() => {
    console.log(todos);
  }, [todos]);
  
  return (
    <ToDoContext.Provider
      value={{
        todos: todos,
        addTodo,
        removeTodo,
        updateTodo,
      }}
    >
      <div className={tw`font-bold`}>
        {todos.map((item, index) => {
          return <TItem key={item.id} {...item}></TItem>;
        })}
      </div>
    </ToDoContext.Provider>
  );
};

export default Todo;
