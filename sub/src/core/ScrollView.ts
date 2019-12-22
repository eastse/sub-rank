import Node from "./Node";
import Sub from "./Sub";
import { cc } from "./cc";
import ScrollViewItem from "./ScrollViewItem";

export default class ScrollView extends Node {

	/**
	 * 构造方法
	 * @param width 滚动视图宽度
	 * @param height 滚动视图高度
	 * @param itemConfig 列表项配置
	 */
	constructor(width: number, height: number, itemConfig: ScrollViewConfig) {
		super();
		this.scrollViewConfig = itemConfig;
		this.width = width;
		this.height = height;
		this.content = new Node();
		this.content.anchorY = 1;
		this.addChild(this.content);
		this.firstNode = this.lastNode = this.getItem();
	}

	/** 容器节点 */
	private content: Node;
	/** 列表数据 */
	private listData: any[] = [];
	/** 存放 cell 的列表 */
	private itemNodeArr: ScrollViewItem[] = [];
	/** 第一个节点 */
	private firstNode: ScrollViewItem;
	/** 最后一个节点 */
	private lastNode: ScrollViewItem;
	/** 滚动视图配置 */
	private scrollViewConfig: ScrollViewConfig;

	/**
     * 加载数据
     * @param data 滚动循环数据列
     * @param startDataIndex 开始位置
     */
	public loadData<T>(data: T[], startDataIndex: number = 0) {
		this.listData = data;
		this.createListItem(startDataIndex);
		this.startListenerEvent();
	}

	/** 创建初始节点 */
	private createListItem(startDataIndex: number) {
		// 初始化容器
		this.content.height = this.listData.length * (this.scrollViewConfig.height + this.scrollViewConfig.spacing) - this.scrollViewConfig.spacing;
		this.content.y = this.height / 2 + (this.scrollViewConfig.height + this.scrollViewConfig.spacing) * startDataIndex;
		this.content.y = Math.min(this.content.y, this.content.height - this.height / 2)
		if (this.content.height <= this.height) {
			this.content.y = this.height / 2;
		}

		// 计算最小开始位置
		let count = Math.ceil(this.height / this.scrollViewConfig.height);
		if (startDataIndex > this.listData.length - count) {
			startDataIndex = Math.max(this.listData.length - count, 0);
		}

		// 填充最少节点
		let scrollItem: ScrollViewItem;
		let index: number = startDataIndex;

		let testY: number = 0;
		do {

			scrollItem = this.getItem();
			this.content.addChild(scrollItem);
			this.itemNodeArr.push(scrollItem);

			if (index >= this.listData.length) {
				scrollItem.active = false;
			} else {
				scrollItem.updateViewData(this.listData[index], index);
			}

			scrollItem.y = -index * (this.scrollViewConfig.height + this.scrollViewConfig.spacing) - (this.scrollViewConfig.height - this.scrollViewConfig.height * scrollItem.anchorY);

			scrollItem.scrollIndex = index;

			if (index == startDataIndex) this.firstNode = scrollItem;
			this.lastNode = scrollItem;

			if (index >= this.listData.length) break;
			index++;
			testY = scrollItem.y + scrollItem.height / 2 + (startDataIndex * (this.scrollViewConfig.height + this.scrollViewConfig.spacing));
		} while (testY > -this.height);

	}

	/** 
	 * 获取一个列表项
	 * !# 根据各列自定义
	 */
	protected getItem(): ScrollViewItem {
		// TODO 子类重写
		console.warn('子类没有重写该方法')
		return new ScrollViewItem();
	}

	/** 开始监听事件 */
	private startListenerEvent() {
		wx.onTouchStart(this.onTouchStart.bind(this));
		wx.onTouchMove(this.onTouchMove.bind(this));
		wx.onTouchEnd(this.onTouchEnd.bind(this));
		wx.onTouchCancel(this.onTouchEnd.bind(this));
	}

	/** 是否滚动 */
	private isScroll: boolean = false;
	/** 上一次触摸坐标 */
	private prevTouch: Vec2 = cc.v2();
	private onTouchStart(event: any) {

		if (!event.changedTouches) return;
		let point: number[] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY, 1];
		let touchPoint = Sub.director.convertToViewSpaceAR(point);
		this.prevTouch = cc.v2(touchPoint.x, touchPoint.y);
		this.isScroll = this.getBoundingBox().contains(touchPoint);

	}

	private onTouchMove(event: any) {

		if (!this.isScroll || !event.changedTouches) return;
		let point: number[] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY, 1];
		let touchPoint = Sub.director.convertToViewSpaceAR(point);
		let deltaY = touchPoint.y - this.prevTouch.y;
		this.prevTouch = touchPoint;

		if (this.content.y + deltaY > this.content.height - this.height / 2) {
			return;
		} else if (this.content.y + deltaY < this.height / 2) {
			return;
		}
		this.updateContentItem(deltaY);
		this.content.y += deltaY;

	}

	private onTouchEnd(event: any) {
		// 滚动回弹
	}

	/** 更新顺序位置 */
	private updateContentItem(deltaY: number) {
		if (deltaY == 0) return;
		let isToFirst = deltaY < 0;
		if (isToFirst && this.firstNode.scrollIndex > 0) {
			let lastY = this.content.y - this.height / 2 + (this.lastNode.y + this.lastNode.height / 2);

			if (lastY < -this.height) {
				this.lastNode.active = true;
				this.lastNode.y = this.firstNode.y + this.scrollViewConfig.height + this.scrollViewConfig.spacing;

				let index = Math.max(0, this.firstNode.scrollIndex - 1)
				this.lastNode.scrollIndex = index;
				this.lastNode.updateViewData(this.listData[index], index);

				this.firstNode = this.lastNode;
				this.itemNodeArr.unshift(this.itemNodeArr.pop() as ScrollViewItem);
				this.lastNode = this.itemNodeArr[this.itemNodeArr.length - 1];
			}
		} else if (!isToFirst && this.lastNode.scrollIndex < this.listData.length - 1) {

			let firstY = this.content.y - this.height / 2 + (this.firstNode.y - this.firstNode.height / 2);

			if (firstY > 0) {
				this.firstNode.y = this.lastNode.y - (this.scrollViewConfig.height + this.scrollViewConfig.spacing);

				let index = Math.min(this.listData.length - 1, this.lastNode.scrollIndex + 1);
				this.firstNode.scrollIndex = index;
				this.firstNode.updateViewData(this.listData[index], index);

				this.lastNode = this.firstNode;
				this.itemNodeArr.push(this.itemNodeArr.shift() as ScrollViewItem);
				this.firstNode = this.itemNodeArr[0];
			}
		}
	}

	protected onDestroy() {
		wx.offTouchStart();
		wx.offTouchMove();
		wx.offTouchEnd();
		wx.offTouchCancel();
	}
}