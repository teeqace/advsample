import {
  messagePipeline
} from '../../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    btnLabel: cc.Label
  },

  // use this for initialization
  onLoad: function () {
    this.id = ''
  },

  init(id, name) {
    this.id = id;
    this.btnLabel.string = name;
    this.node.x = 0;
  },

  $clicked() {
    messagePipeline.sendMessage('onChoiceClicked', this.id);
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
