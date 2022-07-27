import React from 'react';
import ReactDom from 'react-dom';
import _ from './js/loadsh'

// element  React.createElement 的返回值 就是element这样一个概念.
// render函数返回的是一个对象，而不是真正的DOM节点
// jsx
// ReactDom.render(React.createElement("div", {
//     id: "haha"
//   }, " hello world "), document.querySelector('#app'));


// Component在源码中其实是有3种类型： DOM/Text字符串/Composite Component复合组件 比如App组件为类组件

// App是 CompositeComponent 代表
class App extends React.Component {
    constructor() {
        super();
        state = {
        }
    }

    render() {
        <div>app</div>
    }
}

// <div>hello world</div> 是 DomComponent的代表
// console.log(React.createElement('App', { id: 'app' }));
// ReactDom.render(<div>hello world</div>, document.querySelector('#app'));

// TextComponent 的代表
ReactDom.render(<div
  style={{ 
    color: '#ff8000',
    fontSize: '33px',
    fontFamily: 'PingFangSC-Medium'
}}>hello, world</div>, document.querySelector('#app'));

// instance 创建3种类型的component
// new App()  

// 1. ReactDom.render
// 2. React.createElement
// 3. React.Component   渲染满足
// 4. 更新  
// 5
