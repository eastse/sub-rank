import Sub from "./core/Sub";
import { cc } from "./core/cc";
import FriendRank from "./FriendRank";
import PassRank from "./PassRank";
import OverRank from "./OverRank";

export default class index {

	constructor() {

		Sub.init();
		this.onMessage();

	}

	/** 监听主域发送数据 */
	public onMessage() {

		wx.onMessage((msg: MsgType) => {
			console.log('主域发送信息', Date.now(), JSON.stringify(msg))
			if (msg.event == "viewport") {
				// 主域传入的子域视口区域，在主域调整共享画布尺寸后传入
				let viewRect = cc.rect(msg.data.x, msg.data.y, msg.data.width, msg.data.height)
				Sub.director.initView(viewRect);
			} else if (msg.event == 'pass') {
				Sub.director.loadScene(PassRank);
			} else if (msg.event == 'updatePass') {
				Sub.director.getScene<PassRank>().updatePassUser(msg.data);
			} else if (msg.event == 'over') {
				Sub.director.loadScene(OverRank);
			} else if (msg.event == 'friend') {
				Sub.director.loadScene(FriendRank);
			}
		})

	}


}

new index();