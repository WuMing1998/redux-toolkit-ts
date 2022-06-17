import { FC, useContext, useRef } from "react";
import { ToDoContext } from "../views/Todo";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

const TInput: FC = () => {
  const inpRef = useRef({} as HTMLInputElement);
  const dispatch = useDispatch();
  const { todos, addTodo } = useContext(ToDoContext);

  const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inpRef.current.value) {
        if (!todos.find((item) => item.context === inpRef.current.value)) {
          dispatch(
            addTodo({
              id: (todos.length + 1).toString(),
              toggle: false,
              context: inpRef.current.value,
              date: dayjs().format("YYYY-MM-DD"),
            })
          );
        }
      } else {
        alert("待办事项不可为空");
      }
    }
  };

  return <input ref={inpRef} type="text" onKeyUp={inputHandler} />;
};

export default TInput;
