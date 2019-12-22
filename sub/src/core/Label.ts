import Node from "./Node";
import Sub from "./Sub";

export enum AlignType {
	start = 'start',
	end = 'end',
	left = 'left',
	right = 'right',
	center = 'center'
}
/** 文本渲染节点 */
export default class Label extends Node {

	constructor(string?: string) {
		super();
		if (string) this.string = string;
	}

	/** 文本字体名称, */
	public fontFamily: string = 'Arial';
	/** 文本对齐方式 */
	public textAlign: AlignType = AlignType.center;
	/** 最大宽度 */
	public maxWidth: number = 0;
	/** 最大宽度渲染字体大小 */
	private maxWidthFontsize: number = 0;

	private _fontSize: number = 30;
	/** 文本字体大小 */
	public get fontSize(): number {
		return this._fontSize;
	}
	public set fontSize(value: number) {
		this._fontSize = value;
		Sub.context.font = this.fontSize + 'px ' + this.fontFamily;
		this.height = this.fontSize;
	}


	private _color: string = '#000000';
	/** 字体颜色, 十六进制 */
	public get color(): string {
		return this._color;
	}
	public set color(value: string) {
		this._color = value;
		Sub.render();
	}

	private _string: string = '';
	/** 标签显示的文本内容 */
	public get string(): string {
		return this._string;
	}
	public set string(value: string) {
		this._string = value;
		Sub.context.font = this.fontSize + 'px ' + this.fontFamily;
		this.height = this.fontSize;
		this.width = Sub.context.measureText(value).width;
		if (this.maxWidth !== 0 && this.width > this.maxWidth) {
			this.maxWidthFontsize = this.maxWidth * (this.fontSize / this.width);
		}
		Sub.render();
	}

	/**
	 * 渲染文本
	 * @param resetMatrix 是否需要更新矩阵
	 */
	protected renderComponent(resetMatrix: boolean = false) {

		//Y轴 翻转,向下平移一个画布高度，使得坐标原点在 左下角
		Sub.context.setTransform(1, 0, 0, -1, 0, Sub.canvas.height);
		let t = this.worldMatrix;
		Sub.context.transform(t[0], t[1], t[3], t[4], t[6], t[7])
		Sub.context.scale(1, -1);

		let fontsize = this.fontSize;
		let width = this.width;
		if (this.maxWidth > 0 && this.width > this.maxWidth) {
			fontsize = this.maxWidthFontsize;
			width = this.maxWidth;
		}

		Sub.context.fillStyle = this.color;
		Sub.context.font = fontsize + 'px ' + this.fontFamily;
		Sub.context.textAlign = this.textAlign;
		Sub.context.textBaseline = 'middle';
		Sub.context.fillText(this.string, 0, 0, width);

		this.children.forEach((node) => {
			node.render(resetMatrix)
		})
	}


}