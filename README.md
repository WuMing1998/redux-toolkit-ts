hello,这里是学习 redux-toolkit 的笔记和实验项目。

## install

```cmd
    npx create-react-app my-app --template redux-typescript
```

```yarn
    yarn add @reduxjs/toolkit
```

## Api:

### configureStore()

利用简化的配置选项和默认设置来设置你的 createStore,可以扩展各种中间件。默认内置 redux-thunk，默认开启 Redux DevTools Extension。

```ts
// file: /store/todos/todosReducer.ts noEmit
import { Reducer } from "@reduxjs/toolkit";
declare const reducer: Reducer<{}>;
export default reducer;

// file: /store/visibility/visibilityReducer.ts noEmit
import { Reducer } from "@reduxjs/toolkit";
declare const reducer: Reducer<{}>;
export default reducer;

// file: /store/index.ts
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
```
