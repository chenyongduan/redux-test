export function countReducer(state = { count: 0 }, action) {
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

export function stringReducer(state = { title: "init string" }, action) {
  const { type, payload } = action;
  switch (type) {
    case "CHANGE_STRING":
      return { ...state, title: payload };
    default:
      return state;
  }
}
