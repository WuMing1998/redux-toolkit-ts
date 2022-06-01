hello,这里是学习 redux-toolkit 的笔记和实验项目。

# install

```cmd
    npx create-react-app my-app --template redux-typescript
```

```yarn
    yarn add @reduxjs/toolkit
```

# Api:

## configureStore()

利用简化的配置选项和默认设置来设置你的 createStore,可以扩展各种中间件。默认内置 redux-thunk，默认开启 Redux DevTools Extension。

https://redux-toolkit.js.org/api/configureStore

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

## createReducer()和 createAction()

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

## createSlice()

它是一个函数，接收初始 state 和 reducer 函数对象。可以自动生成 reducer 和状态相对应的动作。

它是编写 redux 逻辑的标准方法。

它的内部调用 createAction 和 createReducer 方法。

https://redux-toolkit.js.org/api/createSlice

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

## createAsyncThunk()

redux-toolkit 的异步处理方法。

https://redux-toolkit.js.org/api/createAsyncThunk

简单示例：

```ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "./userAPI";

// 创建thunk
const fetchUserById = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId: number, thunkAPI) => {
    if (fetchStatus === "fulfilled" || fetchStatus === "loading") {
      // 如果数据已经获取，可以使用这里中断thunk
      return false;
    }
    try {
      const response = await userAPI.fetchById(userId);
      return response.data;
    } catch (err) {
      //`err.response.data` `action.payload` `rejected`
      //使用rejectWithValue捕获错误信息
      return rejectWithValue(err.response.data);
    }
  }
);

interface UsersState {
  entities: [];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  entities: [],
  loading: "idle",
} as UsersState;

// 处理thunk中的异步函数
// 每个生成的thunk有自动生成的动作。 pending、fulfilled、rejected 请求中、请求完成、拒绝请求
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 这里根据你的需求添加不同状态下的处理方法
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.entities.push(action.payload);
    });
  },
});

dispatch(fetchUserById(123));
```

createAsyncThunk(type,payloadCreator(arg,thunkAPI))=> redux thunk action creator

### type

'users/requestStatus' 会自动生成 type 状态 => pending、fulfilled、rejected 请求中、请求完成、拒绝请求

'users/requestStatus/pending'

'users/requestStatus/fulfilled'

'users/requestStatus/rejected'

### payloadCreator(arg,thunkAPI)

arg: number | object | string

thunkAPI: 它包括传递给 redux thunk 函数的所有参数和其他的方法 =>

dispatch

getState

extra（扩展）

requestId（自动生成唯一 id）

rejectWithValue(value, [meta])（reject 时传递 value 到 rejected 状态）

fulfillWithValue(value, meta)（fulfill 时获取）

### 处理 thunk

createAsyncThunk()始终会返回一个 fulfilled 状态的回调。

在 thunk 返回的 Proimise 中包含 unwrap 和 unwrapResult。可以使用它们来判断请求是否失败

简单示例：

unwrap()

```ts
const onClick = async () => {
  try {
    const originalPromiseResult = await dispatch(
      fetchUserById(userId)
    ).unwrap();
    // handle result here
  } catch (rejectedValueOrSerializedError) {
    // handle error here
  }
};
```

unwrapResult()

```ts
import { unwrapResult } from "@reduxjs/toolkit";

// in the component
const onClick = async () => {
  try {
    const resultAction = await dispatch(fetchUserById(userId));
    const originalPromiseResult = unwrapResult(resultAction);
    // handle result here
  } catch (rejectedValueOrSerializedError) {
    // handle error here
  }
};
```

## createEntityAdapter()

用于预生成 reducer 和选择器，对特定结构的对象实例执行 CRUD 操作。

https://redux-toolkit.js.org/api/createEntityAdapter

简单示例：

```ts
import {
  createEntityAdapter,
  createSlice,
  configureStore,
} from "@reduxjs/toolkit";

type Book = { bookId: string; title: string };

const booksAdapter = createEntityAdapter<Book>({
  // 假设book的主键是bookId
  selectId: (book) => book.bookId,
  // 数据根据标题进行排序
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const booksSlice = createSlice({
  name: "books",
  initialState: booksAdapter.getInitialState(),
  reducers: {
    // 可以将适配器函数直接传递。这里它被视为一个值
    // createSlice会自动生成bookAdded action、type、creator
    bookAdded: booksAdapter.addOne,
    booksReceived(state, action) {
      // 也可以扩展其他的方法
      booksAdapter.setAll(state, action.payload.books);
    },
  },
});

const store = configureStore({
  reducer: {
    books: booksSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

console.log(store.getState().books);
// { ids: [], entities: {} }

// 创建State的选择器
const booksSelectors = booksAdapter.getSelectors<RootState>(
  (state) => state.books
);

// 使用booksSelectors来检索数据
const allBooks = booksSelectors.selectAll(store.getState());
```

### createEntityAdapter(selectId(entity => entity.id),sortComparer(entityNext,entityPre))

selectId:

唯一索引，不传默认为：entity => entity.id。如果使用其他索引名作为唯一索引，请在 selectId 中返回它。

例：(book) => book.bookId

sortComparer：

传递两个 entity 示例。返回结果应该是标准的 Array.sort()返回值（1,0,-1）将根据返回值进行自动排序.

如果未提供 sortComparer 方法。默认不排序,且 addOne(), updateMany()方法不会启动

