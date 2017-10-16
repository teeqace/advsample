cc.Class({
  extends: cc.Component,

  properties: {},

  // use this for initialization
  onLoad: function () {
    this.targetX = this.node.position.x
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
    let distance = this.targetX - this.node.x
    this.node.x += distance * (dt * 2)
  },

  setTarget(value) {
    this.targetX = value
  }
});