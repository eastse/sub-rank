import ScrollView from "./core/ScrollView";
import FriendRankItem from "./FriendRankItem";
import Sub from "./core/Sub";

/** 好友排行榜页面 */
export default class FriendRank extends ScrollView {

	constructor() {
		super(Sub.canvas.width, Sub.canvas.height, {
			width: 600,
			height: 120,
			spacing: 10,
		});
		this.loadFriendRankData();
	}

	protected getItem() {
		return new FriendRankItem();
	}

	/** 加载好友排行榜数据 */
	private loadFriendRankData() {
		console.log('开始加载排行榜', Date.now());
		wx.getFriendCloudStorage({
			keyList: ['score'],
			success: (res: { errMsg: string, data: UserGameData[] }) => {
				console.log('好友排行榜信息', Date.now(), res)
				let list = this.sortRankData(res.data);
				this.loadData(list)
			},
			fail: (res: any) => {
				console.warn("wx.getFriendCloudStorage fail", res);
			},
		});

	}

	/** 排序榜单数据 */
	private sortRankData(data: UserGameData[]): UserGameData[] {

		return data.sort((a, b) => {
			if (a.KVDataList.length == 0 && b.KVDataList.length == 0) return 0;
			if (a.KVDataList.length == 0) return 1;
			if (b.KVDataList.length == 0) return -1;

			let aValue = JSON.parse(a.KVDataList[0].value).score;
			let bValue = JSON.parse(b.KVDataList[0].value).score;
			return bValue - aValue;
		});

	}

}