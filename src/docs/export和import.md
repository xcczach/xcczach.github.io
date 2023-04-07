### 静态化（编译时确定依赖关系）
- `require`为运行时加载，将模块绑定到*对象*上
```
let _fs = require('fs')
```
### 优缺点
- 优点：高效 静态分析（e.g.类型检验）
- 缺点：*模块本身无法引用*
### 语法
#### export
```
export let variable = "something";
```
```
let variable = "something";
export { variable };
```
变量重命名：
```
function v1() {}
export {
    v1 as funcV1
}
```
#### export default
```
// myfunc.js
export default function() {
    console.log("hello");
}
```
```
function test() {
    console.log("hello");
}
export default test;
```
```
function test() {
    console.log("hello");
}
export {test as default};
```
对应import：
```
import nameForTheFunc from "./myfunc.js";
nameForTheFunc();
```
```
import {default as nameForTheFunc} from "./myfunc.js";
nameForTheFunc();
```
### 注意
#### 变量动态绑定
```
export let a = 1;
setTimeout(() => a = 2, 500);
```
500ms后a的值改变
#### default为变量
```
//错误
export default let a = 1;
//正确
let a = 1;
export default a;
//正确
export default 1;
```