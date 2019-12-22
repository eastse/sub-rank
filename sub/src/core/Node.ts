import Sub from "./Sub";
import { cc } from "./cc";

export default class Node {

	private _x: number = 0;
	private _y: number = 0;
	private _anchorX: number = 0.5;
	private _anchorY: number = 0.5;
	private _width: number = 0;
	private _height: number = 0;
	private _scaleX: number = 1;
	private _scaleY: number = 1;
	private _angle: number = 0; //保存弧度，返回角度
	private _opacity: number = 1;

	constructor() {
		this.updateWorldMatrix();
	}

	private _active : boolean = true;
	/** 是否激活节点 */
	public get active() : boolean {
		return this._active;
	}
	public set active(value : boolean) {
		this._active = value;
		this.isDirty = true;
	}

	/** X 轴坐标 */
	public get x(): number {
		return this._x;
	}
	public set x(value: number) {
		this._x = value;
		this.isDirty = true;
	}

	/** Y 轴坐标 */
	public get y(): number {
		return this._y;
	}
	public set y(value: number) {
		this._y = value;
		this.isDirty = true;
	}

	/** X 轴锚点位置 */
	public get anchorX(): number {
		return this._anchorX;
	}
	public set anchorX(value: number) {
		this._anchorX = value;
		this.isDirty = true;
	}

	/** Y 轴锚点位置 */
	public get anchorY(): number {
		return this._anchorY;
	}
	public set anchorY(value: number) {
		this._anchorY = value;
		this.isDirty = true;
	}

	/** 节点宽度 */
	public get width(): number {
		return this._width;
	}
	public set width(value: number) {
		this._width = value;
		this.isDirty = true;
		this.changeSizeMode();
	}

	/** 节点高度 */
	public get height(): number {
		return this._height;
	}
	public set height(value: number) {
		this._height = value;
		this.isDirty = true;
		this.changeSizeMode();
	}

	/** 节点 X 轴缩放 */
	public get scaleX(): number {
		return this._scaleX;
	}
	public set scaleX(value: number) {
		this._scaleX = value;
		this.isDirty = true;
	}

	/** 节点 Y 轴缩放 */
	public get scaleY(): number {
		return this._scaleY;
	}
	public set scaleY(value: number) {
		this._scaleY = value;
		this.isDirty = true;
	}

	/** 该节点旋转角度,返回欧拉角（保存弧度，返回欧拉角） */
	public get angle(): number {
		return this._angle * 180 / Math.PI;
	}
	/** 传入角度 */
	public set angle(value: number) {
		this._angle = value * Math.PI / 180;
		this.isDirty = true;
	}

	/** 当前节点透明度 0～1，级联 */
	public get opacity(): number {
		return this._opacity;
	}
	public set opacity(value: number) {
		this._opacity = value;
		this.isDirty = true;
	}

	/** 该节点的父节点 */
	private _parent: Node | null = null;
	public get parent() {
		return this._parent;
	}

	private _children: Node[] = [];
	/** 节点的所有子节点 */
	public get children() {
		return this._children;
	}
	/** 节点世界矩阵 */
	protected worldMatrix: number[] = [];

	private _isDirty = true;
	/** 是否更新矩阵 */
	private set isDirty(value: boolean) {
		this._isDirty = value;
		if (value) Sub.render();
	}
	private get isDirty() {
		return this._isDirty;
	}

	/** 获取本地坐标矩阵 */
	private get localMatrix() {
		let c = Math.cos(this._angle);
		let s = Math.sin(this._angle);
		let ox = (0.5 - this.anchorX) * this.width;
		let oy = (0.5 - this.anchorY) * this.height;

		let y = this.y;
		let x = this.x;
		if (this.parent) {
			y = this.y + (this.parent.anchorY - 0.5) * this.parent.height;
			x = this.x + (this.parent.anchorX - 0.5) * this.parent.width;
		}
		return [this.scaleX * c, -this.scaleY * s, 0, this.scaleX * s, this.scaleY * c, 0, x + ox, y + oy, 1];
	}

	/** 返回父节坐标系下的轴向对齐的包围盒 */
	protected getBoundingBox(): Rect {
		let pt = cc.matMul([-this.width / 2, -this.height / 2, 1], this.worldMatrix);
		let rect = cc.rect(pt[0], pt[1], this.width, this.height);
		return rect
	}

	/** 更新转换矩阵，假定父节点 世界矩阵是正确的 */
	private updateWorldMatrix() {
		this.worldMatrix = this.parent ? cc.matMul(this.localMatrix, this.parent.worldMatrix) : this.localMatrix;
	}

	/** 移除节点所有的子节点 */
	public removeAllChildren() {
		this._children.forEach((node: Node) => node.onDestroy());
		this._children = [];
		this.isDirty = true;
	}

	/**
	 * 添加子节点,可同时添加多个
	 * @param node 子节点
	 */
	public addChild(...node: Node[]) {
		node.forEach((node) => {
			node._parent = this;
			this.children.push(node);
			node.isDirty = true;
		})
	}

	/** 销毁该对象，并释放所有它对其它对象的引用 */
	public destroy() {
		if (this.parent) {
			this.parent._children = this.parent.children.filter(node => node != this);
			this._parent = null;
		}
		Sub.render();
	}

	/** 节点销毁时 */
	protected onDestroy() {
		// TODO子类重写
	}

	/**
	 * 渲染当前节点
	 * @param resetMatrix 是否需要更新矩阵
	 */
	public render(resetMatrix: boolean = false) {
		if (!this.active) return;

		if (this.isDirty || resetMatrix) this.updateWorldMatrix();
		Sub.context.globalAlpha = this.opacity;
		this.renderComponent(this.isDirty || resetMatrix);
		Sub.context.globalAlpha = 1;
		this.isDirty = false;
	}

	/** 更新缩放模式 */
	protected changeSizeMode() {
		// 纹理子类重写
	}

	/** 渲染子类组件 */
	protected renderComponent(resetMatrix: boolean = false) {
		// TODO子类重写
		this.children.forEach((node) => node.render(resetMatrix))
	}
}