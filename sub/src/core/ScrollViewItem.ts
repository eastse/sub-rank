import Node from "./Node";
import Sprite, { RenderType } from "./Sprite";
import Label from "./Label";

export default class ScrollViewItem extends Node {

	constructor() {
		super();
	}

	/** 滚动索引 */
	public scrollIndex: number = 0;

	/**
     * 刷新视图数据
     * @param data 
     * @param index 
     */
	public updateViewData(data: any, index: number) {
		// TODO 子类重写

	}

}