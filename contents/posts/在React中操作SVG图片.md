---
date: 2025-09-16T16:46:39+08:00
title: 在React中操作SVG图片
---
## SVG
SVG 的全称是 **Scalable Vector Graphics（可缩放矢量图形）**。它是一种基于 **XML** 的图像文件格式，用来描述二维图形。

**特点：**

- 体积小。
- 不会因为放大缩小而导致图片失真（变得模糊）。
- 前端友好，可以直接当作DOM元素进行操作。可以结合 **CSS** 和 **JavaScript** 控制样式和动画，例如鼠标悬停变色、点击触发事件。


## React中的SVG
在React中，你可以将SVG作为一个组件导入。无论是图标Icon还是独立的`.svg`文件。
这样我们就可以直接将`Prpos`传入，或者使用`state`控制SVG。

**例如：**

```tsx
function App() {
  const [color, setColor] = React.useState("red");

  return (
    <div>
      <button onClick={() => setColor(color === "red" ? "green" : "red")}>
        切换颜色
      </button>

      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill={color} />
      </svg>
    </div>
  );
}
```

## 注意事项
React 中SVG的 **属性命名**要用小驼峰。

**例如：**

- `class` → `className`

- `stroke-width` → `strokeWidth`

    ...

- `viewBox` 保持原样，不变。

    