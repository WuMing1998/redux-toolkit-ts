import { configureStore } from "@reduxjs/toolkit";

//中间件插件示例：添加redux-logger中间件
import logger from "redux-logger";

//添加redux扩展功能 redux-batch 批处理
import { reduxBatch } from "@manaflair/redux-batch";

import todosReducer from "./todos/todosReducer";

const reducer = {
  todos: todosReducer,
};

export const store = configureStore({
  //reducer
  reducer,
  //使用redux-logger中间件
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  //生产环境关闭devTools // 安装dev工具  chrome应用商店 安装 React Developer Tools
  devTools: process.env.NODE_ENV !== "production",
  //redux扩展功能
  enhancers: [reduxBatch],
});
