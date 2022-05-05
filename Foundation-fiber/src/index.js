import React from 'react';
import ReactDom from 'react-dom';
import _ from './js/loadsh'

// element  React.createElement 的返回值 就是element这样一个概念.

// jsx
// ReactDom.render(React.createElement("div", {
//     id: "haha"
//   }, " hello world "), document.querySelector('#app'));


// Component在源码中其实是有3种类型

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

// instance 
// new App()  

// 1. ReactDom.render
// 2. React.createElement
// 3. React.Component   渲染满足
// 4. 更新  

console.warn('hello world!');
// _.chunk(array,[size=1]) loadsh学习笔记
    // 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。
    
    let array = [1,2,3,4,5,6,7,8,9,10];
    // @params array 需要处理的数组
    // @params [size=1] (number) 每个数组区块的长度
    let res = _.chunk(array,2)  // [[1,2],[3,4],[5,6],[7,8],[9,10]]
    let res1 = _.chunk(array,3)  // [[1,2,3],[4,5,6],[7,8,9],[10]]
    console.log(res)
    console.log(res1)
    console.info('---------------------chunk-------------------------')

    // _.compact(array)
    // 创建一个新数组，包含原数组中所有的非假值元素。例如false, null, 0, "", undefined, 和 NaN 都是被认为是“假值”。
    // @params array(Array)待处理数组
    // (Array): 返回过滤掉假值的新数组。
    let arr2 = [0,1,undefined,null,true,false,'true'];
    let res2 = _.compact(arr2);
    console.log(arr2); // [0,1,undefined,null,true,false,'true'];
    console.log(res2); // [1,true,'true']
    
    console.info('----------------------------------------------')

    // _.concat(array, [values])
    // @params array (Array): 被连接的数组。
    // @params [values] (...*): 连接的值。
    // (Array): 返回连接后的新数组。
    let arr3 = [1,{name:'dongwenjie'}];
    let arr4 = _.concat(arr3,1,2,[3],null,1111,"1111")
    console.log(arr3)
    console.log(arr4)

    console.info('----------------------------------------------')

    // _.difference(array, [values])
    // 创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中。（即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）该方法使用 SameValueZero做相等比较。结果值的顺序是由第一个数组中的顺序确定。 
    // @params  array (Array): 要检查的数组。
    // @params  [values] (...Array): 排除的值。
    // (Array): 返回一个过滤值后的新数组。
    let arr5 = [1,'dongwenjie','董文杰',18,null];
    let arr6 = [null,undefined,18];
    let res3 = _.difference(arr5,arr6);
    console.log(res3)

    console.info('----------------------------------------------')

    //_.differenceBy(array, [values], [iteratee=_.identity])
    // 这个方法类似 _.difference ，除了它接受一个 iteratee （迭代器）， 调用array 和 values 中的每个元素以产生比较的标准。 结果值是从第一数组中选择。iteratee 会调用一个参数：(value)。（首先使用迭代器分别迭代array 和 values中的每个元素，返回的值作为比较值）。
    // @params  array(Array)   要检查的数组。
    // @params  [values] (...Array): 排除的值。
    // [iteratee=_.identity] (Array|Function|Object|string): iteratee 调用每个元素。
    // (Array): 返回一个过滤值后的新数组。
    let arr7 = [1.2,2.2,2.6,3.8,4.5]
    let arr8 = [1.6,2.4,4.8]
    let res4 = _.differenceBy(arr7,arr8,Math.ceil)
    console.log(res4) 

    console.info('----------------------------------------------')

    // _.differenceWith(array, [values], [comparator])
    // 这个方法类似 _.difference ，除了它接受一个 comparator （比较器），它调用比较array，values中的元素。 结果值是从第一数组中选择。comparator 调用参数有两个：(arrVal, othVal)。 
    // array (Array): 要检查的数组。
    // [values] (...Array): 排除的值。
    // [comparator] (Function): comparator 调用每个元素。
    // (Array): 返回一个过滤值后的新数组。
    let arr9 = [
        {'name':'dongwenjie','age':16},
        {'name':'jianghui','age':25},
    ]
    console.log(_.differenceWith(arr9,[{'name':'dongwenjie','age':16}],_.isEqual)) 


    console.info('----------------------------------------------')

    // _.drop(array, [n=1])
    // 创建一个切片数组，去除array前面的n个元素。（n默认值为1。）
    // @params array (Array): 要查询的数组。
    // @params [n=1] (number): 要去除的元素个数。
    //  (Array): 返回array剩余切片。
    let arr10 = [1,2,3,4,5,888];
    let n = 2
    console.log(_.drop(arr10,[n=n]))   // 将一个数组前两项切掉，返回一个新数组
    console.log(arr10)

    console.info('----------------------------------------------')

    // _dropRight(array,[n=1])
    // 创建一个切片数组，去除array尾部的n个元素。（n默认值为1。）
    // array (Array): 要查询的数组。
    // [n=1] (number): 要去除的元素个数。
    // (Array): 返回array剩余切片。
    console.log(_.dropRight([1,2,3,4,5,'我想切你'],1))

    console.info('----------------------------------------------')

    // _.dropRightWhile(array, [predicate=_.identity])
    // 从右边开始切，返回值为true就切，直到切到不符合条件为止，不是全过滤！
    var users = [
        { 'user': 'fred',    'active': false },
        { 'user': 'barney',  'active': true },
        { 'user': 'pebbles', 'active': false }
    ];
    
    console.log(_.dropRightWhile(users, function(o) { return !o.active; }))

    console.info('----------------------------------------------')

    //_.dropWhile(array, [predicate=_.identity])
    // 跟上一个方法类似 这个是从左边开始切
    console.log(_.dropWhile(users, function(o) { return !o.active; }))

    console.info('----------------------------------------------')
    

    // _.fill(array, value, [start=0], [end=array.length])
    var arr11 = [1,2,3,null,undefined,888]
    console.log(_.fill(arr11,'*',1,arr11.length-1))

    console.info('----------------------------------------------')


    //_.findIndex(array, [predicate=_.identity], [fromIndex=0])
    // 该方法类似 _.find，区别是该方法返回第一个通过 predicate 判断为真值的元素的索引值（index），而不是元素本身。
    var arr12 = [{'name':'董文杰','age':25},{'name':'蒋卉','age':50},{'name':'马璐佳','age':25},{'name':'蒋卉','age':50}]
    console.log(_.findIndex(arr12,(o)=>{
        return o.name = '董文杰'
    }))
    console.log(_.findIndex(arr12,{'name':'蒋卉','age':50}))


    console.info('----------------------------------------------')

    // _.findLastIndex(array, [predicate=_.identity], [fromIndex=array.length-1]
    // 这个方式类似 _.findIndex， 区别是它是从右到左的迭代集合array中的元素。

    var arr13 = [{'name':'董文杰','age':25},{'name':'蒋卉','age':50},{'name':'马璐佳','age':25},{'name':'蒋卉','age':50}]
    console.log(_.findLastIndex(arr13,(o)=>{
        return o.name = '蒋卉'
    }))
    console.log(_.findLastIndex(arr13,{'name':'蒋卉','age':50}))


    console.info('----------------------------------------------')
