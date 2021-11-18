export function addCount(count) {
  return {
    type: "ADD_COUNT",
    payload: count,
  };
}

export function minusCount(count) {
  return {
    type: "MINUS_COUNT",
    payload: count,
  };
}

export function changeString(str) {
  return {
    type: "CHANGE_STRING",
    payload: str,
  };
}
