import { FC, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useAppSelector, useAppDispatch } from "../hooks/useStore";
import {
  todoState,
  addTodo,
  removeTodo,
  updateTodo,
} from "../store/todos/todosReducer";
import { tw } from "twind";

const Todo: FC = () => {
  const todos = useAppSelector(todoState);
  console.log(todos);
  const [clicked, setClicked] = useState<number>(0);

  useEffect(() => {
    //   flushSync用于关闭react18的自动批处理.这样会引起dom的强制更新
    flushSync(() => {
      setClicked(clicked + 1);
    });
  }, [todos]);
  return <div className={tw`font-bold`}>Todo</div>;
};

export default Todo;
