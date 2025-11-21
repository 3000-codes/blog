import { BlogPost } from '../types';

export const posts: BlogPost[] = [
  {
    id: '1',
    title: '好玩的液态玻璃效果',
    date: '2025/11/21',
    coverImage: 'https://picsum.photos/100/100?random=3',
    summary: '很简单就能实现这个液态玻璃效果，真棒',
    language: 'zh',
    content: `
# 好玩的液态玻璃效果

今天我想分享一下如何实现你现在看到的这个**液态水珠效果**。

它是通过物理引擎模拟弹簧运动来实现的。

### 核心原理

我们使用 \`requestAnimationFrame\` 来创建一个动画循环。在每一帧中，我们计算水珠当前位置与鼠标位置之间的距离，并应用一个“弹性力”。

\`\`\`typescript
const tension = 0.08; // 张力
const friction = 0.85; // 摩擦力

// 计算速度和位置
vx += (targetX - x) * tension;
vx *= friction;
x += vx;
\`\`\`

### 视觉效果

为了让它看起来像水珠，关键在于 \`backdrop-filter\` 和 \`box-shadow\` 的组合：

1. **高饱和度**: \`saturate(180%)\` 模拟透镜折射。
2. **内阴影**: 使用 \`inset\` shadow 模拟内部的高光和体积感。

希望你喜欢这个效果！
    `
  },
  {
    id: '1-en',
    title: 'Fun Liquid Glass Effect',
    date: '2025/11/21',
    coverImage: 'https://picsum.photos/100/100?random=3',
    summary: 'It is really simple to achieve this liquid glass effect, awesome.',
    language: 'en',
    content: `
# Fun Liquid Glass Effect

Today I want to share how to implement the **liquid water drop effect** you are seeing right now.

It is achieved by simulating spring motion using a physics engine.

### Core Principle

We use \`requestAnimationFrame\` to create an animation loop. In each frame, we calculate the distance between the current water drop position and the mouse position, and apply an "elastic force".

\`\`\`typescript
const tension = 0.08; // Tension
const friction = 0.85; // Friction

// Calculate velocity and position
vx += (targetX - x) * tension;
vx *= friction;
x += vx;
\`\`\`

### Visual Effect

To make it look like a water drop, the key lies in the combination of \`backdrop-filter\` and \`box-shadow\`:

1. **High Saturation**: \`saturate(180%)\` simulates lens refraction.
2. **Inner Shadow**: Using \`inset\` shadow to simulate internal highlights and volume.

I hope you like this effect!
    `
  },
  {
    id: '2',
    title: '如何开始 React 开发',
    date: '2025/10/15',
    coverImage: 'https://picsum.photos/100/100?random=4',
    summary: 'React 是一个用于构建用户界面的 JavaScript 库',
    language: 'zh',
    content: `
# 如何开始 React 开发

React 使创建交互式 UI 变得轻而易举。为你应用的每一个状态设计简洁的视图，当数据变动时 React 能有效地更新并渲染合适的组件。

## 组件化

构建管理自身状态的封装组件，然后将其组合以制作复杂的 UI。

- 声明式
- 组件化
- 一次学习，随处编写

祝你编码愉快！
    `
  },
  {
    id: '2-en',
    title: 'How to Start React Development',
    date: '2025/10/15',
    coverImage: 'https://picsum.photos/100/100?random=4',
    summary: 'React is a JavaScript library for building user interfaces.',
    language: 'en',
    content: `
# How to Start React Development

React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

## Component-Based

Build encapsulated components that manage their own state, then compose them to make complex UIs.

- Declarative
- Component-Based
- Learn Once, Write Anywhere

Happy coding!
    `
  }
];