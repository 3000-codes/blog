# Vue 3响应式系统实现：核心代码拆解

## 1. 响应式系统核心架构

Vue 3的响应式系统基于以下核心组件：

- **Proxy**：用于拦截对象的访问和修改
- **Effect**：副作用函数，用于依赖收集和触发更新
- **Track**：依赖收集函数
- **Trigger**：触发更新函数
- **Reactive/Ref**：创建响应式数据的API

## 2. 核心实现代码拆解

### 2.1 依赖收集与触发更新

```javascript
// 全局当前活跃的effect
let activeEffect = null;

// 依赖收集函数
function track(target, key) {
  if (!activeEffect) return;
  
  // 获取target对应的依赖映射
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  // 获取key对应的依赖集合
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  
  // 将当前effect添加到依赖集合中
  dep.add(activeEffect);
  
  // 将依赖集合添加到effect的deps中，用于清理
  activeEffect.deps.push(dep);
}

// 触发更新函数
function trigger(target, key) {
  // 获取target对应的依赖映射
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  // 获取key对应的依赖集合
  const dep = depsMap.get(key);
  if (!dep) return;
  
  // 执行所有依赖的effect
  dep.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}
```

### 2.2 Effect实现

```javascript
class ReactiveEffect {
  constructor(fn, scheduler = null) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.deps = []; // 存储依赖集合，用于清理
  }
  
  run() {
    // 设置当前活跃的effect
    activeEffect = this;
    
    // 清理之前的依赖
    this.cleanup();
    
    try {
      // 执行副作用函数，触发依赖收集
      return this.fn();
    } finally {
      // 重置当前活跃的effect
      activeEffect = null;
    }
  }
  
  cleanup() {
    // 从所有依赖集合中移除当前effect
    for (let i = 0; i < this.deps.length; i++) {
      this.deps[i].delete(this);
    }
    this.deps.length = 0;
  }
}

// effect函数
function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  
  // 立即执行一次，触发依赖收集
  _effect.run();
  
  // 返回runner函数，可以手动触发effect
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  
  return runner;
}
```

### 2.3 Reactive实现

```javascript
// 响应式对象映射表，用于缓存已创建的响应式对象
const reactiveMap = new WeakMap();

// 深度响应式转换
function createReactiveObject(target, isReadonly = false, isShallow = false) {
  // 非对象类型直接返回
  if (typeof target !== 'object' || target === null) {
    return target;
  }
  
  // 检查是否已经是响应式对象
  const existingProxy = reactiveMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  
  // 创建Proxy处理器
  const handlers = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      
      // 依赖收集
      if (!isReadonly) {
        track(target, key);
      }
      
      // 深度响应式转换（如果不是浅层响应式）
      if (!isShallow && typeof result === 'object' && result !== null) {
        return isReadonly ? readonly(result) : reactive(result);
      }
      
      return result;
    },
    
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      
      // 只有当值发生变化时才触发更新
      if (oldValue !== value) {
        trigger(target, key);
      }
      
      return result;
    },
    
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);
      
      // 只有当属性存在时才触发更新
      if (hadKey) {
        trigger(target, key);
      }
      
      return result;
    }
  };
  
  // 创建并返回Proxy对象
  const proxy = new Proxy(target, handlers);
  
  // 缓存响应式对象
  reactiveMap.set(target, proxy);
  
  return proxy;
}

// reactive函数 - 创建深度响应式对象
function reactive(target) {
  return createReactiveObject(target, false, false);
}

// shallowReactive函数 - 创建浅层响应式对象
function shallowReactive(target) {
  return createReactiveObject(target, false, true);
}

// readonly函数 - 创建只读响应式对象
function readonly(target) {
  return createReactiveObject(target, true, false);
}
```

### 2.4 Ref实现

```javascript
class RefImpl {
  constructor(value, isShallow = false) {
    this._isRef = true;
    this._isShallow = isShallow;
    // 如果不是浅层ref且值是对象，转换为响应式对象
    this._value = isShallow ? value : toReactive(value);
  }
  
  get value() {
    // 依赖收集
    track(this, 'value');
    return this._value;
  }
  
  set value(newValue) {
    // 如果值发生变化
    if (newValue !== this._value) {
      // 保存旧值
      const oldValue = this._value;
      // 更新值（如果不是浅层ref且值是对象，转换为响应式对象）
      this._value = this._isShallow ? newValue : toReactive(newValue);
      // 触发更新
      trigger(this, 'value', newValue, oldValue);
    }
  }
}

// ref函数 - 创建ref对象
function ref(value) {
  return new RefImpl(value);
}

// shallowRef函数 - 创建浅层ref对象
function shallowRef(value) {
  return new RefImpl(value, true);
}

// 将值转换为响应式对象
function toReactive(value) {
  return typeof value === 'object' && value !== null ? reactive(value) : value;
}
```

## 3. 各版本实现改进

### 3.1 Vue 3.0：初始实现

- 基础的Proxy响应式系统
- 基本的依赖收集和触发更新机制
- 深度响应式默认开启

### 3.2 Vue 3.1：性能优化

```javascript
// 优化后的依赖收集
function track(target, key) {
  if (!activeEffect) return;
  
  // 使用WeakMap优化内存使用
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  let dep = depsMap.get(key);
  if (!dep) {
    // 使用Set优化查找和删除性能
    depsMap.set(key, (dep = new Set()));
  }
  
  // 优化：检查effect是否已存在，避免重复添加
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
```

### 3.3 Vue 3.2：开发体验提升

- 优化了TypeScript支持
- 改进了ref和reactive的类型推断
- 增加了更多的响应式API（如toRef、toRefs等）

### 3.4 Vue 3.4：性能进一步优化

```javascript
// 优化后的effect清理机制
class ReactiveEffect {
  // ...
  
  cleanup() {
    // 优化：使用while循环替代for循环，提高清理性能
    let i = this.deps.length;
    while (i--) {
      this.deps[i].delete(this);
    }
    this.deps.length = 0;
  }
  
  // ...
}
```

## 4. 关键技术点分析

### 4.1 Proxy vs Object.defineProperty

| 特性 | Proxy | Object.defineProperty |
|------|-------|------------------------|
| 监听新增属性 | ✅ | ❌ |
| 监听删除属性 | ✅ | ❌ |
| 监听数组索引 | ✅ | ❌ |
| 监听数组length | ✅ | ❌ |
| 性能 | 更好 | 较差 |
| 兼容性 | ES6+ | ES5+ |

### 4.2 依赖收集机制

1. 当访问响应式对象的属性时，`track`函数会被调用
2. `track`函数将当前活跃的`effect`添加到该属性的依赖集合中
3. 当修改响应式对象的属性时，`trigger`函数会被调用
4. `trigger`函数会执行该属性依赖集合中的所有`effect`

### 4.3 响应式边界处理

```javascript
// 标记一个对象为非响应式
function markRaw(value) {
  def(value, ReactiveFlags.SKIP, true);
  return value;
}

// 获取响应式对象的原始对象
function toRaw(observed) {
  const raw = observed && observed[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}

// 检查是否为响应式对象
function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

// 检查是否为ref对象
function isRef(value) {
  return !!(value && value._isRef);
}
```

## 5. 常见问题与解决方案

### 5.1 深度响应式性能问题

**问题**：对于大型对象，深度响应式转换会消耗大量性能

**解决方案**：
- 使用`shallowReactive`只监听顶层属性
- 使用`markRaw`标记不需要响应式的对象
- 使用`toRaw`获取原始对象进行大量操作

### 5.2 响应式对象赋值丢失响应性

**问题**：直接给响应式对象赋值会失去响应性

```javascript
// 错误示例
let state = reactive({ count: 0 });
state = { count: 1 }; // 失去响应性

// 正确示例
let state = reactive({ count: 0 });
state.count = 1; // 保持响应性

// 或使用ref
let state = ref({ count: 0 });
state.value = { count: 1 }; // 保持响应性
```

### 5.3 循环引用问题

**解决方案**：Vue 3的响应式系统使用WeakMap和WeakSet处理循环引用，避免内存泄漏

```javascript
// 循环引用示例
const obj = {};
obj.self = obj;
const reactiveObj = reactive(obj); // 正常工作，不会导致无限递归
```

## 6. 最新版本优化

### 6.1 Vue 3.5：响应式系统优化

Vue 3.5对响应式系统进行了革命性的重构，核心改进是引入了**双向链表**和**版本计数**机制，借鉴了Preact signals的设计思路，重构后内存占用减少了56%，并显著提升了性能。

#### 6.1.1 双向链表数据结构实现

Vue 3.5中使用双向链表替代了之前的Set/Map结构来管理依赖关系：

```javascript
// 双向链表节点定义
class Link {
  // 指向上一个节点
  prev = null
  // 指向下一个节点
  next = null
  // 订阅者（副作用函数）
  sub = null
  // 依赖项
  dep = null
}

// 依赖项定义
class Dep {
  // 版本计数器
  version = 0
  // 订阅者链表头
  subscribers = null
}

// 订阅者（副作用函数）定义
class Sub {
  // 版本计数器
  version = 0
  // 依赖项链表头
  deps = null
  // 副作用函数
  fn = null
  // 调度器
  scheduler = null
}
```

#### 6.1.2 版本计数机制

版本计数是Vue 3.5响应式系统的另一个核心创新：

```javascript
// 依赖收集时的版本检查
function track(target, key) {
  if (!activeEffect) return;
  
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Dep()));
  }
  
  // 创建订阅关系链表
  createLink(dep, activeEffect.sub);
}

// 创建双向链表连接
function createLink(dep, sub) {
  // 创建新的链表节点
  const link = new Link();
  link.dep = dep;
  link.sub = sub;
  
  // 将节点添加到依赖项的订阅者链表
  link.next = dep.subscribers;
  if (dep.subscribers) {
    dep.subscribers.prev = link;
  }
  dep.subscribers = link;
  
  // 将节点添加到订阅者的依赖项链表
  link.nextDep = sub.deps;
  if (sub.deps) {
    sub.deps.prevDep = link;
  }
  sub.deps = link;
}
```

#### 6.1.3 优化的触发更新流程

```javascript
// 触发更新时的版本检查
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const dep = depsMap.get(key);
  if (!dep) return;
  
  // 版本号递增
  dep.version++;
  
  // 遍历订阅者链表，触发更新
  let current = dep.subscribers;
  while (current) {
    const sub = current.sub;
    // 只有当订阅者的版本与依赖项的版本不一致时才触发更新
    if (sub.version !== dep.version) {
      sub.version = dep.version;
      if (sub.scheduler) {
        sub.scheduler();
      } else {
        sub.fn();
      }
    }
    current = current.next;
  }
}
```

#### 6.1.4 内存优化原理

Vue 3.5通过双向链表实现了更高效的依赖管理：

1. **减少内存占用**：双向链表节点比Set/Map结构更轻量，仅包含必要的指针和引用
2. **高效的添加/删除操作**：链表的插入和删除操作时间复杂度为O(1)
3. **避免重复依赖**：版本计数机制确保每个副作用函数只被触发一次
4. **优化的清理机制**：通过双向链表可以更快速地清理不再需要的依赖关系

#### 6.1.5 性能提升数据

根据Vue官方测试数据：
- 内存占用减少56%
- 依赖收集速度提升约30%
- 触发更新速度提升约25%
- 大型深度响应式数组操作速度提升显著

#### 6.1.6 与Vue 3.4及之前版本的对比

| 特性 | Vue 3.4及之前 | Vue 3.5 |
|------|--------------|---------|
| 依赖管理结构 | Set/Map | 双向链表 |
| 去重机制 | 集合天然去重 | 版本计数 |
| 内存占用 | 较高 | 降低56% |
| 添加依赖 | O(1)（Set.add） | O(1)（链表插入） |
| 触发更新 | 遍历集合 | 遍历链表+版本检查 |
| 重复触发防护 | 需要额外检查 | 版本计数天然防护 |

这次重构是Vue内部优化，对于普通开发者来说是无感的，但带来了显著的性能提升，特别是在大型应用和复杂数据结构场景下。

## 7. 总结

Vue 3的响应式系统通过Proxy API实现了更强大、更灵活的响应式能力，相比Vue 2的Object.defineProperty实现，具有以下优势：

- 支持监听新增属性、删除属性、数组索引变化等
- 更好的性能表现
- 更灵活的API设计
- 更好的TypeScript支持

通过不断的版本迭代和优化，Vue 3的响应式系统已经非常成熟：

1. **Vue 3.0**：奠定了基于Proxy的响应式系统基础
2. **Vue 3.1**：优化了依赖收集和内存使用
3. **Vue 3.2**：提升了开发体验和TypeScript支持
4. **Vue 3.4**：进一步优化了性能和边界情况处理
5. **Vue 3.5**：通过双向链表和版本计数机制实现了革命性重构，内存占用减少56%

Vue 3.5的双向链表优化调度策略是响应式系统发展的重要里程碑，它借鉴了Preact signals的设计思路，通过更高效的数据结构和算法显著提升了性能和内存使用效率。

以上代码拆解展示了Vue 3响应式系统的核心实现，特别是Vue 3.5的链表优化调度策略，帮助我们深入理解其工作原理和设计思想，为更好地使用和优化Vue 3应用提供了基础。