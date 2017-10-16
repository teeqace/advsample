import {
  messagePipeline
} from '../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    effectColor: cc.Node
  },

  // use this for initialization
  onLoad: function () {

  },
  
  allEffect(data) {
    let action = data.action;

    if (action === 'clear') {
      this._clear();
    } else if (action === 'blackOut') {
      this._blackOut(data.time);
    } else if (action === 'blackIn') {
      this._blackIn(data.time);
    }
  },

  _clear() {
    this.effectColor.opacity = 0;
    messagePipeline.sendMessage('onNextScript');
  },

  _blackOut(time) {
    let action = cc.fadeIn(time);
    let retAction = cc.callFunc(()=>{
      messagePipeline.sendMessage('onNextScript');
    }, this);
    this.effectColor.color = cc.Color.BLACK;
    this.effectColor.runAction(cc.sequence(action, retAction));
  },
  
  _blackIn(time) {
    let action = cc.fadeOut(time);
    let retAction = cc.callFunc(()=>{
      messagePipeline.sendMessage('onNextScript');
    }, this);
    this.effectColor.color = cc.Color.BLACK;
    this.effectColor.runAction(cc.sequence(action, retAction));
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
