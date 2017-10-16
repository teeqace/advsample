import {
  messagePipeline
} from '../../core/MessagePipeline';

cc.Class({
  extends: cc.Component,

  properties: {
    itemContentsNode: cc.Node,
    itemButtonPrefab: cc.Prefab,
    itemName: cc.Label,
    itemDescription: cc.Label,
    itemIcons: {
      default: [],
      type: [cc.SpriteFrame]
    }
  },

  // use this for initialization
  onLoad: function () {
    this.node.x = 2000;
    this.selectedItem = '';
    messagePipeline.on('onItemClicked', this._onItemClicked, this);
  },

  clear() {
    this.textClear();
    this.itemContentsNode.removeAllChildren();
  },

  textClear() {
    this.selectedItem = '';
    this.itemName.string = '';
    this.itemDescription.string = '';
  },

  createButton(data) {
    let instance = cc.instantiate(this.itemButtonPrefab);
    instance.parent = this.itemContentsNode;
    let itemButton = instance.getComponent('ItemButton');
    itemButton.init(data, this.itemIcons[data.imageIndex]);
  },

  _onItemClicked(event) {
    let data = event.detail;
    this.selectedItem = data.id;
    this.itemName.string = data.name;
    this.itemDescription.string = data.description;
  },

  $onClickUseButton() {
    if (this.selectedItem === '') {
      return;
    }
    messagePipeline.sendMessage('onItemStart', this.selectedItem);
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
