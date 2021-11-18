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
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
