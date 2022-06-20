import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoState } from "..";

export interface ITodo {
  id: string;
  toggle: boolean;
  context: string;
  date: string;
}

const initialState = (): ITodo[] => {
  return JSON.parse(localStorage.getItem("todoList") || JSON.stringify([]));
};

const todosSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {
    addTodo: (state: ITodo[], action: PayloadAction<ITodo>) => {
      const todos = [...state, action.payload];
      localStorage.setItem("todoList", JSON.stringify(todos));
      return todos;
    },
    removeTodo: (state: ITodo[], action: PayloadAction<ITodo>) => {
      const todos = state.filter((todo) => action.payload.id !== todo.id);
      localStorage.setItem("todoList", JSON.stringify(todos));
      return todos;
    },
    updateTodo: (state: ITodo[], action: PayloadAction<ITodo>) => {
      const todos = [
        ...state.map((todo) => {
          return todo.id === action.payload.id ? action.payload : todo;
        }),
      ];
      localStorage.setItem("todoList", JSON.stringify(todos));
      return todos;
    },
  },
});

export const { addTodo, removeTodo, updateTodo } = todosSlice.actions;

export const todoState = (state: TodoState) => state;
export default todosSlice.reducer;
