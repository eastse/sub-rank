import Node from "./Node";
import Sub from "./Sub";

/** 纹理渲染类型 */
export enum RenderType {
	/** 普通 */
	simple,
	/** 九宫格 */
	sliced
}
/** 精灵尺寸调整模式 */
export enum SizeModeType {
	/** 原始大小未裁剪 */
	raw,
	/** 自定义 */
	custom
}
/** 精灵渲染节点 */
export default class Sprite extends Node {

	/** 纹理缓存资源 */
	public static TextureCache: { [path: string]: Texture } = {};

	/**
	 * 构造函数
	 * @param path 纹理路径
	 * @param type 纹理渲染类型
	 */
	constructor(path?: string, type: RenderType = RenderType.simple) {
		super();
		if (path) {
			this.setTexture(path, type);
			this.type = type;
		}
	}

	/** 纹理资源 */
	private texture: Texture | null = null;
	/** 纹理渲染类型 */
	private type: RenderType = RenderType.simple;
	/** 精灵尺寸调整模式 */
	private sizeMode: SizeModeType = SizeModeType.raw;

	/**
	 * 加载纹理
	 * @param path 纹理路径,远程图片传入完整地址，本地图片不需要文件路径，示例'a.png'
	 * @param isScale9 是否九宫格
	 */
	public setTexture(path: string, type?: RenderType) {

		if (path.indexOf('http') === -1) path = Sub.filePath + path;
		if (type) this.type = type;

		if (Sprite.TextureCache.hasOwnProperty(path)) {
			let texture = Sprite.TextureCache[path];
			this.loadTexture(texture);
		} else {
			let texture = wx.createImage();
			texture.src = path;
			texture.onload = () => {
				Sprite.TextureCache[path] = texture;
				this.loadTexture(texture);
			}
			texture.onerror = () => {
				this.texture = null;
				console.warn('图片加载失败', path);
			}
		}

	}

	/**
	 * 更新纹理
	 * @param texture 纹理资源
	 */
	private loadTexture(texture: Texture) {
		this.texture = texture;
		if (this.sizeMode == SizeModeType.raw) {
			this.width = texture.width;
			this.height = texture.height;
		}
		Sub.render();
	}

	/** 当更改节点大小时候，更新缩放模式到自定义模式 */
	protected changeSizeMode() {
		// 子类重写
		this.sizeMode = SizeModeType.custom;
	}

	/**
	 * 渲染精灵
	 * @param resetMatrix 是否需要更新矩阵
	 */
	protected renderComponent(resetMatrix: boolean = false) {

		//Y轴 翻转,向下平移一个画布高度，使得坐标原点在 左下角
		Sub.context.setTransform(1, 0, 0, -1, 0, Sub.canvas.height);
		let t = this.worldMatrix;
		Sub.context.transform(t[0], t[1], t[3], t[4], t[6], t[7]);
		Sub.context.scale(1, -1);

		if (this.texture) {
			if (this.type == RenderType.sliced) {
				//计算9个格子的位置大小
				let x = -this.width / 2;
				let y = -this.height / 2;
				let cw = this.texture.width / 3;
				let ch = this.texture.height / 3;
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						let sx = i * this.texture.width / 3;
						let sy = j * this.texture.height / 3;
						let tx = x + (i == 2 ? this.width - cw : i * cw);
						let ty = y + (j == 2 ? this.height - ch : j * ch);
						let tw = i == 1 ? this.width - 2 * cw : cw;
						let th = j == 1 ? this.height - 2 * ch : ch;
						Sub.context.drawImage(this.texture, sx, sy, cw, ch, tx, ty, tw, th);
					}
				}
			} else {
				Sub.context.drawImage(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
			}
		}
		this.children.forEach((node) => {
			node.render(resetMatrix)
		})
	}
}