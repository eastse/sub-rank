# 微信子域渲染引擎
使用TypeScript编写WebPack和Babel编译，编译后子域代码30kb左右子域整个项目包含图片100kb以内性能极高。采用和CocosCreate坐标系中心点为原点，先在CocosCreate拼好后写代码直接使用对应的数值即可。
## 使用方法
* 安装项目依赖包
`npm install`

* 编译代码
`npm run build`

* 自动编译，每次保存后自动编译一次
`npm run watch`

## 配置
`webpack.config.js`
修改打包路径建议直接使用小游戏所在目录，完成即可直接刷新省去拖动文件。
```
output: {
		  // 打包后的输出目录
        path: path.resolve(“输出目录”, “sub”),
        filename: “index.js”
    },

```

## 项目说明
*__core__ 文件夹为渲染层所在，__FriendRank__,__OverRank__,__PassRank__等类也就排行榜三大头的示例，当然可以更新项目需求去创建，入口文件为`index.ts`若不是自行修改编译配置*
核心渲染组件有下列四个
- - - -
* Node
* Sprite
* Label
* ScrollView
- - - -
区别于Cocos的是 Sprite，Label, ScrollView 不是已组建形式存在而是直接继承于Node。所有都是从Node扩展出来。

### Node

#### 属性
* `x`  `number` 节点 X 轴坐标
* `y`  `number` 节点 Y 轴坐标
* `anchorX`  `number`  节点 X 轴锚点位置
* `anchorY`  `number`  节点 Y 轴锚点位置
* `width`  `number`  节点宽度
* `height`  `number`  节点高度
* `scaleX`  `number` 节点 X 轴缩放
* `scaleY`  `number` 节点 Y 轴缩放
* `angle`  `number`  该节点的旋转角度，正值为逆时针方向
* `opacity`  `number` 节点透明度，默认值为 1

#### 方法
* `addChild(…node: Node[])`  添加子节点
* `removeAllChildren()` 移除所有子节点
* `destroy()` 销毁当前节点
- - - -

### Sprite

#### 方法
* `constructor(path?: string, type: RenderType=RenderType.simple)` 构造方法
* `setTexture(path: string, type?: RenderType)`   设置精灵纹理，也可在new 时候直接传入
- - - -

### Label

#### 属性
* `fontFamily` `string`  文本字体名称
* `textAlign` `AlignType`  文本对齐方式
* `maxWidth` `number` 最大宽度
* `fontSize` `number`  字体大小
* `color` `string`  字体颜色, 十六进制
* `string` `string`  标签显示的文本内容

#### 方法
* `constructor(string?: string)` 构造方法

### ScrollView
*滚动视图直接继承当前类，子项继承`ScrollViewItem`，不需要手动添加子节点自动创建最少节点循环利用，使用数据渲染形式存在，需要在构造时候传入配置视图宽高和子项宽高，在需要渲染子项时会调用子项的`updateViewData` 会传入数据和索引位，在里面进行数据绑定显示*
__ 参考`FriendRank.ts` `FriendRankItem.ts`__
#### 方法
* `constructor(width: number, height: number, itemConfig: ScrollViewConfig)` 构造方法 ScrollViewConfig 查阅`subDefined.ts`
* `loadData(data: T[], startDataIndex: number = 0)`加载数据，startDataIndex开始显示位置