cc.Class({
  extends: cc.Component,

  properties: {
    choiceContentsNode: cc.Node,
    choiceButtonPrefab: cc.Prefab
  },

  // use this for initialization
  onLoad: function () {
  },

  clear() {
    this.choiceContentsNode.removeAllChildren();
  },

  createButton(id, name) {
    let instance = cc.instantiate(this.choiceButtonPrefab);
    instance.parent = this.choiceContentsNode;
    let choiceButton = instance.getComponent('ChoiceButton');
    choiceButton.init(id, name);
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
