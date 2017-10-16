

cc.Class({
  extends: cc.Component,

  properties: {
    talkContentsNode: cc.Node,
    talkButtonPrefab: cc.Prefab
  },

  // use this for initialization
  onLoad: function () {
    this.node.x = 2000;
  },

  clear() {
    this.talkContentsNode.removeAllChildren();
  },
  
  removeButton(id) {
    this.talkContentsNode.getComponentsInChildren('TalkButton').forEach(function(element) {
      if (element.id === id) {
        this.talkContentsNode.removeChild(element.node);
      }
    }, this);
  },

  createButton (id, name) {
    let instance = cc.instantiate(this.talkButtonPrefab);
    instance.parent = this.talkContentsNode;
    let talkButton = instance.getComponent('TalkButton');
    talkButton.init(id, name);
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
