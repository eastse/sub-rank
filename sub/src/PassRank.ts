import Sprite, { RenderType } from "./core/Sprite";
import Label, { AlignType } from "./core/Label";
import Sub from "./core/Sub";

export default class PassRank extends Sprite {

	/** 头像 */
	private head: Sprite = new Sprite();
	/** 昵称 */
	private nickName: Label = new Label();
	/** 得分 */
	private score: Label = new Label();

	constructor() {
		super();
		this.width = 240;
		this.height = 70;
		this.setTexture('board_bg.png', RenderType.sliced);

		let text = new Sprite('pass_icon.png');

		let headBg = new Sprite('head.png');
		headBg.addChild(this.head);
		this.addChild(headBg, text, this.nickName, this.score);
		text.x = -87;
		headBg.width = headBg.height = 54;
		headBg.x = -31;

		this.head.width = this.head.height = 50;

		this.nickName.x = 4;
		this.nickName.y = 13.5;
		this.nickName.color = '#FEE364';
		this.nickName.fontSize = 18;

		this.score.x = 4;
		this.score.y = -11;
		this.score.color = '#ffffff';
		this.score.fontSize = 22;

		this.nickName.textAlign = this.score.textAlign = AlignType.left;

		this.loadPassData();
	}


	/** 榜单数据 */
	private rankData: UserGameData[] = [];
	/** 当前用户排名 */
	private nextIndex: number = 0;
	/** 打开即将超过 */
	private loadPassData() {

		wx.getFriendCloudStorage({
			keyList: ['score'],
			success: (res: { data: UserGameData[] }) => {
				this.rankData = this.sortRankData(res.data);
				let data = this.rankData[this.nextIndex];
				this.updateInfo(data);
				console.log(this.rankData);
			},
			fail: (res: any) => {
				console.log("wx.getFriendCloudStorage fail", res);
			},
		});
	}

	/** 刷新信息 */
	private updateInfo(data: UserGameData) {
		this.nickName.string = data.nickname;
		this.score.string = ((data.KVDataList[0] && JSON.parse(data.KVDataList[0].value).score) || 0) + '';
		this.head.setTexture(data.avatarUrl);
	}

	/** 刷新即将超过用户信息 */
	public updatePassUser(score: number) {

		let isUpdate: boolean = false;
		let isNext: boolean = true;
		let nextScore = (this.rankData[this.nextIndex].KVDataList[0] && JSON.parse(this.rankData[this.nextIndex].KVDataList[0].value).score) || 0;
		while (isNext && score > nextScore) {
			this.nextIndex++;
			if (this.nextIndex > this.rankData.length - 1) {
				isNext = false;
			} else {
				nextScore = (this.rankData[this.nextIndex].KVDataList[0] && JSON.parse(this.rankData[this.nextIndex].KVDataList[0].value).score) || 0;
			}
			isUpdate = true;
		}
		if (!isUpdate) return;

		if (this.nextIndex > this.rankData.length - 1) {
			// 当前第一名，新记录显示自己的
			this.nextIndex = Math.min(this.rankData.length - 1, this.nextIndex);
			this.score.string = score + '';
			this.nickName.string = Sub.selfInfo.nickName;
			this.head.setTexture(Sub.selfInfo.avatarUrl);
		} else {
			let data = this.rankData[this.nextIndex];
			this.updateInfo(data);
		}

	}

	/** 排序榜单数据 */
	private sortRankData(data: UserGameData[]): UserGameData[] {

		return data.sort((a, b) => {
			if (a.KVDataList.length == 0 && b.KVDataList.length == 0) return 0;
			if (a.KVDataList.length == 0) return 1;
			if (b.KVDataList.length == 0) return -1;

			let aValue = JSON.parse(a.KVDataList[0].value).score;
			let bValue = JSON.parse(b.KVDataList[0].value).score;
			return aValue - bValue;
		});

	}

}