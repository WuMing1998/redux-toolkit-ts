import { FC, useContext, useDeferredValue, useState } from "react";
import { useDispatch } from "react-redux";
import { ITodo } from "../store/todos/todosReducer";
import { ToDoContext } from "../views/Todo";

const UpdateContext: FC<{
  update: boolean;
  context: ITodo["context"];
  toggleUpdate: () => void;
}> = ({ update, context, toggleUpdate }) => {
  return update ? (
    <input type="text" value={context} onChange={() => {}} />
  ) : (
    <div onClick={toggleUpdate}>{context}</div>
  );
};

const TItem: FC<ITodo> = (todo) => {
  const { id, toggle, context, date } = todo;
  const { todos, updateTodo, removeTodo } = useContext(ToDoContext);
  console.log(todos);

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
      <UpdateContext
        context={context}
        update={updateDef}
        toggleUpdate={() => setUpdate(true)}
      ></UpdateContext>
      <button onClick={() => {}}>删除</button>
    </div>
  );
};

export default TItem;
