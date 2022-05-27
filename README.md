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

### createReducer()和 createAction()

[createAction](https://redux-toolkit.js.org/api/createAction)

[createReducer](https://redux-toolkit.js.org/api/createReducer)

redux-toolkit 简化了 redux 中的 switch case。

简单案例：

```ts
import { createAction, createReducer } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const increment = createAction("counter/increment");
const decrement = createAction("counter/decrement");
const incrementByAmount = createAction<number>("counter/incrementByAmount");

const initialState = () => CounterState{
  return { value: 0 };
};

// initialState :state | ()=>state
// builderCallback (builder)=>void
const counterReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(increment, (state, action) => {
      state.value++;
    })
    .addCase(decrement, (state, action) => {
      state.value--;
    })
    .addCase(incrementByAmount, (state, action) => {
      state.value += action.payload;
    });
});
```

### builder.addCase(actionCreator,reducer(state,action))

添加一个 case reducer 处理 action。addCase()必须在 addMatcher 和 addDefaultCase 之前调用

actionCreator：传入 createAction 定义的 action。reducer：实际的 reducer 函数。

### builder.addMatcher

action 过滤器:

```ts
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

### builder.addDefaultCase

添加默认的 reducer，如果所有的 action.type 都没有匹配上，执行该 addDefaultCase

```ts
import { createReducer } from "@reduxjs/toolkit";
const initialState = { otherActions: 0 };
const reducer = createReducer(initialState, (builder) => {
  builder
    // .addCase(...)
    // .addMatcher(...)
    .addDefaultCase((state, action) => {
      state.otherActions++;
    });
});
```

### createSlice()

它是一个函数，接收初始 state 和 reducer 函数对象。可以自动生成 reducer 和状态相对应的动作。

它是编写 redux 逻辑的标准方法。

它的内部调用 createAction 和 createReducer 方法。

示例：

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState = { value: 0 } as CounterState;

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value++;
    },
    decrement(state) {
      state.value--;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

```ts
function createSlice({
    // action的名称
    name: string,
    // 初始值
    initialState: any,
    //action动作
    reducers: Object<string, ReducerFunction | ReducerAndPrepareObject>
    // 扩展器，(builder)=>builder.addCase().addMatcher().addDefaultCase()
    extraReducers?:
    | Object<string, ReducerFunction>
    | ((builder: ActionReducerMapBuilder<State>) => void)
})
```
