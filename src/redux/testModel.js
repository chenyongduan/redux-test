import sleep from "sleep-promise";
import { definedModel } from "./definedModel";

const testModel = definedModel("testModel", {
  initialState: { count: 0, title: "effect title" },
  actions: {
    addCount(state, count = 1) {
      state.count += count;
    },
    minusCount(state, count = 1) {
      return {
        count: state.count - count,
      };
    },
  },
  effects: {
    async getTitle(title) {
      await sleep(1000);
      this.addCount();
      this.dispatch({
        title: title || "effect sleep",
      });
      this.getTitle11();
      return "ok";
    },
    async getTitle11(title) {
      await sleep(1000);
      this.dispatch({
        title: title || "effect sleep 2",
      });
      return "ok";
    },
  },
});

export default testModel;
