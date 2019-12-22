import Sprite, { RenderType } from "./core/Sprite";
import Label from "./core/Label";
import Sub from "./core/Sub";

export default class OverRankItem extends Sprite {

	/** 排名 */
	private no: Label = new Label();
	/** 头像 */
	private head: Sprite = new Sprite();
	/** 昵称 */
	private nickName: Label = new Label();
	/** 得分 */
	private score: Label = new Label();

	constructor() {
		super();
		this.setTexture('board_bg1.png', RenderType.sliced);
		let headbg = new Sprite('head.png');
		headbg.addChild(this.head);
		this.addChild(this.no, headbg, this.nickName, this.score);

		this.height = 270;
		this.width = 160;

		this.no.fontSize = 60;
		this.no.color = '#ffffff';
		this.no.y = 95;

		headbg.width = headbg.height = 102;
		headbg.y = 12;

		this.head.width = this.head.height = 96;

		this.nickName.y = -62;
		this.nickName.color = '#1675B0';
		this.nickName.fontSize = 24;
		this.nickName.maxWidth = 160;

		this.score.y = -100;
		this.score.color = '#ffffff';
		this.score.fontSize = 30;

	}

	/**
	 * 初始化数据
	 * @param no 排名
	 * @param data 用户数据
	 */
	public bindData(no: number, data: UserGameData) {

		this.no.string = no + 1 + '';
		this.nickName.string = data.nickname || (data as any).nickName;
		let value = (data.KVDataList && data.KVDataList[0] && JSON.parse(data.KVDataList[0].value).score) || 0;
		this.score.string = value + '';
		this.head.setTexture(data.avatarUrl);

		if (data.avatarUrl == Sub.selfInfo.avatarUrl) {
			this.setTexture('board_bg2.png')
			this.nickName.color = this.score.color = '#DE6E3C';
		}

	}

}