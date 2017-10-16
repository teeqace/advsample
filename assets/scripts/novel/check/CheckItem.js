cc.Class({
  extends: cc.Component,

  properties: {
    itemSprite: cc.Sprite
  },

  // use this for initialization
  onLoad: function () {
    this._debugSprite = this.node.getComponent(cc.Sprite);
    this._touchInput = this.node.getComponent('TouchInput');
  },

  init (data) {
    this.node.opacity = 255;
    this._debugSprite.spriteFrame = '';
    this._touchInput.eventType = '';
  },

  itemClear() {
    this.itemSprite.spriteFrame = null;
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
