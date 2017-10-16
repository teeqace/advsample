import {
  messagePipeline
} from '../core/MessagePipeline';
import AllEffect from './AllEffect';
import Background from './Background';
import Characters from './Characters';
import Texts from './Texts';

import TalkMenu from './talk/TalkMenu';
import MoveMenu from './move/MoveMenu';
import CheckMenu from './check/CheckMenu';
import ChoiceMenu from './choice/ChoiceMenu';
import ItemMenu from './item/ItemMenu';

const PATH_SCENES_JSON = 'jsons/scenes';
const PATH_SCRIPTS_JSON = 'jsons/scripts';
const PATH_ITEMS_JSON = 'jsons/items'

const SCENE_END_SCRIPT = [
  {"type": "common", "action": "start"},
  {"type": "text", "action": "clear"},
  {"type": "allEffect", "action": "blackOut", "time": 1},
  {"type": "bg", "action": "clear"},
  {"type": "chara", "action": "reset"},
]
const ITEM_DEFAULT_SCRIPT = [
  {"type": "common", "action": "start"},
  {"type": "text", "action": "disp", "data":{"name":"", "auto":1, "text":"特に何も起きない"}},
  {"type": "common", "action": "end"},
]
const CHECK_DEFAULT_SCRIPT = [
  {"type": "common", "action": "start"},
  {"type": "text", "action": "disp", "data":{"name":"", "auto":1, "text":"特に気になるところはない"}},
  {"type": "common", "action": "checkEnd"},
  {"type": "common", "action": "end"},
]

const NovelCore = cc.Class({
  extends: cc.Component,

  properties: {
    mainScreen: cc.Node,
    sceneNameText: cc.Label,
    allEffect: AllEffect,
    background: Background,
    characters: Characters,
    texts: Texts,
    menuBlocker: cc.Node,
    firstSceneId: 'introduction',
    talkMenu: TalkMenu,
    moveMenu: MoveMenu,
    choiceMenu: ChoiceMenu,
    itemMenu: ItemMenu,
    checkMenu: CheckMenu
  },

  statics: {
    instance: null,
  },

  // use this for initialization
  onLoad: function () {
    NovelCore.instance = this;

    messagePipeline.on('onNextScript', this._onNextScript, this);
    messagePipeline.on('onTalkStart', this._onTalkStart, this);
    messagePipeline.on('onItemStart', this._onItemStart, this);
    messagePipeline.on('onCheckStart', this._onCheckStart, this);
    messagePipeline.on('onMoveStart', this._onMoveStart, this);
    messagePipeline.on('onChoiceClicked', this._onChoiceClicked, this);
    
    this.init();
  },

  init() {
    this.menuBlocker.setScale(1);
    this._scriptLineNo = -1;

    this._flags = [];

    this._scenes = [];
    this._scripts = [];
    this._flags = [];
    this._itemsData = [];
    this._items = [];

    let loadScenesJson = new Promise((resolve, reject) => {
      cc.loader.loadRes(`${PATH_SCENES_JSON}`, (err, scenesData) => {
        if (!err) {
          for (let i = 0; i < scenesData.length; i++) {
            this._scenes[scenesData[i].id] = scenesData[i];
          }
          resolve(this);
        } else {
          reject(err);
        }
      });
    });
    let loadScriptsJson = new Promise((resolve, reject) => {
      cc.loader.loadRes(`${PATH_SCRIPTS_JSON}`, (err, scriptData) => {
        if (!err) {
          for (let i = 0; i < scriptData.length; i++) {
            this._scripts[scriptData[i].id] = scriptData[i];
          }
          resolve(this);
        } else {
          reject(err);
        }
      });
    });
    let loadItemsJson = new Promise((resolve, reject) => {
      cc.loader.loadRes(`${PATH_ITEMS_JSON}`, (err, itemData) => {
        if (!err) {
          for (let i = 0; i < itemData.length; i++) {
            this._itemsData[itemData[i].id] = itemData[i];
          }
          resolve(this);
        } else {
          reject(err);
        }
      });
    });
    
    Promise.all([loadScenesJson, loadScriptsJson, loadItemsJson]).then(()=>{
      // run first scene
      this._changeScene(this.firstSceneId);
    }).catch(error =>{
      cc.error(error);
    });
  },

  _changeScene(sceneId) {
    this._scene = this._scenes[sceneId];
    this._script = this._scripts[this._scene.firstScript].script.concat();
    this._scriptLineNo = -1;

    this.sceneNameText.string = this._scene.name;

    this.talkMenu.clear();
    this._scene.talks.forEach(function(scriptId) {
      this.talkMenu.createButton(scriptId, this._scripts[scriptId].name);
    }, this);
    this.moveMenu.clear();
    this._scene.moves.forEach(function(moveId) {
      this.moveMenu.createButton(moveId, this._scenes[moveId].name);
    }, this);
    
    this._onNextScript();
  },

  _onTalkStart(event) {
    let scriptId = event.detail;
    
    this._script = this._scripts[scriptId].script;
    this._scriptLineNo = -1;
    this._onNextScript();
  },

  _onItemStart(event) {
    let itemId = event.detail;
    let scriptId = `item:${itemId}:${this._scene.id}`;
    if (this._scripts[scriptId]) {
      this._script = this._scripts[scriptId].script.concat();
    } else {
      this._script = ITEM_DEFAULT_SCRIPT.concat();
    }
    this._scriptLineNo = -1;
    this._onNextScript();
  },
  
  _onCheckStart(event) {
    let checkId = event.detail;
    if (this._scripts[checkId]) {
      this._script = this._scripts[checkId].script.concat();
    } else {
      this._script = CHECK_DEFAULT_SCRIPT.concat();
    }
    this._scriptLineNo = -1;
    this._onNextScript();
  },
  
  _onMoveStart(event) {
    let moveSceneId = event.detail;
    this._script = SCENE_END_SCRIPT.concat();
    this.sceneNameText.string = '';
    this._script.push({"type": "common", "action": "sceneChange", "sceneId": moveSceneId});

    this._scriptLineNo = -1;
    this._onNextScript();
  },

  _onChoiceClicked(event) {
    let choiceScriptId = event.detail;
    let choiceScript = this._scripts[choiceScriptId];

    if (choiceScript && choiceScript.script) {
      for (let i = 0; i < choiceScript.script.length; i++) {
        this._script.splice(this._scriptLineNo + i + 1, 0, choiceScript.script[i]);
      }
    }
    this.choiceMenu.clear();
    messagePipeline.sendMessage('onNextScript');
  },

  _onNextScript() {
    this._scriptLineNo += 1;
    if (this._scriptLineNo >= this._script.length) {
      return;
    }
    let data = this._script[this._scriptLineNo];
    if (data.type === 'bg') {
      this.background.bgEffect(data);
    } else if (data.type === 'chara') {
      this.characters.charaEffect(data);
    } else if (data.type === 'text') {
      this.texts.textEffect(data);
    } else if (data.type === 'common') {
      this._commonEvent(data);
    } else if (data.type === 'allEffect') {
      this.allEffect.allEffect(data);
    }
  },

  _commonEvent(data) {
    let action = data.action;

    if (action === 'start') {
      this._commonStart();
    } else if (action === 'wait') {
      this._commonWait(data.time);
    } else if (action === 'end') {
      this._commonEnd();
    } else if (action === 'sceneChange') {
      this._commonSceneChange(data);
    } else if (action === 'addTalk') {
      this._commonAddTalk(data);
    } else if (action === 'delTalk') {
      this._commonDelTalk(data);
    } else if (action === 'delAllTalk') {
      this._commonDelAllTalk(data);
    } else if (action === 'flagOn') {
      this._commonFlagOn(data);
    } else if (action === 'if-flag-start') {
      this._commonIfFlag(data);
    } else if (action === 'if-flag-end') {
      this._commonIfFlagEnd(data);
    } else if (action === 'chioce') {
      this._commonChoice(data);
    } else if (action === 'choice-start') {
      this._commonChoiceStart(data);
    } else if (action === 'choice-end') {
      this._commonChoiceEnd(data);
    } else if (action === 'itemAdd') {
      this._commonItemAdd(data);
    } else if (action === 'checkEnd') {
      this._commonCheckEnd(data);
    }
  },

  _commonStart() {
    this.menuBlocker.setScale(1);

    messagePipeline.sendMessage('onNextScript');
  },

  _commonWait(time) {
    let action = cc.delayTime(time);
    let retAction = cc.callFunc(()=>{
      messagePipeline.sendMessage('onNextScript');
    }, this);
    this.node.runAction(cc.sequence(action, retAction));
  },
  
  _commonSceneChange(data) {
    this._changeScene(data.sceneId);
  },

  _commonEnd() {
    this.menuBlocker.setScale(0);

    let isDeleteChoice = false;
    for (let i = 0; i < this._script.length; i++) {
      if (this._script[i].type === 'common' && this._script[i].action === 'choice-start') {
        isDeleteChoice = true;
      } else if (this._script[i].type === 'common' && this._script[i].action === 'choice-end') {
        isDeleteChoice = false;
      }
      if (isDeleteChoice) {
        this._script.splice(i, 1);
        i -= 1;
      }
    }
    messagePipeline.sendMessage('onNextScript');
  },

  _commonAddTalk(data) {
    if (this._scene.talks.indexOf(data.id) < 0) {
      this._scene.talks.push(data.id);
      this.talkMenu.createButton(data.id, this._scripts[data.id].name);
    }
    messagePipeline.sendMessage('onNextScript');
  },
  
  _commonDelTalk(data) {
    let index = this._scene.talks.indexOf(data.id);
    if (index >= 0) {
      this._scene.talks.splice(index, 1);
    }
    this.talkMenu.removeButton(data.id);
    messagePipeline.sendMessage('onNextScript');
  },
  
  _commonDelAllTalk(data) {
    this._scene.talks = [];
    this.talkMenu.clear();
    messagePipeline.sendMessage('onNextScript');
  },

  _commonFlagOn(data) {
    if (this._flags.indexOf(data.id) < 0) {
      this._flags.push(data.id);
    }
    messagePipeline.sendMessage('onNextScript');
  },

  _commonIfFlag(data) {
    if (data.val && this._flags.indexOf(data.id) < 0 ||
        !data.val && this._flags.indexOf(data.id) >= 0) {
      let flagKey = data.flagKey;
      for (let i = this._scriptLineNo; i < this._script.length; i++) {
        if (this._script[i].type === 'common' && this._script[i].action === 'if-flag-end' && this._script[i].flagKey === flagKey) {
          this._scriptLineNo = i;
          messagePipeline.sendMessage('onNextScript');
          return;
        }
      }
    } else {
      messagePipeline.sendMessage('onNextScript');
    }
  },
  
  _commonIfFlagEnd(data) {
    messagePipeline.sendMessage('onNextScript');
  },

  _commonChoice(data) {
    for (let i = 0; i < data.data.length; i++) {
      this.choiceMenu.createButton(data.data[i].id, data.data[i].label);
    }
  },

  _commonChoiceStart() {
    messagePipeline.sendMessage('onNextScript');
  },

  _commonChoiceEnd() {
    messagePipeline.sendMessage('onNextScript');
  },

  _commonItemAdd(data) {
    let id = data.id;
    if (this._items.indexOf(id) < 0) {
      this._items.push(id);
      let data = this._itemsData[id];
      this.itemMenu.createButton(data);
    }
    messagePipeline.sendMessage('onNextScript');
  },

  _commonCheckEnd(data) {
    this.checkMenu.checkEnd();
    messagePipeline.sendMessage('onNextScript');
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});

export default NovelCore;