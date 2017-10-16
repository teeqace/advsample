import {
  messagePipeline
} from '../../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    textNode: cc.Node,
    talkMenu: cc.Node,
    itemMenu: cc.Node,
    checkMenu: cc.Node,
    moveMenu: cc.Node
  },

  // use this for initialization
  onLoad: function () {
    messagePipeline.on('onTalkStart', this.$onClickTalkBackButton, this);
    messagePipeline.on('onItemStart', this.$onClickItemBackButton, this);
    messagePipeline.on('onMoveStart', this.$onClickMoveBackButton, this);
  },

  $onClickTalkButton() {
    this.node.x = 2000;
    this.talkMenu.x = 0;
  },

  $onClickTalkBackButton() {
    this.node.x = 0;
    this.talkMenu.x = 2000;
  },
  
  $onClickItemButton() {
    this.node.x = 2000;
    // this.textNode.x = 2000;
    this.textNode.opacity = 0;
    this.itemMenu.x = 0;
  },
  
  $onClickItemBackButton() {
    this.node.x = 0;
    this.textNode.opacity = 255;
    this.itemMenu.getComponent('ItemMenu').textClear();
    messagePipeline.sendMessage('onItemMenuOpen');
    this.itemMenu.x = 2000;
  },
  
  $onClickCheckButton() {
    this.node.x = 2000;
    this.checkMenu.x = 0;
    messagePipeline.sendMessage('onCheckMenuOpen');
  },

  $onClickCheckBackButton() {
    this.node.x = 0;
    this.checkMenu.x = 2000;
    messagePipeline.sendMessage('onCheckMenuClose');
  },
  
  $onClickMoveButton() {
    this.node.x = 2000;
    this.moveMenu.x = 0;
  },

  $onClickMoveBackButton() {
    this.node.x = 0;
    this.moveMenu.x = 2000;
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
