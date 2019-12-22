import ScrollViewItem from "./core/ScrollViewItem";
import Label, { AlignType } from "./core/Label";
import Sprite, { RenderType } from "./core/Sprite";
import Sub from "./core/Sub";

export default class FriendRankItem extends ScrollViewItem {

	/** 背景图 */
	private background: Sprite = new Sprite('board_bg1.png', RenderType.sliced);
	/** 排名 */
	private no: Label = new Label();
	/** 图标排名 */
	private noIcon: Sprite = new Sprite();
	/** 头像 */
	private head: Sprite = new Sprite('head.png');
	/** 昵称 */
	private nickName: Label = new Label();
	/** 得分 */
	private score: Label = new Label();

	constructor() {
		super();

		this.addChild(
			this.background,
			this.no,
			this.noIcon,
			this.head,
			this.nickName,
			this.score
		)

		this.height = this.background.height = 120;
		this.width = this.background.width = 600;

		this.no.fontSize = 48;
		this.no.color = '#ffffff';
		this.noIcon.x = this.no.x = this.width / -2 + this.no.width / 2 + 50;

		this.head.width = this.head.height = 80;
		this.head.x = this.width / -2 + this.head.width / 2 + 100;

		this.nickName.x = -80;
		this.nickName.color = '#1675B0';
		this.nickName.fontSize = 30;
		this.nickName.maxWidth = 170;

		this.nickName.textAlign = this.score.textAlign = AlignType.left;
		this.score.x = 100;
		this.score.color = '#3A498A';
		this.score.fontSize = 46;

	}

	public updateViewData(data: UserGameData, index: number) {

		this.nickName.string = data.nickname;
		let value = (data.KVDataList[0] && JSON.parse(data.KVDataList[0].value).score) || 0;
		this.score.string = value + '';
		this.head.setTexture(data.avatarUrl);

		if (index < 3) {
			this.noIcon.active = true;
			this.noIcon.setTexture(`icon_rank${index + 1}.png`);
			this.no.active = false;
		} else {
			this.noIcon.active = false;
			this.no.active = true;
			this.no.string = index + 1 + '';
		}

		if (data.avatarUrl == Sub.selfInfo.avatarUrl) {
			this.background.setTexture('board_bg2.png');
			this.nickName.color = this.score.color = '#DE6E3C';
		} else {
			this.background.setTexture('board_bg1.png');
			this.nickName.color = this.score.color = '#1675B0';
		}

	}
}