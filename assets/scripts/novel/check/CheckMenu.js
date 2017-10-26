import {
  messagePipeline
} from '../../core/MessagePipeline';
import NovelCore from '../NovelCore';

cc.Class({
  extends: cc.Component,

  properties: {
    checkZones: {
      default: [],
      type: [cc.Node]
    }
  },

  // use this for initialization
  onLoad: function () {
    this.node.x = 2000;
    this.isChecking = false;
    messagePipeline.on('onCheckTouch', this._onCheckTouch, this);
    messagePipeline.on('onCheckMenuOpen', this._onCheckMenuOpen, this);
  },

  createButton (id, name) {
  },

  checkEnd() {
    this.isChecking = false;
  },

  _onCheckMenuOpen() {
    let scene = NovelCore.instance.getScene();
    for (let i = 0; i < this.checkZones.length; i++) {
      if (i === scene.checkZoneIndex) {
        this.checkZones[i].scaleY = 1;
      } else {
        this.checkZones[i].scaleY = 0;
      }
    }
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
