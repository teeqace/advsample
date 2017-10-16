

cc.Class({
  extends: cc.Component,

  properties: {
    moveContentsNode: cc.Node,
    moveButtonPrefab: cc.Prefab
  },

  // use this for initialization
  onLoad: function () {
    this.node.x = 2000;
  },

  clear() {
    this.moveContentsNode.removeAllChildren();
  },

  createButton (id, name) {
    let instance = cc.instantiate(this.moveButtonPrefab);
    instance.parent = this.moveContentsNode;
    let moveButton = instance.getComponent('MoveButton');
    moveButton.init(id, name);
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
