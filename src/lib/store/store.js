import { applyMiddleware, createStore } from "redux";

function logger({ getState }) {
  return (next) => (action) => {
    console.log("will dispatch", action);
    console.log("state begin dispatch", getState());
    let returnValue = next(action);
    console.log("state after dispatch", getState());
    return returnValue;
  };
}

export const store = createStore(() => {}, applyMiddleware(logger));
