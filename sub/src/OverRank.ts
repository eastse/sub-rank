import Node from "./core/Node";
import OverRankItem from "./OverRankItem";
import Sub from "./core/Sub";

export default class OverRank extends Node {

	constructor() {
		super();
		this.width = 570;
		this.height = 270;
		this.createItem();
	}

	/** 三个节点 */
	private overItems: OverRankItem[] = [];

	private createItem() {

		for (let i = 0; i < 3; i++) {

			let item = new OverRankItem();
			item.x = (i - 1) * 180;
			this.addChild(item);
			this.overItems.push(item);

		}

		this.loadData();

	}

	/** 加载排行榜数据 */
	private loadData() {
		wx.getFriendCloudStorage({
			keyList: ['score'],
			success: (res: { errMsg: string, data: UserGameData[] }) => {
				console.log('好友排行榜信息', res)
				let dataArr = this.sortRankData(res.data);
				let dataLength = dataArr.length;
				let threeData: {
					no: number;
					data: UserGameData
				}[] = [];

				// 找出三条数据
				for (let index = 0; index < dataLength; index++) {

					if (dataArr[index].avatarUrl == Sub.selfInfo.avatarUrl) {

						// 计算开始位置
						let startIndex = index - 1;
						if (index == 0) {
							startIndex = 0;
						} else if (index == dataLength - 1) {
							startIndex = index - 2;
						}
						// 输入三条榜单信息
						for (let num = 0; num < 3; num++) {
							const data = dataArr[startIndex + num] || undefined;
							if (data) {
								threeData.push({
									no: startIndex + num,
									data: data,
								})
							}
						}

						break;
					}
				}
				for (let i = 0; i < 3; i++) {
					const item = threeData[i];
					if (i < threeData.length) {
						this.overItems[i].bindData(item.no, item.data);
						this.overItems[i].active = true;
					} else {
						this.overItems[i].active = false;
					}
				}
				if (threeData.length === 0) {
					this.overItems[0].active = true;
					this.overItems[0].bindData(0, Sub.selfInfo)
				}
			},
			fail: (res: any) => {
				// this.fail.active = true;
				console.warn('拉取排行榜数据失败', res)
			}
		})
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