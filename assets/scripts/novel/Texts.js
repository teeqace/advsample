import {
  messagePipeline
} from '../core/MessagePipeline';
const DEFAULT_SPEED = 30;

cc.Class({
  extends: cc.Component,

  properties: {
    nameLabel: cc.Label,
    textLabel: cc.Label,
    letterPerSec: 30
  },

  // use this for initialization
  onLoad: function () {
    this.nameLabel.string = '';
    this.textLabel.string = '';

    this.dispText = '';
    this.textDispLen = 0;
    this.textTotalLen = 0;

    this.isTextTyping = false;
    this.isWaitingTouch = false;
    this.isAuto = false;

    messagePipeline.on('onTouch', this._onTouch, this);
  },

  textEffect(data) {
    let action = data.action;
    
    if (action === 'disp') {
      this._disp(data.data);
    } else if (action === 'clear') {
      this._clear();
    }
  },

  _disp(data) {
    this.nameLabel.string = data.name;
    this.textLabel.string = '';
    this.dispText = data.text;
    if (data.speed) {
      this.letterPerSec = data.speed;
    } else {
      this.letterPerSec = DEFAULT_SPEED;
    }
    
    this.textDispLen = 0;
    this.textTotalLen = this.dispText.length;
    this.isTextTyping = true;
    this.isAuto = data.auto === 1;
  },

  _clear() {
    this.nameLabel.string = '';
    this.textLabel.string = '';

    this.dispText = '';
    this.textDispLen = 0;
    this.textTotalLen = 0;
    this.isTextTyping = false;
    this.isWaitingTouch = false;
    messagePipeline.sendMessage('onNextScript');
  },

  _onTouch(event) {
    let eventType = event.detail;
    if (eventType !== 'text') {
      return;
    }
    if (this.isTextTyping) {
      this.textLabel.string = this.dispText;
      this.isTextTyping = false;
      this.isWaitingTouch = true;
      if (this.isAuto) {
        this.isWaitingTouch = false;
        messagePipeline.sendMessage('onNextScript');
      }
    } else if (this.isWaitingTouch) {
      this.isWaitingTouch = false;
      messagePipeline.sendMessage('onNextScript');
    }
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
    if (this.isTextTyping) {
      this.textDispLen = Math.min(this.textTotalLen, this.textDispLen + dt * this.letterPerSec);
      this.textLabel.string = this.dispText.substr(0, Math.floor(this.textDispLen));
      if (this.textDispLen >= this.textTotalLen) {
        this.isTextTyping = false;
        this.isWaitingTouch = true;
        if (this.isAuto) {
          this.isWaitingTouch = false;
          messagePipeline.sendMessage('onNextScript');
        }
      }
    }
  },
});
