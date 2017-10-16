import {
  messagePipeline
} from '../../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
  },

  // use this for initialization
  onLoad: function () {
    this.node.x = 2000;
    this.isChecking = false;
    messagePipeline.on('onCheckTouch', this._onCheckTouch, this);
  },

  createButton (id, name) {
  },

  checkEnd() {
    this.isChecking = false;
  },

  _onCheckTouch(event) {
    let checkId = event.detail;
    if (this.isChecking) {
      messagePipeline.sendMessage('onTouch', 'text');
      return;
    } else {
      this.isChecking = true;
      let eventType = event.detail;
      messagePipeline.sendMessage('onCheckStart', checkId);
    }
  },
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
