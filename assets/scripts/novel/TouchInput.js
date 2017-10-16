import {
  messagePipeline
} from '../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    eventType: ''
  },
  
  // use this for initialization
  onLoad() {
    this._registerEvent()
  },

  onDestroy() {
    this._unregisterEvent()
  },

  _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
  },

  _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
  },

  _onTouchBegan(event) {
    let location = event.getLocation()
    // cc.log('_onTouchBegan')
    if (this.eventType === 'text') {
      messagePipeline.sendMessage('onTouch', this.eventType);
    } else if (this.eventType.indexOf('check:') === 0) {
      messagePipeline.sendMessage('onCheckTouch', this.eventType);
    }
  }

})