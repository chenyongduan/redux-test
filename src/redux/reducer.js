const countInitialState = { count: 0 };

export function countReducer(state = countInitialState, action) {
  const { type, payload } = action;
  switch (type) {
    case "ADD_COUNT":
      return { ...state, count: state.count + payload };
    case "MINUS_COUNT":
      return { ...state, count: state.count - payload };
    default:
      return state;
  }
}

const stringInitialState = { title: "init string" };

export function stringReducer(state = stringInitialState, action) {
  const { type, payload } = action;
  switch (type) {
    case "CHANGE_STRING":
      return { ...state, title: payload };
    default:
      return state;
  }
}
