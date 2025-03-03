function Component(props) {
  this.props = props;
}

// 把方法加在原型链上
Component.prototype.isComponent = {};
export { Component };
