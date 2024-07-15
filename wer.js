class Editor {
  currentId;
  currentIdIndex;
  editor;
  blocks;
  blockTypes;
  blockIds;
  toolBarInit;
  toolBar;
  isContentEditable;
  contentEditable;
  blocksTypesData;
  toolBarData;
  saveData;
  constructor(editor, blockTypes, toolBarInit) {
    this.blocks = {}
    this.blockIds = []
    this.currentId;
    this.currentIdIndex;
    this.editor = document.getElementById(editor);
    this.blockTypes = blockTypes;
    this.toolBarInit = toolBarInit;
    this.toolBar = {}
    this.createPopUp()
    this.createToolBar()
    this.isContentEditable = true;
    this.contentEditable = true
    this.blocksTypesData = {}
    this.toolBarData = {}
    this.ctrlZlevel = Number(localStorage.getItem("ctrlZlevel"+this.editor.id)) || 0
    this.allSaveData = JSON.parse(localStorage.getItem("data"+this.editor.id))
    this.saveData = null
    // console.log(this.allSaveData["versions"])
    for (let i in this.blockTypes) {
      (new this.blockTypes[i]["class"](this.blockTypes[i]["type"], this.blockTypes[i])).onEditorLoad(this)
    }
    if(this.allSaveData != null) {
      this.saveData = this.allSaveData["versions"][this.allSaveData["versions"].length - 1 - this.ctrlZlevel]
      for (let i in this.saveData["blockData"]) {
        let type = this.saveData["blockData"][i].type
        this.loadBlock((new this.blockTypes[type]["class"](type, this.blockTypes[type])), this.saveData["blockData"][i].extra, this.saveData["blockData"][i])
      }
    } else {
      this.createNewBlock("title")
    }
    // this.focusOnBlock(this.blockIds[this.blockIds.length - 1])
    
  }
  createPopUp() {
    let ul = document.createElement('ul')
    ul.id = "popup"+this.editor.id
    let anchorEl;
    let liEl;
    for (let i in this.blockTypes) {
      let blockType = new this.blockTypes[i]["class"](i, this.blockTypes[i])
      if (blockType.viewInPopup == false) {continue}
      if(blockType.extra !== undefined) {
        for (let x in blockType.extra) {
          anchorEl = document.createElement('a');
          anchorEl.type = blockType.type
          anchorEl.setAttribute("extra", blockType.extra[x])
          anchorEl.innerHTML = x
          liEl = document.createElement('li');
          liEl.appendChild(anchorEl)
          ul.appendChild(liEl)
        }
      } else {
        anchorEl = document.createElement('a');
        anchorEl.type = i
        anchorEl.innerHTML = i
        liEl = document.createElement('li');
        liEl.appendChild(anchorEl)
        ul.appendChild(liEl) 
      }
    }
    $(ul).css("display", "none");
    this.editor.appendChild(ul)
  }
  createToolBar() {
    let container = document.createElement('div')
    container.classList.add('toolbar')
    container.id = 'toolbar'+this.editor.id
    for (let i in this.toolBarInit) {
      let button = document.createElement('button')
      button.innerHTML = (new this.toolBarInit[i]["class"](this)).name
      button.type = (new this.toolBarInit[i]["class"](this)).type
      button.id = (new this.toolBarInit[i]["class"](this)).name + this.editor.id
      button.setAttribute("onclick", this.editor.id+".toolBar['"+i+"'].onClickJS("+this.editor.id+")")
      button.classList.add("notactive")
      button.classList.add("toolBarTool")
      container.appendChild(button)
      let tool = new this.toolBarInit[i]["class"](this, button)
      this.toolBar[i] = tool
    }
    $(container).css("position", "absolute");
    $(container).css("display", "none");
    this.editor.appendChild(container)
  }
  toolBarDisplay(){
    if(window.getSelection().toString()){
      editor.setContentEditable(false)
      for (let i in this.toolBar) {
        this.toolBar[i].isActive(this)
      }
      document.getElementById("toolbar"+this.editor.id).style["display"] = "block"
      let position = this.getCaretGlobalPosition()
      let toolbar = document.getElementById("toolbar"+this.editor.id)
      let blockEdit = this.currentBlock().writeDiv
      if(position == undefined) {
        position = blockEdit.getBoundingClientRect();
        position = {left: position.left, top: position.top+blockEdit.clientHeight}
        // console.log(position)
      }
      if(position !== undefined) {
        toolbar.style["display"] = "flex"
        // console.log(position)
        toolbar.style.setProperty('left', Math.floor(position["left"]) + "px")
        toolbar.style.setProperty('top', Math.floor(position["top"]+5) + "px")
      }
      editor.setContentEditable(true)
    }
  }
  createNewBlock(type, id="next", extra="none", blockPassOption={}, loadData={}) {
    let options = this.blockTypes[type];

    for (let i in blockPassOption){
      options[i] = blockPassOption[i]
    }
    let idd;
    if(id == "next") {
      if(this.blockIds[this.currentIdIndex + 1] != undefined) {
        idd = this.blockIds[this.currentIdIndex + 1]
      } else {
        idd = "end"
      }
    } else if(id == "end") {
      idd = id
      
    } else {
      idd = id
    }
    const block = new Block(this.editor, new this.blockTypes[type]["class"](type, options), idd, extra, this, loadData)
    options = {}
    if(id != "end") {
      this.blockIds.splice(this.currentIdIndex+1, 0, block.id)
    } else {
      this.blockIds.push(block.id)
    }
    this.blocks[block.id] = block
    this.focusOnBlock(block.id)
  }
  loadBlock(type, extra, loadData) {
    const block = new Block(this.editor, type, "end", extra, this, loadData)
    this.blockIds.push(block.id)
    this.blocks[block.id] = block
  }
  getCaretGlobalPosition(){
    const r = document.getSelection().getRangeAt(0)
    const node = r.startContainer
    const offset = r.startOffset
    const pageOffset = {x:window.pageXOffset || window.scrollX , y:window.pageYOffset||window.scrollY }
    let rect,  r2;

    if (offset > 0) {
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)
        rect = r2.getBoundingClientRect()
        return { left:rect.right + pageOffset.x, top:rect.bottom + pageOffset.y }
    }
  }
  focusOnBlock(id, caret="end") {
    this.currentId = id
    this.currentIdIndex = this.blockIds.indexOf(this.currentId)
    document.getElementById(this.currentId).querySelector(".blockEditor").focus()
    this.blocks[this.currentId].onFocusJS()
    // console.log(document.getElementById(this.currentId).querySelector(".blockEditor"))
    if(caret != "none"){
      this.blocks[this.currentId].setCaret(caret)
    }
  }
  deleteBlock(id){
    if(this.blocks[id] != undefined && this.blocks[id].deletable == true) {
      this.blocks[id].deleteBlock()
      this.blockIds.splice(this.currentIdIndex, 1)
      delete this.blocks[id]
      this.focusOnBlock(this.blockIds[this.currentIdIndex - 1])
    }
  }
  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    // ev.target.childNodes[5].style["display"] = "none"
    document.getElementById("editor").insertBefore(document.getElementById(data), ev.target);
    this.blockIds.splice(this.blockIds.indexOf(data), 1)
    this.blockIds.splice(this.blockIds.indexOf(ev.target.id), 0, data)
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  prevBlock() {
   if(this.currentIdIndex >0) {
    this.focusOnBlock(this.blockIds[this.currentIdIndex - 1])
   } 
  }
  nextBlock(create=false,createNewBlock="text",id="next", extra="none", blockPassOption={}, loadData={}) {
    if(this.currentIdIndex < (this.blockIds.length - 1)) {
      this.focusOnBlock(this.blockIds[this.currentIdIndex + 1], "end")
    } 
    else if(create == true) {
      // console.log("nextBlock",create, createNewBlock, this.currentIdIndex, this.blockIds.length - 1)
      this.createNewBlock(createNewBlock)
   } else {
    // console.log()
    this.focusOnBlock(this.blockIds[this.currentIdIndex], "none")
   }
  }
  currentBlock() {
    return this.blocks[this.currentId]
  }
  setContentEditable(contentEditable) {
    if(this.isContentEditable == true) {
      this.contentEditable = contentEditable
      for(let i in this.blocks) {
        this.blocks[i].writeDiv.setAttribute("contenteditable", contentEditable)
      }
    }
  }
  convertBlock(type, block) {
    block.convert(new this.blockTypes[type]["class"](type, this.blockTypes[type]))
  }
  getData() {
    let data = {"blockData":[],"blocks":this.blockTypes, "toolBar":this.toolBarInit}
    for (let i in this.blockIds) {
      let block = this.blocks[this.blockIds[i]]
      data["blockData"].push({
        "content":block.content,
        "contentHTML":block.contentHTML,
        "id": block.id,
        "mdDet": block.mdDet,
        "newBlockOnEnter": block.newBlockOnEnter,
        "type":block.type,
        "deletable": block.deletable,
        "delBlockOnBack": block.delBlockOnBack,
        "extra": block.extra
      })
    }
    // for (let i in this.blocksTypesData) {
    //   data["blocks"][i] = (new this.blockTypes("", ""))[i]
    // }
    // for (let i in this.toolBarData) {
    //   data["toolBar"][i] = (new this.blockTypes("", ""))[i]
    // }
    let savedData = JSON.parse(localStorage.getItem("data"+this.editor.id))
    if(savedData == null) {
      localStorage.setItem("data"+this.editor.id, JSON.stringify({"versions":[data]}));
    } else {
      if(this.ctrlZlevel != 0) {
        savedData["versions"].splice((savedData["versions"].length - this.ctrlZlevel), this.ctrlZlevel)
        this.ctrlZlevel = 0
      }
      savedData["versions"].push(data)
      this.allSaveData = savedData
      localStorage.setItem("data"+this.editor.id, JSON.stringify(savedData));
    }
    this.saveData = data
  }
  updateEditorContent() {
    for (i in this.blocks) {
      this.blocks[i].deleteBlock(true)
      this.blockIds.splice(this.blockIds.indexOf(i), 1)
      delete this.blocks[i]
    }
    for (let i in this.saveData["blockData"]) {
      let type = this.saveData["blockData"][i].type
      this.loadBlock((new this.blockTypes[type]["class"](type, this.blockTypes[type])), this.saveData["blockData"][i].extra, this.saveData["blockData"][i])
    }
  }
  changeVersion(num = 1) {
    if(this.allSaveData != null) {
      if(this.allSaveData["versions"].length - this.ctrlZlevel > 0 && this.ctrlZlevel > 0 ) {
        this.saveData = this.allSaveData["versions"][this.allSaveData["versions"].length - 1 - this.ctrlZlevel]
        this.updateEditorContent()
      } else {
        this.ctrlZlevel = this.allSaveData["versions"].length - 1
      }
    }
  }
  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  htmlToMD(html) {
    let string = html
    for (i in this.toolBarInit) {
      let toolBarTool = new this.toolBarInit[i].class
      let otag = toolBarTool.open
      let ctag = toolBarTool.close
      let indexOtag = string.indexOf(otag) 
      let indexCtag = string.indexOf(ctag)
      if(indexOtag != -1 && indexCtag != -1) {
        string = string.replace(otag, " "+toolBarTool.mdPrefix)
        string = string.replace(ctag, toolBarTool.mdSuffix)
      } else {
        continue
      }
    }
    return string
  }
}

class Block {
  editor;
  id;
  mdDet;
  content;
  contentHTML;
  newBlockOnEnter;
  delBlockOnBack;
  type;
  deletable;
  thisBlock;
  writeDiv;
  extra;
  typeObj;
  editorObj;
  constructor(editor, type, id="end", extra, editorObj, loadData=false) {
    this.editorObj = editorObj
    this.editor = editor
    this.id = editor.id + `${Math.floor(Math.random() * 1000000)}`
    this.mdDet = [type.mdPrefix, type.mdSuffix]
    this.newBlockOnEnter = loadData.newBlockOnEnter || type.newBlockOnEnter;
    this.type = loadData.type || type.type
    this.deletable = loadData.deletable || type.deletable;
    this.delBlockOnBack = loadData.delBlockOnBack || type.delBlockOnBack
    this.content = loadData.content || ""
    this.contentHTML = loadData.contentHTML || ""
    // console.log(this.content, loadData.content, this.contentHTML == "")
    this.typeObj = type
    this.extra = extra
    let newBlock = document.createElement('div');
    newBlock.className = 'fullBlock';
    newBlock.id = this.id
    if(this.typeObj.drag != false) {
      newBlock.setAttribute('ondrop', this.editor.id+".drop(event)")
      newBlock.setAttribute('ondragover', this.editor.id+".allowDrop(event)")
      newBlock.setAttribute('ondragstart', this.editor.id+".drag(event)")
    }
    else {
      newBlock.setAttribute('ondrop', "return false;")
      newBlock.setAttribute('ondragover', "event.preventDefault()")
      newBlock.setAttribute('ondragstart', "event.preventDefault()")
    }

    newBlock.setAttribute('draggable', "false")

    let dragButton = document.createElement('div')
    dragButton.className = "dragButton";
    dragButton.setAttribute('unselectable', 'on')
    dragButton.setAttribute('onselectstart', 'return false')
    dragButton.setAttribute('content', '&#10303;')
    // dragButton.setAttribute('onmousedown', 'return false')
    // dragButton.innerHTML = "&#10303;"
    newBlock.appendChild(dragButton)
    
    let blockEditor = document.createElement('div');
    blockEditor.className = "blockEditor blockEditor"+this.editor.id
    blockEditor.setAttribute('contenteditable', 'true');
    blockEditor.setAttribute('ondragenter',"event.preventDefault(); event.dataTransfer.dropEffect = 'none';")
    blockEditor.setAttribute('ondragover',"event.preventDefault(); event.dataTransfer.dropEffect = 'none';")
    if(this.contentHTML != "") {
      blockEditor.innerHTML = this.contentHTML
    } else if(this.content != "") {
      // console.log(this.content)
      blockEditor.innerText = this.content
    } else {
      blockEditor.innerHTML = ""
    }
    // console.log(loadData)

    $(blockEditor).css("width","50vw")
    // $(blockEditor).css("order", "1")
    
    newBlock.appendChild(blockEditor)
    this.thisBlock = newBlock;
    this.writeDiv = blockEditor;
    this.updateStyle()
    this.onLoadRunJS()

    if(id == "end") {
      this.editor.append(newBlock)
    } else {
      this.editor.insertBefore(newBlock, document.getElementById(id))
    }
  }
  deleteBlock(override = false){
    if(this.deletable == true || override == true) {
      document.getElementById(this.id).remove()
    }
  }
  setCaret(char, el=this.writeDiv) {
    let range = document.createRange()
    let sel = window.getSelection()
    let elObj = el;
    if(char == 'end') {
      if(el.childNodes.length == 0) {
        char = el.innerText.length
      } else {
        char = el.childNodes[0].data.length
        elObj = el.childNodes[0]
      }
    }
    range.setStart(elObj, char)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
  }
  createRange(node, chars, range) {
    //https://stackoverflow.com/questions/6249095/how-to-set-the-caret-cursor-position-in-a-contenteditable-element-div
      if (!range) {
          range = document.createRange()
          range.selectNode(node);
          range.setStart(node, 0);
      }

      if (chars.count === 0) {
          range.setEnd(node, chars.count);
      } else if (node && chars.count >0) {
          if (node.nodeType === Node.TEXT_NODE) {
              if (node.textContent.length < chars.count) {
                  chars.count -= node.textContent.length;
              } else {
                  range.setEnd(node, chars.count);
                  chars.count = 0;
              }
          } else {
              for (var lp = 0; lp < node.childNodes.length; lp++) {
                  range = this.createRange(node.childNodes[lp], chars, range);

                  if (chars.count === 0) {
                    break;
                  }
              }
          }
    } 

    return range;
  }
  setCurrentCursorPosition(chars, el) {
    //https://stackoverflow.com/questions/6249095/how-to-set-the-caret-cursor-position-in-a-contenteditable-element-div
    if (chars >= 0) {
      var selection = window.getSelection();
      let range = this.createRange(el.parentNode, { count: chars });
      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
  node_walk(node, func) {
    var result = func(node);
    for(node = node.firstChild; result !== false && node; node = node.nextSibling)
      result = this.node_walk(node, func);
    return result;
  }
  getCaretPosition(elem=this.writeDiv) {
    var sel = window.getSelection();
    var cum_length = [0, 0];
    if(sel.anchorNode == elem)
      cum_length = [sel.anchorOffset, sel.focusNode];
    else {
      // console.log(sel.anchor)
      var nodes_to_find = [sel.anchorNode, sel.focusNode];
      if(!elem.contains(sel.anchorNode) || !elem.contains(sel.focusNode)) {
        return undefined;
      }else {
        var found = [0,0];
        var i;
        this.node_walk(elem, function(node) {
          for(i = 0; i < 2; i++) {
            if(node == nodes_to_find[i]) {
              found[i] = true;
              if(found[i == 0 ? 1 : 0])
                return false; // all done
            }
          }

          if(node.textContent && !node.firstChild) {
            for(i = 0; i < 2; i++) {
              if(!found[i])
                cum_length[i] += node.textContent.length;
            }
          }
        });
        cum_length[0] += sel.anchorOffset;
        cum_length[1] += sel.focusOffset;
      }
    }
    // console.log(sel.anchorNode,sel.focusOffset, "CUM_LENGTH")
    if(cum_length[0] <= cum_length[1]) {
      return cum_length;
    }
    return [cum_length[1], cum_length[0]];
  }
  getSelectionCharacterOffsetWithin(element) {
    //https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container
    var start = 0;
    var end = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            start = preCaretRange.toString().length;
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            end = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToStart", textRange);
        start = preCaretTextRange.text.length;
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        end = preCaretTextRange.text.length;
    }
    return { start: start, end: end };
  }
  changeType(type) {
    this.newBlockOnEnter = type.newBlockOnEnter;
    this.type = type.type;
    this.deletable = type.deletable;
  }
  updateStyle(){
    if(this.extra != "none") {
      // this.writeDiv.setAttribute("style", this.typeObj.extra[this.extra])
      this.typeObj.typeStyle(this,this.editorObj,this.extra)
    } else {
      this.typeObj.typeStyle(this,this.editorObj)
    }
  }
  removeBlockStyling() {
    this.typeObj.typeRemoveStyle(this, this.editor, this.extra)
  }
  onLoadRunJS() {
    this.typeObj.typeOnLoadJS(this, this.editorObj)
  }
  onFocusJS() {
    this.typeObj.typeOnFocusJS(this, this.editorObj)
  }
  convert(type) {
    this.removeBlockStyling()
    this.newBlockOnEnter = type.newBlockOnEnter;
    this.type = type.type;
    this.deletable = type.deletable;
    this.delBlockOnBack = type.delBlockOnBack;
    this.typeObj = type
    this.updateStyle()
  }
  updateContent(HTML, text) {
    this.contentHTML = HTML    
    this.content = text
  }
}

function runEditor(editor) {
  let shiftMod = false
  document.addEventListener('keydown', function(e) {if (e.key == 'Shift') {shiftMod = true}});
  document.addEventListener('keyup', function(e) {if (e.key == 'Shift') {shiftMod = false}});

  let ctrlMod = false
  document.addEventListener('keydown', function(e) {if (e.key == 'Control') {ctrlMod = true}});
  document.addEventListener('keyup', function(e) {if (e.key == 'Control') {ctrlMod = false}});

  // let blockEditorClass = ".blockEditor"

  // $(blockEditorClass).on("selectstart", function() {
  //     $(blockEditorClass).attr("contenteditable", false);
  // });
  // $(blockEditorClass).on("click", function() {
  //     $(blockEditorClass).attr("contenteditable", "true");
  // });

  let slashCommand = false
  let escapeSearch = false
  let slashPos;
  let selectTextStart = false
  let noResults = false;
  let numCtrlA = 0;
  let ctrlASelect = false
  let selectMultiTextStart = false
  // let counter = 0
  document.addEventListener('selectstart', function(e) {
    if(e.target.parentNode.matches(".blockEditor") || e.target.parentNode.matches(".fullBlock")) {
      selectTextStart = true

      editor.setContentEditable(false)
      // editor.setContentEditable(false)
      // selectMultiTextStart = true
      // if(e.target.parentNode.matches(".blockEditor")) {
      //   prevBlock = e.target.parentNode.parentNode.id
      // } else if (e.target.parentNode.matches(".fullBlock")) {
      //   prevBlock = e.target.parentNode
      // }
    }
  })

  document.addEventListener("keydown", function(e) {
    if(editor.currentId != undefined) {
      let saveDataBool = true
      // editor.currentBlock().typeObj.typeUpdateContent(editor, editor.currentBlock())
      editor.currentBlock().typeObj.typeOnkeyDownJS(e, editor, shiftMod, editor.currentBlock(), slashCommand)
      if(e.target.matches(".blockEditor"+editor.editor.id)) {
        if(saveDataBool == true) {
          // editor.getData()
        }
        let idOfBlock = e.target.parentNode.id
        if(editor.blocks[idOfBlock] != undefined && e.key == "Enter") {
          e.preventDefault()
          if(editor.blocks[idOfBlock].newBlockOnEnter == true) {
            if(slashCommand == false && editor.currentIdIndex == (editor.blockIds.length - 1)) {
              editor.createNewBlock("text")
            } else if(slashCommand == false) {
              editor.createNewBlock("text", editor.blockIds[editor.currentIdIndex + 1])
            }
          }
        }
        if(e.key == "Backspace" && (e.target.innerText == "\n" || e.target.innerText == "")) {
          if(editor.blocks[idOfBlock].delBlockOnBack == true){
            e.preventDefault()
            editor.deleteBlock(idOfBlock)
          } else {
            editor.blocks[idOfBlock].typeObj.typeOnKeyDownConvert(e, editor.blocks[idOfBlock])
          }
          
        }
        if(slashCommand == false){
          if(e.key == 'ArrowUp') {
            e.preventDefault();
            editor.prevBlock()
            if(selectMultiTextStart == true) {
              editor.setContentEditable(true)
              selectMultiTextStart == true
            }
          }
          if(e.key == 'ArrowDown') {
            if(selectMultiTextStart == true) {
              editor.setContentEditable(true)
              selectMultiTextStart == true
            }
            e.preventDefault();
            editor.nextBlock(false);
          }
        } else {
          if(e.key == 'ArrowUp') {
            // let ul = document.getElementById("popup" + editor.editor.id);
            // let li = ul.getElementsByClassName('focusedli')[0];
            // anchors = li.getElementsByTagName("a")
            e.preventDefault();
            // console.log("up")
            // console.log(li)
            // console.log(ul[])
          }
          if(e.key == 'ArrowDown') {
            e.preventDefault();
            // console.log("down")
          }
        }
        if(e.key == 'ArrowLeft') {
          if(selectMultiTextStart == true) {
            editor.setContentEditable(true)
            selectMultiTextStart == true
          }
        }
        if(e.key == 'ArrowRight') {
          if(selectMultiTextStart == true) {
            editor.setContentEditable(true)
            selectMultiTextStart == true
          }
        }
        if(e.key == "Tab") {
          e.preventDefault()
        }
        if(e.key == "s" && ctrlMod == true) {
          e.preventDefault()
          editor.getData()
        }
        if(e.key == "a" && ctrlMod == true) {
          numCtrlA++;
          if(numCtrlA > 1) {
            editor.setContentEditable(false)
            e.preventDefault();
            for (i in editor.blocks) {
              if(editor.blocks[i].deletable == true) {
                editor.blocks[i].thisBlock.classList.add("selectedBlock")
              }
            }
            ctrlASelect = true
            selectMultiTextStart = true
          }
          // editor.getData()
        } else {
          ctrlASelect = false
          numCtrlA = 0
        }
        if(e.key == "e" && ctrlMod == true) {
          console.log("export")
          let exportData = editor.allSaveData["versions"][editor.allSaveData["versions"].length - 1]
          let exportDataString = ""
          let title = "Untitled"
          for (let i = 0; i < exportData["blockData"].length; i++) {
            let block = exportData["blockData"][i]
            if(block.type == "title") {
              title = block.content
              continue
            }
            exportDataString += block.mdDet[0] + editor.htmlToMD(exportData["blockData"][i].contentHTML).replace("<br>", "") + block.mdDet[1] + "\n\n" 
          }
          console.log(exportDataString)
          editor.download(title+".md", exportDataString)
          
          e.preventDefault()
        }
        if(e.key == "z" && ctrlMod == true && editor.allSaveData != null) {
          e.preventDefault()
          console.log(editor.allSaveData["versions"])
          console.log(editor.allSaveData["versions"][editor.allSaveData["versions"].length - 1 - editor.ctrlZlevel])
          editor.ctrlZlevel++
          if (editor.ctrlZlevel > editor.allSaveData["versions"].length - 1) {	
            editor.ctrlZlevel = editor.allSaveData["versions"].length - 1
          }
          editor.changeVersion()
        }
        if(e.key == "y" && ctrlMod == true && editor.allSaveData != null) {
          e.preventDefault()
          console.log("t")
          console.log(editor.allSaveData["versions"])
          console.log(editor.allSaveData["versions"][editor.allSaveData["versions"].length - 1 - editor.ctrlZlevel])
          console.log(editor.ctrlZlevel)
          editor.ctrlZlevel--;
          if (editor.ctrlZlevel < 0) {
            editor.ctrlZlevel = 0
          }
          editor.changeVersion()
        }
        if(slashCommand != false) {
        }
        if(ctrlASelect == false) {
          for (i in editor.blocks) {
            if(editor.blocks[i].deletable == true) {
              editor.blocks[i].thisBlock.classList.remove("selectedBlock")
            }
          }
        }
      }
      if(e.key == "Backspace") {
        console.log(ctrlASelect, "ctrlASelect")
        if(ctrlASelect == true) {
          e.preventDefault();
          let blocks = Array.from(editor.editor.querySelectorAll(".selectedBlock"))
          console.log("block")
          blocks.forEach((block) => {
            console.log(block)
            editor.blocks[block.id].deleteBlock()
          })
        }
        numCtrlA = 0
        ctrlASelect = false
        // e.preventDefault()
        // console.log(window.getSelection())
      }
      if(e.key == "Escape" || ctrlMod == true || e.key.includes("Arrow")) {
        saveDataBool = false
      }
    }
    
  })

  document.addEventListener('mousedown', function(e) {
    if(ctrlASelect == true) {
      for (i in editor.blocks) {
        if(editor.blocks[i].deletable == true) {
          editor.blocks[i].thisBlock.classList.remove("selectedBlock")
        }
      }
      numCtrlA = 0
      ctrlASelect = false
    }
    if(e.target.matches(".dragButton") && editor.blocks[e.target.parentNode.id].typeObj.drag != false) {
      e.target.parentNode.setAttribute("draggable", "true")
    }
    if(e.target.matches('.blockEditor') == true) {
      editor.focusOnBlock(e.target.parentNode.id)
    }
    if(!e.target.matches(".toolBarTool")) {
      document.getElementById("toolbar"+editor.editor.id).style["display"] = "none"
    }
    if(editor.contentEditable == false) {
      editor.setContentEditable(true)
    }
  })

  document.addEventListener('dragend', function(e) {
    if(e.target.matches(".fullBlock")) {
      e.target.setAttribute("draggable", "false")
    }
  })

  document.addEventListener('input', function(e) {
    editor.currentBlock().typeObj.typeOnInputJS(e, editor)
  })

  // let multilineTest = null
  // multilineTest = window.setTimeout(() => {
  //   document.addEventListener('mousemove', function (e) {
  //     if(e.buttons == 1 && selectMultiTextStart == true && e.target != prevBlock) {
  //       console.log(prevBlock, e.target)
  //       selectMultiTextStart = true
  //     } else {
  //       selectMultiTextStart = false
  //       prevBlock = null
  //     }
  //   })
  //   multilineTest = null
  // }, 500);

  // document.addEventListener('mouseup',function(e) {
  //   if(editor.contentEditable == false) {
  //     editor.setContentEditable(true)
  //   }
  // })
  let selectionDelay = null, selection = '';
  document.addEventListener('selectionchange', (e) => {
    if(selectMultiTextStart == false) {
      const currentSelection = document.getSelection().toString();
      if (currentSelection != selection) {
        selection = currentSelection;
        if (selectionDelay) {
            window.clearTimeout(selectionDelay);
        }
        selectionDelay = window.setTimeout(() => {
          document.getElementById("toolbar"+editor.editor.id).style["display"] = "none"
          editor.toolBarDisplay()
          selectTextStart = false
          selection = '';
          selectionDelay = null;
        }, 500);
      }
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.target.matches(".blockEditor"+editor.editor.id) == true) {
      let wholeText = e.target.innerText;
      if(e.key == '/' && editor.currentBlock().typeObj.turnOnSlashCommand == true) {
        document.getElementById("popup"+editor.editor.id).style.display = "block";
        console.log("h")
        slashCommand = true;
        slashPos = editor.blocks[editor.currentId].getCaretPosition()[0];
      }
      if(slashCommand == true) {
        let currentPos = editor.blocks[editor.currentId].getCaretPosition()[0]
        if (currentPos < slashPos || escapeSearch == true || e.key == 'Escape' || (e.key == 'Backspace' &&(wholeText.length < slashPos + 1 || wholeText[slashPos - 1] != "/"))) {
          $("#popup"+editor.editor.id).css("display", "none")
          editor.currentBlock().updateContent(e.target.innerHTML, e.target.innerText)
          slashCommand = false
          escapeSearch = false
          noResults = false
          return;
        }

        let filter, ul, li, a, i, txtValue;
        ul = document.getElementById("popup" + editor.editor.id);
        li = ul.getElementsByTagName('li');

        if(e.key == "Enter") {
          let selectedOpt
          for (let i = 0; i < li.length; i++) {
            if(li[i].getElementsByTagName("a")[0].getAttribute('class') == "focuseda") {
              selectedOpt = li[i].getElementsByTagName("a")[0]
            }
          }
          let extra = "none"
          let newType = selectedOpt.getAttribute('type')
          if(selectedOpt.getAttribute('extra') != undefined) {
            extra = selectedOpt.getAttribute('extra')
          } 
          e.target.innerText = wholeText.substr(0,slashPos-1) + wholeText.substr(currentPos)
          editor.currentBlock().content = e.target.innerText
          $("#popup"+editor.editor.id).css("display", "none")
          let id = editor.blockIds[editor.currentIdIndex + 1]
          if(editor.blockIds[editor.currentIdIndex + 1] == undefined) {
            id = "end"
          }
          editor.createNewBlock(newType, id, extra)
          escapeSearch = true;
        }

        searchText = wholeText.substring(slashPos, currentPos).replace(/(\r\n|\n|\r)/gm, "");
        filter = searchText.toUpperCase()
          // Loop through all list items, and hide those who don't match the search query
        let popupIndices = [];
        for (i = 0; i < li.length; i++) {
          a = li[i].getElementsByTagName("a")[0];
          a.setAttribute('class', '');
          li[i].setAttribute('class', '');
          txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            popupIndices.push(i)
            li[i].style.display = "";
            noResults = true;
          } else {
            li[i].style.display = "none";
          }
        }
        
        // focuses the first option
        if(popupIndices.length > 0) {
          li[popupIndices[0]].getElementsByTagName("a")[0].setAttribute('class', 'focuseda');
          li[popupIndices[0]].setAttribute('class', 'focusedli');
        } else {
          if(noResults == false) {
            escapeSearch = true
          }
          noResults = false;
          // console.log("No results found");
        }
      }      
    }
    if(window.getSelection().toString() == "") {
      document.getElementById("toolbar"+editor.editor.id).style["display"] = "none"
    }
  })

  // let inputSlashCommand = slashCommand
  // document.addEventListener('keydown', function(e) {
  //   if(e.key == '/') {
  //     inputSlashCommand = true
  //   }
  // })

  document.addEventListener('input', function(e) {
    if(editor.editor.contains(e.target) && e.data != "/" && slashCommand == false) {
      editor.currentBlock().updateContent(e.target.innerHTML, e.target.innerText)
    }
    // inputSlashCommand = slashCommand
    // console.log(inputSlashCommand)
  })

  document.addEventListener('paste', function(e) {
    let clipboardData, pastedData;

		// Stop data actually being pasted into div
		e.stopPropagation();
    e.preventDefault();

		// Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text').split(/\r?\n/);
    if(pastedData.length > 1) {
      for(let i = 0; i < pastedData.length; i++) {
        editor.createNewBlock("text", "next", "none", {},{"content": pastedData[i]})
      }
    } else {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(pastedData[0]));
      selection.collapseToEnd();
    }
  });
}