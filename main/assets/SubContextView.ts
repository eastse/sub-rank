
const { ccclass, property, menu, requireComponent } = cc._decorator;

export enum SubRankType {
    /** 即将超越 */
    pass = 0,
    /** 好友排行榜 */
    friend = 1,
    /** 结束榜单 */
    over = 2
}

@ccclass
@requireComponent(cc.Sprite)
@menu("子域组件")
export default class SubContextView extends cc.Component {

    @property({ type: cc.Enum(SubRankType) })
    type: SubRankType = SubRankType.friend;

    /** 当前加载的所有子域组件 */
    private static SubComponentArr: SubContextView[] = [];
    /** 开放数据域 */
    private openDataContext: any;
    /** 纹理贴图 */
    private texture: cc.Texture2D;
    /** 精灵 */
    private sprite: cc.Sprite;

    onLoad() {

        if (!CC_WECHATGAME) return;

        this.openDataContext = wx.getOpenDataContext();
        this.texture = new cc.Texture2D();
        this.sprite = this.node.getComponent(cc.Sprite);
        this.sprite.spriteFrame = new cc.SpriteFrame(this.texture);
        SubContextView.SubComponentArr.push(this);
        this.strongRender = this.type == SubRankType.friend;
    }

    onEnable() {

        if (!CC_WECHATGAME) return;
        for (let index = SubContextView.SubComponentArr.length - 1; index >= 0; index--) {
            const item = SubContextView.SubComponentArr[index];
            if (item.type !== this.type) {
                item.unscheduleAllCallbacks();
                if (cc.isValid(item.node)) {
                    item.enabled = false;
                } else {
                    SubContextView.SubComponentArr.splice(index, 1);
                }
            }
        }
        this.updateSubContextViewport();
        this.openDataContext.postMessage({
            event: SubRankType[this.type]
        });

        if (this.strongRender) return;
        this.weakRender();

    }

    onDestroy() {
        for (let i = SubContextView.SubComponentArr.length - 1; i >= 0; i--) {
            const item = SubContextView.SubComponentArr[i];
            if (item == this) {
                SubContextView.SubComponentArr.splice(i, 1);
                break;
            }
        }
    }

    /** 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。 */
    private updateSubContextViewport() {

        // 更新共享画布尺寸
        this.openDataContext.canvas.width = this.node.width;
        this.openDataContext.canvas.height = this.node.height;

        // 更新子域视口
        let box = this.node.getBoundingBoxToWorld();
        let sx = cc.view.getScaleX();
        let sy = cc.view.getScaleY();
        this.openDataContext.postMessage({
            event: 'viewport',
            data: {
                x: box.x * sx + cc.view.getViewportRect().x,
                y: box.y * sy + cc.view.getViewportRect().y,
                width: box.width * sx,
                height: box.height * sy
            }
        });

    }

    /** 更新即将超越信息 */
    public updatePassRank(score: number) {
        if (!CC_WECHATGAME) return;
        this.openDataContext.postMessage({
            event: 'updatePass',
            data: score
        });
        this.weakRender();
    }

    /** 弱渲染 */
    private weakRender() {
        this.unscheduleAllCallbacks();
        this.schedule(() => {
            this.render();
        }, 0.05, 20)
    }

    /** 将画布作为纹理绘制到精灵节点上 */
    private render() {
        this.texture.initWithElement(this.openDataContext.canvas)
        this.sprite.spriteFrame.setTexture(this.texture);
    }

    /** 是否启用强渲染 */
    private strongRender: boolean = false;
    update() {
        if (!CC_WECHATGAME || !this.strongRender) return;
        this.render();
    }
}
