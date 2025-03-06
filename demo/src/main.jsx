import { ReactDOM, Component, useReducer, useState } from "../which-react.js";
// import { Component } from "react";
import "./index.css";

function FunctionComponent(props) {
  const [count, setCount] = useReducer((x) => x + 1, 0);
  const [count2, setCount2] = useState(1);

  return (
    <div className="border">
      <p>{props.name}</p>
      <button onClick={() => setCount()}>{count}</button>
      <button onClick={() => setCount2(count2 + 1)}>{count2}</button>

      {count % 2 ? <div>omg</div> : <span>123</span>}
    </div>
  );
}

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <h3>{this.props.name}</h3>
        我是文本
        <h4>我是文本1</h4>
      </div>
    );
  }
}

function FragmentComponent() {
  return (
    <ul>
      <>
        <li>part1</li>
        <li>part2</li>
      </>
    </ul>
  );
}

const jsx = (
  <div className="border">
    <h1>react1</h1>
    <a href="https://github.com/bubucuo/mini-react">mini react1</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <FragmentComponent />
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(jsx);

// ReactDOM.render(jsx, document.getElementById("root"));
