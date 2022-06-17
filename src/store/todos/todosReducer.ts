import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoState } from "..";

export interface ITodo {
  id: string;
  toggle: boolean;
  context: string;
  date: string;
}

const initialState: ITodo[] = [
  {
    id: "001",
    toggle: true,
    context: "没做完呢",
    date: "2022-06-07",
  },
];

const todosSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {
    addTodo: (state: ITodo[], action: PayloadAction<ITodo>) => [
      ...state,
      action.payload,
    ],
    removeTodo: (state: ITodo[], action: PayloadAction<ITodo>) =>
      state.filter((todo) => action.payload.id !== todo.id),
    updateTodo: (state: ITodo[], action: PayloadAction<ITodo>) => [
      ...state.map((todo) => {
        return todo.id === action.payload.id ? action.payload : todo;
      }),
    ],
  },
});

export const { addTodo, removeTodo, updateTodo } = todosSlice.actions;

export const todoState = (state: TodoState) => state;
export default todosSlice.reducer;
