import { combineReducers } from "redux";
import { useSelector } from "react-redux";
import { store } from "./store";

const reducers = {};

export function definedModel(name, options) {
  const { initialState, actions, effects } = options;
  const actionKeys = Object.keys(actions || {});
  const effectKeys = Object.keys(effects || {});

  // add reducer
  function reducerFn(state = initialState, action) {
    const { type, payload } = action;
    if (actionKeys.indexOf(type) !== -1 || effectKeys.indexOf(type) !== -1) {
      return payload;
    }
    return state;
  }
  reducers[name] = reducerFn;
  store.replaceReducer(combineReducers(reducers));

  const obj = {};

  // deal actions
  actionKeys.forEach((key) => {
    const fn = actions[key];
    obj[key] = (...args) => {
      const totalState = store.getState();
      const preState = totalState[name];
      const nextState = fn(preState, ...args);
      store.dispatch({
        type: key,
        payload: Object.assign({}, preState, nextState),
      });
    };
  });

  // deal effects
  effectKeys.forEach((key) => {
    const fn = effects[key];
    obj[key] = (...args) => {
      const totalState = store.getState();
      const preState = totalState[name];
      const that = {
        ...obj,
        dispatch: (state) => {
          if (!state) return;
          if (Object.prototype.toString.call(state) !== "[object Object]") {
            console.log("input must object.");
            return;
          }
          store.dispatch({
            type: key,
            payload: Object.assign({}, preState, state),
          });
        },
      };
      fn.apply(that, [...args]);
    };
  });

  // useData
  function useData(fn) {
    return useSelector((state) => {
      const curState = state[name];
      return fn ? fn(curState) : curState;
    });
  }

  obj.useData = useData;

  return obj;
}
