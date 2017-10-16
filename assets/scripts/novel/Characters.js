import {
  messagePipeline
} from '../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    characters: {
      default: [],
      type: [cc.Node]
    }
  },

  // use this for initialization
  onLoad: function () {
    messagePipeline.on('onCheckMenuOpen', this._charaHideForTemp, this);
    messagePipeline.on('onCheckMenuClose', this._charaShowFromTemp, this);
  },

  charaEffect(data) {
    let action = data.action;

    if (action === 'reset') {
      this._charaReset();
    } else if (action === 'show') {
      this._charaShow(data.data);
    } else if (action === 'hide') {
      this._charaHide(data.data);
    }
  },

  _charaReset() {
    for (let i = 0; i < this.characters.length; i++) {
      this.characters[i].setScale(0);
    }
    messagePipeline.sendMessage('onNextScript');
  },
  
  _charaShow(_data) {
    let data = _data.concat();
    let promises = [];
    let defaultPositions = [];
    let charaCount = data.length;
    let baseX = 640 / (charaCount + 1);
    let baseY = -90;


    for (let i = 0; i < data.length; i++) {
      if (!data[i].time) {
        data[i].time = 0;
      }
      if (!data[i].opacity) {
        data[i].opacity = 127;
      }
      if (!data[i].x && data[i].x !== 0) {
        data[i].x = -320 + baseX * (i + 1);
      }
      if (!data[i].y && data[i].y !== 0) {
        data[i].y = baseY;
      }
      if (!data[i].sx) {
        data[i].sx = 1;
      }
      if (!data[i].sy) {
        data[i].sy = 1;
      }
      this.characters[data[i].index].setScale(data[i].sx, data[i].sy);
      this.characters[data[i].index].x = data[i].x;
      this.characters[data[i].index].y = data[i].y;
      this.characters[data[i].index].opacity = 0;

      promises.push(this._fadePromise(data[i].index, data[i].time, data[i].opacity));
    }
    Promise.all(promises)
      .then(()=>{
        messagePipeline.sendMessage('onNextScript');
      });
  },

  _charaHide(_data) {
    let data = _data.concat();
    let promises = [];
    for (let i = 0; i < data.length; i++) {
      promises.push(this._fadePromise(data[i].index, data[i].time, 0));
    }
    Promise.all(promises)
      .then(()=>{
        messagePipeline.sendMessage('onNextScript');
      });
  },

  _fadePromise(index, time, opacity) {
    return new Promise((resolve, reject) => {
      let fadeAction = cc.fadeTo(time, opacity);
      let retAction = cc.callFunc(()=>{
        resolve(this);
      }, this);
      this.characters[index].runAction(cc.sequence(fadeAction, retAction));
    });
  },

  _charaHideForTemp() {
    let action = cc.fadeOut(0.5);
    this.node.runAction(action);
  },
  
  _charaShowFromTemp() {
    let action = cc.fadeIn(0.5);
    this.node.runAction(action);
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
