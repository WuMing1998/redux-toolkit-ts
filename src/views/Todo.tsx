import { FC } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { todoState, addTodo, removeTodo, updateTodo } from '../store/todos/todosReducer'

const Todo: FC = () => {
    const todos = useAppSelector(todoState);
    console.log(todos)
    return (
        <div>Todo</div>
    )
}

export default Todo