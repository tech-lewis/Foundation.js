// 组件化
class Component {
    constructor(options) {
      this.template = options.template;
      this.data = typeof options.data === 'function' ? options.data() : options.data;
      this.methods = options.methods;
    }
  }
  
  const components = {};
  
  function registerComponent(name, options) {
    components[name] = new Component(options);
  }
  
  // 这个函数将对象的属性定义为响应式的，通过Object.defineProperty拦截属性的get和set操作，关联依赖收集和通知更新。
  function defineReactive(obj, key, val) {
    const dep = new Dep();
    let childOb = observe(val); // 递归观察
  
    Object.defineProperty(obj, key, {
      get: function () {
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(val)) {
              dependArray(val);
            }
          }
        }
        return val;
      },
      set: function (newVal) {
        if (newVal !== val) {
          val = newVal;
          childOb = observe(newVal); // 递归观察新值
          dep.notify();
        }
      }
    });
  }
  
  function Dep() {
    this.subscribers = [];
  }
  //Dep是一个依赖收集器，当属性发生变化时，通知所有依赖更新。Dep.target用于存储当前的Watcher，以便在get时收集依赖。
  Dep.target = null;
  
  Dep.prototype.depend = function () {
    if (Dep.target && this.subscribers.indexOf(Dep.target) === -1) {
      this.subscribers.push(Dep.target);
    }
  };
  
  Dep.prototype.notify = function () {
    const subs = this.subscribers.slice();
    for (let i = 0; i < subs.length; i++) {
      subs[i]();
    }
  };
  // observe函数用于观察对象或数组，递归调用defineReactive来处理每个属性或数组元素。
  function observe(obj) {
    if (Array.isArray(obj)) {
      augmentArray(obj);
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          defineReactive(obj, key, obj[key]);
        }
      }
    }
    return obj.__ob__;
  }
  
  // 这个函数增强了数组的原型方法，使得数组的变更操作（如push、pop等）能够触发依赖更新。
  function augmentArray(array) {
    const arrayProto = Array.prototype;
    const arrayMethods = Object.create(arrayProto);
    const methodsToPatch = [
      'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'
    ];
  
    methodsToPatch.forEach(function (method) {
      const original = arrayProto[method];
      Object.defineProperty(arrayMethods, method, {
        value: function mutator() {
          const args = [].slice.call(arguments);
          const result = original.apply(this, args);
          const ob = this.__ob__;
          let inserted;
          switch (method) {
            case 'push':
            case 'unshift':
              inserted = args;
              break;
            case 'splice':
              inserted = args.slice(2);
              break;
          }
          // 递归观察数组的每个元素。
          if (inserted) observeArray(inserted);
          ob.dep.notify();
          return result;
        },
        enumerable: false,
        writable: true,
        configurable: true
      });
    });
  
    Object.defineProperty(array, '__ob__', {
      value: {
        dep: new Dep()
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
  
    array.__proto__ = arrayMethods;
  }
  
  function observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
  // 确保数组中的每个元素都能被正确依赖。
  function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }
  // 这个函数解析模板指令（如v-model和v-for），并设置相应的事件监听和观察者。
  function compile(node, vm) {
    if (node.nodeType === 1) { // 元素节点
      const tagName = node.tagName.toLowerCase();
      if (components[tagName]) {
        const component = components[tagName];
        const data = typeof component.data === 'function' ? component.data() : component.data;
        observe(data);
        const methods = component.methods;
  
        let componentVm = {};
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            // componentVm是组件的视图模型（ViewModel），用于存储组件的数据（data）和方法（methods）。在组件化系统中，我们需要将组件的数据和方法绑定到一个视图模型对象中，并在编译模板时使用该视图模型对象。这使得组件拥有自己的独立作用域，不会与其他组件或全局数据混淆。
            // 具体来说，componentVm 的作用如下：
            // 1 存储组件的数据：将组件的数据存储在 componentVm 中，以便在模板编译过程中能够访问和更新这些数据。
            // 2 绑定组件的方法：将组件的方法绑定到 componentVm 上，以便在模板中调用这些方法时，能够正确地引用组件实例。
            (function (componentVm, key, data) {
              Object.defineProperty(componentVm, key, {
                get: function () {
                  return data[key];
                },
                set: function (newVal) {
                  data[key] = newVal;
                }
              });
            })(componentVm, key, data);
          }
        }
  
        for (const key in methods) {
          if (methods.hasOwnProperty(key)) {
            componentVm[key] = methods[key].bind(componentVm);
          }
        }
  
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = component.template.trim();
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        compileNode(fragment, componentVm);
        node.parentNode.replaceChild(fragment, node);
        return;
      }
  
      const attrs = node.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attrName = attrs[i].name;
        const exp = attrs[i].value;
  
        if (attrName === 'v-model') {
          node.value = vm[exp];
          node.addEventListener('input', (function (exp) {
            return function (e) {
              vm[exp] = e.target.value;
            };
          })(exp));
        } else if (attrName === 'v-for') {
          const parts = exp.split(' in ');
          const item = parts[0].trim();
          const arr = parts[1].trim();
          node.removeAttribute('v-for');
          const parentNode = node.parentNode;
          const placeholder = document.createComment('v-for');
          parentNode.insertBefore(placeholder, node);
          parentNode.removeChild(node);
  
          function renderList() {
            const items = vm[arr];
            while (parentNode.firstChild && parentNode.firstChild !== placeholder) {
              parentNode.removeChild(parentNode.firstChild);
            }
            for (let i = 0; i < items.length; i++) {
              const clone = node.cloneNode(true);
              (function (clone, item, value) {
                clone.textContent = clone.textContent.replace(/\{\{\s*item\s*\}\}/g, value);
                parentNode.insertBefore(clone, placeholder);
              })(clone, item, items[i]);
            }
          }
  
          new Watcher(vm, arr, renderList);
          renderList();
        } else if (attrName.startsWith('v-bind:') || attrName.startsWith('@')) {
          const eventType = attrName.startsWith('v-bind:') ? attrName.slice(7) : attrName.slice(1);
          bindEvent(node, eventType, exp, vm);
        } else if (attrName === 'v-show') {
          (function (node, exp) {
            function updateVisibility() {
              node.style.display = vm[exp] ? '' : 'none';
            }
            updateVisibility();
            new Watcher(vm, exp, updateVisibility);
          })(node, exp);
        }
      }
    } else if (node.nodeType === 3) { // 文本节点
      const text = node.textContent;
      const reg = /\{\{(.+?)\}\}/g;
      const match = reg.exec(text);
      if (match) {
        (function (node, exp) {
          const initialText = text;
          function updateText() {
            node.textContent = initialText.replace(reg, function (match, p1) {
              return vm[p1.trim()];
            });
          }
          updateText();
          new Watcher(vm, exp, updateText);
        })(node, match[1].trim());
      }
    }
  }
  
  function bindEvent(node, eventType, exp, vm) {
    if (typeof vm[exp] === 'function') {
      node.addEventListener(eventType, function (e) {
        vm[exp](e);
      });
    } else {
      console.error(`Error: ${exp} is not a function.`);
    }
  }
  
  
  // Watcher在定义时会立即获取当前值，并将回调函数注册到依赖中。当依赖发生变化时，调用回调函数更新视图。
  function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
  }
  
  Watcher.prototype.get = function () {
    Dep.target = this.update.bind(this);
    const value = this.vm[this.exp];
    Dep.target = null;
    return value;
  };
  
  Watcher.prototype.update = function () {
    const newVal = this.vm[this.exp];
    this.cb(newVal);
  };
  
  // 函数初始化数据对象，设置数据观察，并编译模板节点
  function MVVM(options) {
    this.data = options.data;
    this.methods = options.methods;
  
    observe(this.data);
  
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        (function (vm, key) {
          Object.defineProperty(vm, key, {
            get: function () {
              return vm.data[key];
            },
            set: function (newVal) {
              vm.data[key] = newVal;
            }
          });
        })(this, key);
      }
    }
  
    for (const key in this.methods) {
      if (this.methods.hasOwnProperty(key)) {
        this[key] = this.methods[key];
      }
    }
  
    const app = document.getElementById(options.el);
    compileNode(app, this);
  }
  
  function compileNode(node, vm) {
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      compile(childNodes[i], vm);
    }
  }
  
  function compileNode(node, vm) {
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      compile(childNodes[i], vm);
      if (childNodes[i].childNodes && childNodes[i].childNodes.length) {
        compileNode(childNodes[i], vm);
      }
    }
  }
  
  // 设置组件
  registerComponent('my-component', {
    template: `<div>
                    <p>{{ message }}</p>
                    <button @click="reverseMessage">Reverse Message</button>
                  </div>`,
    data: function () {
      return {
        message: 'Hello from component'
      };
    },
    methods: {
      reverseMessage: function () {
        this.message = this.message.split('').reverse().join('');
      }
    }
  });
  
  
  const vm = new MVVM({
    el: 'app',
    data: {
      message: 'Hello World',
      items: ['Item 1', 'Item 2', 'Item 3'],
      isVisible: true
    },
    methods: {
      addItem: function () {
        this.items.push('New Item' + new Date().getTime());
      },
      logMessage: function () {
        console.log(this.message);
        alert(this.message);
      },
      toggleVisibility: function () {
        this.isVisible = !this.isVisible;
      }
    }
  });
  