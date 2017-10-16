import {
  messagePipeline
} from '../../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    btnSprite: cc.Sprite,
    btnOn: cc.Node
  },

  // use this for initialization
  onLoad: function () {
    this.data = null;
    messagePipeline.on('onItemClicked', this._onItemClicked, this);
    messagePipeline.on('onItemMenuOpen', this._onItemClicked, this);
  },

  init(data, image) {
    this.data = data;
    this.btnSprite.spriteFrame = image;
  },

  $clicked() {
    messagePipeline.sendMessage('onItemClicked', this.data);
    this.btnOn.active = true;
  },

  _onItemClicked() {
    this.btnOn.active = false;
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
