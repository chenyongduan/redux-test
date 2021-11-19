import { combineReducers } from "redux";
import { useSelector } from "react-redux";
import produce from "immer";
import { store } from "../store/store";

const reducers = {};

function getActionType(modelName, actionName) {
  return `${modelName}-${actionName}`;
}

function getActionLoadingType(modelName) {
  return `${modelName}-LOADING`;
}

export function definedModel(name, options) {
  const { initialState, actions, effects } = options;
  const actionKeys = Object.keys(actions || {});
  const effectKeys = Object.keys(effects || {});

  // add reducer
  function reducerFn(state = { ...initialState, selfLoading: {} }, action) {
    const { type, payload } = action;
    if (
      actionKeys.find((key) => getActionType(name, key) === type) ||
      effectKeys.find((key) => getActionType(name, key) === type) ||
      type === getActionLoadingType(name)
    ) {
      return payload;
    }
    return state;
  }
  reducers[name] = reducerFn;
  store.replaceReducer(combineReducers(reducers));

  const obj = {};

  // deal actions
  actionKeys.forEach((actionName) => {
    const fn = actions[actionName];
    obj[actionName] = (...args) => {
      const totalState = store.getState();
      const preState = totalState[name];
      const nextState = produce(preState, (draft) => {
        const newState = fn(draft, ...args);
        if (newState) {
          Object.assign(draft, newState);
        }
      });
      store.dispatch({
        type: getActionType(name, actionName),
        payload: nextState,
      });
    };
  });

  // deal effects and loading
  effectKeys.forEach((effectName) => {
    const fn = effects[effectName];
    obj[effectName] = (...args) => {
      const totalState = store.getState();
      const preState = totalState[name];
      const that = {
        ...obj,
        getState: () => preState,
        dispatch: (state) => {
          if (!state) return;
          if (Object.prototype.toString.call(state) !== "[object Object]") {
            console.log("input must object.");
            return;
          }
          const nextState = produce(preState, (draft) => {
            Object.assign(draft, state);
          });
          store.dispatch({
            type: getActionType(name, effectName),
            payload: nextState,
          });
          setLoading(effectName, false);
        },
      };
      setLoading(effectName, true);
      fn.apply(that, [...args]);
    };
    obj[effectName].useLoading = function useLoading() {
      return useSelector((state) => {
        const curState = state[name];
        const { selfLoading } = curState;
        return selfLoading[effectName];
      });
    };

    obj[effectName].getModelName = () => name;
    obj[effectName].getName = () => effectName;
  });

  // set loading action
  function setLoading(actionName, isLoading = false) {
    const totalState = store.getState();
    const preState = totalState[name];
    const nextState = produce(preState, (draft) => {
      draft.selfLoading[actionName] = isLoading;
    });
    store.dispatch({
      type: getActionLoadingType(name),
      payload: nextState,
    });
  }

  // useData
  obj.useData = function useData(fn) {
    return useSelector((state) => {
      const curState = state[name];
      return fn ? fn(curState) : curState;
    });
  };

  return obj;
}

// useLoading
export function useLoading(...args) {
  const nameList = args.map((fn) => {
    return { modelName: fn.getModelName(), effectName: fn.getName() };
  });
  return useSelector((state) => {
    if (nameList.length === 0) return false;
    let loading = false;
    nameList.forEach(({ modelName, effectName }) => {
      const curState = state[modelName];
      const { selfLoading } = curState;
      if (selfLoading[effectName]) {
        loading = true;
      }
    });
    return loading;
  });
}
