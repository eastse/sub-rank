
/** 全局类型定义 */
declare global {

	/** 微信全局变量 */
	let wx: any;

	/** 主域发送信息类型 */
	interface MsgType {
		/** 事件名称 */
		event: string;
		/** 携带数据 */
		data?: any;
	}

	/** 图片纹理对象 */
	interface Texture {
		/** 图片的 URL */
		src: string;
		/** 图片的真实宽度 */
		width: number;
		/** 图片的真实高度 */
		height: number;
		/** 图片加载完成后触发的回调函数 */
		onload: Function;
		/** 图片加载发生错误后触发的回调函数 */
		onerror: Function;
	}

	/** 2D 向量和坐标 */
	interface Vec2 {
		x: number;
		y: number;
	}

	/** 通过位置和宽高定义的 2D 矩形 */
	interface Rect {
		/** 矩形 X 轴上坐标 */
		x: number;
		/** 矩形 Y 轴上坐标 */
		y: number;
		/** 矩形宽度 */
		width: number;
		/** 矩形高度 */
		height: number;
		/** 是否包含指定点 */
		contains: (point: Vec2) => boolean;
	}

	/** 滚动视图单项配置 */
	interface ScrollViewConfig {
		/** 宽度 */
		width: number;
		/** 高度 */
		height: number;
		/** 间隔 */
		spacing: number
	}

	/** 好友排行榜返回数据 */
	interface UserGameData {
        /** 用户的 openid */
        openid: string;
        /** 用户的微信昵称 */
        nickname: string;
        /** 用户的微信头像 url */
        avatarUrl: string;
        /** 用户的托管 KV 数据列表 */
        KVDataList: KVData[];
	}
    interface KVData {
        /** 数据的 key */
        key: string;
        /** 数据的 value */
        value: any;
    }


}

export let defined: any;