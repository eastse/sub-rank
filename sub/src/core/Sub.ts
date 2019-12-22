import Director from "./Director";

export default class Sub {

	/** 打包后资源文件的引用会基于此路径 */
	public static filePath: string = 'sub/res/';
	/** 子域共享画布 */
	public static canvas: any;
	/** 获取画布对象的绘图上下文 */
	public static context: any;
	/** 流程控制类 */
	public static director: Director;
	/** 
	 * 手机设备信息
	 * https://developers.weixin.qq.com/minigame/dev/api/base/system/system-info/wx.getSystemInfoSync.html
	 */
	public static SystemInfo: any;
	/** 像素比 */
	public static PixelRatio: number = 0;
	/** 
	 * 微信当前用户信息
	 * https://developers.weixin.qq.com/minigame/dev/api/open-api/data/OpenDataContext-wx.getUserInfo.html
	 */
	public static selfInfo: any;

	/** 初始化子域 */
	public static init() {

		this.SystemInfo = wx.getSystemInfoSync();
		this.canvas = wx.getSharedCanvas();
		this.context = wx.getSharedCanvas().getContext('2d');
		this.PixelRatio = Math.min(3, this.SystemInfo.devicePixelRatio);
		this.director = new Director();

		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res: any) => {
				console.log('当前用户信息', 'success', res.data)
				this.selfInfo = res.data[0];
			},
			fail: (res: any) => {
				console.log(res)
			}
		})

	}

	/** 当前帧是否启用过 */
	private static isDirty: boolean = false;
	/** 启动渲染 */
	public static render() {

		if (this.isDirty) return;
		this.isDirty = true;
		// console.log('渲染')
		requestAnimationFrame(() => {

			// 重置转换矩阵
			Sub.context.setTransform(1, 0, 0, 1, 0, 0);
			// 清空画布
			Sub.context.clearRect(0, 0, Sub.canvas.width, Sub.canvas.height);
			// 渲染场景
			Sub.director.RootNode.render();
			Sub.context.restore();
			this.isDirty = false;

		})
	}

}