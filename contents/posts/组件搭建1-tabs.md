---
date: "2025-06-23T09:07:39+08:00"
draft: false
title: "组件搭建1 Tabs"
categories: "前端学习"
---

**Tabs 帮助我们在有限的页面上切换显示不同的内容面板，通过标签页的形式提升内容的组织性和用户体验。**

在这里我们以 Antd 的`Tabs`组件为例，拆解`Tabs`组件包含哪些内容。

https://ant.design/components/tabs-cn#tabs-demo-custom-indicator

主要分为上中下三层

-   第一层：标签
-   第二层：指示条
-   第三层：标签内容容器

通过点击标签，指示条和内容容器也会出现相应的变化。

首先我们的`Tabs`组件接收一个`items`数组作为传入参数渲染。

```js
//key作为唯一标识符
//label是标签显示的文字内容
//children是内容容器的内容
const items = [
    {
        key: "1",
        label: "label1",
        children: "children1",
    },
    {
        key: "2",
        label: "label2",
        children: "children2",
    },
];
```

现在将它传入组件当中。

```js
export default Tabs = ({ items }) => {};
```

接下来，我们要在这个组件中，实现 Tabs 的基础功能。

### 标签实现

标签需要根据`items`传入的对象个数来进行渲染。这里我们可以用 map 进行遍历。

```js
items.map((item) => {
  return (
		<div
				key = {item.key} //唯一值
        onClick = {}
		>
          {item.label} //标签内容
   </div>
)
})
```

现在实现了多个标签的显示，但我们还需要实现它的点击效果。
当我们点击其中一个标签的时候，显示这个标签的内容。

```js
//首先我们需要一个参数来记录当前的标签值，并赋予默认值。
const [activeIndex,setActiveIndex] = useState(0);

//现在实现onClick方法
onClick = {() => setActiveIndex(item.key-1)}
//因为在map中的下标从0开始，但是我们一般定义的key值是从1开始，所以这里要-1才能正确渲染对于的内容。
//也可以让items中的key值从0开始
```

那么现在整合上面的内容，我们就实现了一个完整的多标签显示。

```js
export default Tabs = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return;
    items.map((item) => {
        return (
            <div
                key={item.key} //唯一值
                onClick={() => setActiveIndex(item.key - 1)}
            >
                {item.label} //标签内容
            </div>
        );
    });
};
```

### 指示条实现

指示条我们可以看作是一个高度极小，但保持一定宽度的 div 通过平滑的 CSS 过渡效果实现的。

我们需要计算标签 div 的位置，才能在它的下方定位指示条的位置。可以用`Ref`来绑定标签 div。

再用它来访问 `children`、`offsetWidth`、`offsetLeft` 等原生 DOM 属性来定位指示条位置。

```js
const tabsRef = useRef(null)
//定义指示条样式
const [indicatorStyle,setIndicatorStyle] = useState({})

useEffect = (() =>{
  //如果tabs的标签div不存在则直接返回
	if(!tabsRef.current){
    return;
  }
  //获取当前激活的Tabs位置key
  const currentTab = tabsRef.current.children[activeIndex];
  if (currentTab) {
    				//设置指示条的宽度与开始位置
            setIndicatorStyle({
                width: currentTab.offsetWidth - 20,
                left: currentTab.offsetLeft + 10,
            });
        }
},[activeIndex]);//根据activeIndex变化触发Effect


return
//设置绝对定位，标签div设置为相对定位
	<div
  	style={
      absolute,
      ...indicatorStyle
    }
  />
```

标签和指示条都已经实现了。还剩下 Childrend 的内容显示。

### 标签内容容器实现

```js
<div className="p-4">{items[activeIndex].children}</div>
```

### 加上样式后的完整代码

```js
import React, { useState, useRef, useEffect } from "react";

/**
 * Tabs组件
 * @param {any} {items}
 * @returns {any}
 */
const Tabs = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabsRef = useRef(null);

    useEffect(() => {
        if (!tabsRef.current) {
            return;
        }
        const currentTab = tabsRef.current.children[activeIndex];
        if (currentTab) {
            setIndicatorStyle({
                width: currentTab.offsetWidth - 20,
                left: currentTab.offsetLeft + 10,
            });
        }
    }, [activeIndex]);

    return (
        <div className="p-4">
            <div
                className="flex h-10 w-full relative"
                ref={tabsRef}
            >
                {items.map((item) => {
                    return (
                        <div
                            key={item.key}
                            onClick={() => setActiveIndex(item.key - 1)}
                            style={{
                                height: "40px",
                                width: "80px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "0 10px",
                                cursor: "pointer",
                                color: activeIndex === item.key - 1 ? "#3875f6" : "black",
                            }}
                        >
                            {item.label}
                        </div>
                    );
                })}
                <div
                    className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                    style={indicatorStyle}
                />
            </div>

            <div className="p-4">{items[activeIndex].children}</div>
        </div>
    );
};

export default Tabs;
```
