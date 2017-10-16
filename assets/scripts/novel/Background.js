import {
  messagePipeline
} from '../core/MessagePipeline';

const SHAKE_ACTION = cc.sequence(
  cc.moveTo(0, -4, -4),
  cc.delayTime(0.05),
  cc.moveTo(0, 4, -4),
  cc.delayTime(0.05),
  cc.moveTo(0, 4, 4),
  cc.delayTime(0.05),
  cc.moveTo(0, -4, 4),
  cc.delayTime(0.05),
  cc.moveTo(0, 0, 0)
);

cc.Class({
  extends: cc.Component,

  properties: {
    bgImages: {
      default: [],
      type: [cc.SpriteFrame]
    },
    bgBack: cc.Sprite,
    bgFront: cc.Sprite,
    effectColor: cc.Node
  },

  // use this for initialization
  onLoad: function () {
    // this._bgOpen(4, 0, 0, 1)
    //   .then(()=>this._bgShake(5))
    //   .then(()=>this._bgFlash(5, 0.1, cc.color(255, 255, 0)))
    //   .then(()=>this._bgChange(2))
    //   .then(()=>this._bgFadeOut(4, cc.color(255, 0, 0)))
    //   .then(()=>this._bgFadeIn(3, 2))
    //   .then(()=>this._bgCrossFade(1, 3.5));
  },

  bgEffect(data) {
    let action = data.action;

    if (action === 'change') {
      this._bgChange(data.bgIndex);
    } else if (action === 'fadein') {
      this._bgFadeIn(data.bgIndex, data.time);
    } else if (action === 'fadeout') {
      this._bgFadeOut(data.color, data.time);
    } else if (action === 'crossfade') {
      this._bgCrossFade(1, 1)
    } else if (action === 'open') {
      this._bgOpen(4, 0, 0, 1)
    } else if (action === 'flash') {
      this._bgFlash(5, 0.1, cc.color(255, 255, 0))
    } else if (action === 'shake') {
      this._bgShake(5);
    } else if (action === 'clear') {
      this._bgClear();
    }
  },

  _bgClear() {
    this.bgFront.spriteFrame = this.bgImages[0];
    this.effectColor.opacity = 0;
    messagePipeline.sendMessage('onNextScript');
  },

  _bgChange(bgIndex) {
    // return new Promise((resolve, reject) => {
      this.bgFront.spriteFrame = this.bgImages[bgIndex];
      // resolve(this);
      messagePipeline.sendMessage('onNextScript');
    // });
  },

  _bgFadeIn(bgIndex, time) {
    // return new Promise((resolve, reject) => {
      this.bgFront.spriteFrame = this.bgImages[bgIndex];
      let action = cc.fadeOut(time);
      let retAction = cc.callFunc(()=>{
        messagePipeline.sendMessage('onNextScript');
        // resolve(this);
      }, this);
      this.effectColor.runAction(cc.sequence(action, retAction));
    // });
  },
  
  _bgFadeOut(color, time) {
    // return new Promise((resolve, reject) => {
      this.effectColor.color = cc.hexToColor(color);
      let action = cc.fadeIn(time);
      let retAction = cc.callFunc(()=>{
        messagePipeline.sendMessage('onNextScript');
        // resolve(this);
      }, this);
      this.effectColor.runAction(cc.sequence(action, retAction));
    // });
  },

  _bgCrossFade(bgIndex, time) {
    // return new Promise((resolve, reject) => {

      this.bgBack.node.active = true;
      this.bgBack.spriteFrame = this.bgImages[bgIndex];
      let actionBtoF = cc.fadeIn(time);
      let actionAfterFadeIn = cc.callFunc(()=>{
        this.bgBack.node.active = false;
      }, this);
      this.bgBack.node.runAction(cc.sequence(actionBtoF, actionAfterFadeIn));

      let actionFtoB = cc.fadeOut(time);
      let actionAfterFadeOut = cc.callFunc(()=>{
        this.bgFront.node.opacity = 255;
        this.bgFront.spriteFrame = this.bgImages[bgIndex];
        messagePipeline.sendMessage('onNextScript');
        // resolve(this);
      }, this);
      this.bgFront.node.runAction(cc.sequence(actionFtoB, actionAfterFadeOut));
    // });
  },

  _bgOpen(bgIndex, scaleX, scaleY, time) {
    // return new Promise((resolve, reject) => {
      this.bgFront.spriteFrame = this.bgImages[bgIndex];
      this.bgFront.node.setScale(scaleX, scaleY);
      let action = cc.scaleTo(time, 1, 1);
      let retAction = cc.callFunc(()=>{
        messagePipeline.sendMessage('onNextScript');
        // resolve(this);
      }, this);
      this.bgFront.node.runAction(cc.sequence(action, retAction));
    // });
  },

  _bgFlash(times, delayTime, color) {
    // return new Promise((resolve, reject) => {
      this.effectColor.color = color;
      let flashOn = cc.fadeIn(0);
      let delay = cc.delayTime(delayTime);
      let flashOff = cc.fadeOut(0);
      let flashAction = cc.sequence(flashOn, cc.delayTime(0.05), flashOff, delay);

      let retAction = cc.callFunc(()=>{
        messagePipeline.sendMessage('onNextScript');
        // resolve(this);
      }, this);
      this.effectColor.runAction(cc.sequence(cc.repeat(flashAction, times), retAction));
    // });
  },

  _bgShake(times) {
    // return new Promise((resolve, reject) => {
      let retAction = cc.callFunc(()=>{
        messagePipeline.sendMessage('onNextScript');
        // resolve(this);
      }, this);
      this.node.runAction(cc.sequence(cc.repeat(SHAKE_ACTION, times), retAction));
    // });
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
