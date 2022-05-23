import { configureStore } from "@reduxjs/toolkit";

//中间件插件示例：添加redux-logger中间件
import logger from "redux-logger";

//添加redux扩展功能 redux-batch 批处理
import { reduxBatch } from "@manaflair/redux-batch";

import todosReducer from "./todos/todosReducer";
import visibilityReducer from "./visibility/visibilityReducer";

const reducer = {
  todos: todosReducer,
  visibility: visibilityReducer,
};

const preloadedState = {
  todos: [
    {
      text: "Eat food",
      completed: true,
    },
    {
      text: "Exercise",
      completed: false,
    },
  ],
  visibilityFilter: "SHOW_COMPLETED",
};

const store = configureStore({
  //reducer
  reducer,
  //使用redux-logger中间件
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  //生产环境关闭devTools // 安装dev工具  chrome应用商店 安装 React Developer Tools
  devTools: process.env.NODE_ENV !== "production",
  //初始数据
  preloadedState,
  //redux扩展功能
  enhancers: [reduxBatch],
});

// store被创建后会自动传递给combineReducers()
// 内置redux-thunk和redux-logger中间件
// 自动检测开发环境与生产环境开启devTools
// 包含redux扩展器 使用redux-batch扩展redux
