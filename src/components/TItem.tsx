import dayjs from "dayjs";
import {
  Dispatch,
  FC,
  useContext,
  useDeferredValue,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { ITodo } from "../store/todos/todosReducer";
import { ToDoContext } from "../views/Todo";

interface IUpdateContextProps extends ITodo {
  update: boolean;
  setUpdate: Dispatch<React.SetStateAction<boolean>>;
}

const UpdateContext: FC<IUpdateContextProps> = (props) => {
  const { id, toggle, context, date, update, setUpdate } = props;
  const inpRef = useRef({} as HTMLInputElement);
  const dispatch = useDispatch();
  const { todos, updateTodo } = useContext(ToDoContext);

  const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inpRef.current.value) {
        todos.find((item) => {
          if (item.id === id) {
            setUpdate(false);
            dispatch(
              updateTodo({
                id,
                toggle,
                context: inpRef.current.value,
                date,
              })
            );
          }
        });
      } else {
        alert("待办事项不可为空");
      }
    }
  };

  return update ? (
    <input
      ref={inpRef}
      type="text"
      defaultValue={context}
      onKeyUp={inputHandler}
    />
  ) : (
    <div onClick={() => setUpdate(true)}>{context}</div>
  );
};

const TItem: FC<ITodo> = (todo) => {
  const { id, toggle, context, date } = todo;
  const { todos, updateTodo, removeTodo } = useContext(ToDoContext);

  const [update, setUpdate] = useState<boolean>(false);

  const updateDef = useDeferredValue(update);

  const dispatch = useDispatch();

  return (
    <div>
      <input
        type="checkbox"
        onClick={() =>
          dispatch(
            updateTodo({
              ...todo,
              toggle: !toggle,
            })
          )
        }
        defaultChecked={toggle}
      />
      <span>{date}</span>
      <UpdateContext
        {...todo}
        update={updateDef}
        setUpdate={setUpdate}
      ></UpdateContext>
      <button onClick={() => dispatch(removeTodo(todo))}>删除</button>
    </div>
  );
};

export default TItem;
