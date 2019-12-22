import Sub from "./Sub";
import { cc } from "./cc";
import Node from "./Node";

export default class Director {

	constructor() {

	}

	private _RootNode: Node = new Node();
	/** 根节点 */
	public get RootNode(): Node {
		return this._RootNode;
	}
	/** 当前打开的场景 */
	private scene: Node | null = null;
	/** 视口矩阵 */
	private WorldMatrix: number[] = [];

	/**
	 * 初始化
	 * @param viewport 子域视口区域
	 */
	public initView(viewport: Rect) {

		this.RootNode.x = Sub.canvas.width / 2;
		this.RootNode.y = Sub.canvas.height / 2;
		this.RootNode.width = Sub.canvas.width;
		this.RootNode.height = Sub.canvas.height;

		let sx = Sub.canvas.width / viewport.width;
		let sy = Sub.canvas.height / viewport.height;
		this.WorldMatrix = [Sub.PixelRatio * sx, 0, 0, 0, -Sub.PixelRatio * sy, 0, -viewport.x * sx, (Sub.SystemInfo.screenHeight * Sub.PixelRatio - viewport.y) * sy, 1];

		Sub.render();
	}

	/** 转换到视口矩阵下的点 */
	public convertToViewSpaceAR(point: number[]): Vec2 {
		let vec2 = cc.matMul(point, this.WorldMatrix);
		return cc.v2(vec2[0], vec2[1]);
	}

	/**
	 * 切换场景
	 * @param scene
	 */
	public loadScene<T extends Node>(scene: { new(): T; }) {
		this.RootNode.removeAllChildren();
		this.scene = new scene();
		this.RootNode.addChild(this.scene);
	}

	/**
	 * 获取当前运行场景
	 */
	public getScene<T extends Node>(): T {
		return this.scene as T;
	}

}