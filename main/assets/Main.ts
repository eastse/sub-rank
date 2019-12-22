import SubContextView from "./SubContextView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(SubContextView)
    friend: SubContextView = null;

    @property(SubContextView)
    skip: SubContextView = null;

    @property(SubContextView)
    over: SubContextView = null;

    onShowFriend() {
        this.skip.enabled = this.over.enabled = this.skip.node.active = this.over.node.active = false;
        this.friend.enabled = this.friend.node.active = true;

        this.unscheduleAllCallbacks();
    }

    private score: number = 0;
    onShowSkip() {
        this.skip.enabled = this.skip.node.active = true;
        this.friend.node.active = this.over.node.active = false;
        this.friend.enabled = this.over.enabled = false;

        this.scheduleOnce(() => {
            this.skip.getComponent(SubContextView).updatePassRank(this.score);
        }, 2)
    }

    onShowOver() {
        this.friend.node.active = this.skip.node.active = false;
        this.over.enabled = this.over.node.active = true;
        this.friend.enabled = this.skip.enabled = false;
        this.unscheduleAllCallbacks();
    }

}

declare global {
    /** 微信环境全局变量 */
    let wx: any;
}