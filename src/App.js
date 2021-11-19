import { useEffect } from "react";
import testModel from "./redux/testModel";
import "./App.css";

function App() {
  const { count, title } = testModel.useData();

  useEffect(() => {
    testModel.addCount(1);
    testModel.getTitle();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="row-section">
          <button
            onClick={() => {
              testModel.addCount(1);
            }}
          >
            +
          </button>
          <p>{count}</p>
          <button
            onClick={() => {
              testModel.minusCount(1);
            }}
          >
            -
          </button>
        </div>
        <p>{title}</p>
        <button
          onClick={() => {
            testModel.getTitle("effect title change");
          }}
        >
          change title
        </button>
      </header>
    </div>
  );
}

export default App;
