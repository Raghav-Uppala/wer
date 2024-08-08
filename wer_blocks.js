class BlockClass {
  type;
  options;
  viewInPopup;
  mdPrefix;
  mdSuffix;
  constructor(type, options) {
    this.type = type
    this.options = options
    this.viewInPopup = true
    this.mdPrefix = ""
    this.mdSuffix = ""
  }
  typeStyle() {
  }
  typeOnLoadJS(block, editor){
  }
  typeOnInputJS(e, editor) {
  }
  typeOnkeyDownJS(e, editor) {
  } 
  typeOnFocusJS(e, editor) {
  }
  typeUpdateContent(editor, block) {
  }
  typeOnKeyDownConvert(e) {
  }
  afterLoadingSaved(block) {
  }
  onEditorLoad() {
  }
}


class Title extends BlockClass {
  static type;
  static turnOnSlashCommand
  static drag;
  mdPrefix;
  viewInPopup;
  typeName;
  newBlockOnEnter;
  deletable;
  delBlockOnBack;
  constructor(typeName, options) {
    super(typeName, options)
    this.type = "title"
    this.typeName = typeName
    this.mdPrefix = "# "
    if(options.hasOwnProperty("delBlockOnBack") != true) {
      this.delBlockOnBack = true
    } else {
      this.delBlockOnBack = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("newBlockOnEnter") != true) {
      this.newBlockOnEnter = true
    } else {
      this.newBlockOnEnter = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("deletable") != true) {
      this.deletable = false
    } else {
      this.deletable = options["deletable"]
    }
    if(options.hasOwnProperty("turnOnSlashCommand") != true) {
      this.turnOnSlashCommand = true
    } else {
      this.turnOnSlashCommand = options["turnOnSlashCommand"]
    }
    if(options.hasOwnProperty("viewInPopup") != true) {
      this.viewInPopup = false
    } else {
      this.viewInPopup = options["viewInPopup"]
    }
    if(options.hasOwnProperty("drag") != true) {
      this.drag = false
    } else {
      this.drag = options["drag"]
    }
  }
  typeStyle() {
  }
  typeOnLoadJS(block, editor){
  }
  typeOnInputJS(e, editor) {
  }
  typeOnkeyDownJS(e, editor) {
  } 
  typeOnFocusJS(e, editor) {
  }
  typeOnKeyDownConvert(e) {
  }
}
class Text extends BlockClass {
  static type;
  static turnOnSlashCommand
  static drag;
  typeName;
  newBlockOnEnter;
  deletable;
  delBlockOnBack;
  constructor(typeName, options) {
    super(typeName, options)
    this.type = "text"
    this.typeName = typeName
    if(options.hasOwnProperty("delBlockOnBack") != true) {
      this.delBlockOnBack = true
    } else {
      this.delBlockOnBack = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("newBlockOnEnter") != true) {
      this.newBlockOnEnter = true
    } else {
      this.newBlockOnEnter = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("deletable") != true) {
      this.deletable = true
    } else {
      this.deletable = options["deletable"]
    }
    if(options.hasOwnProperty("turnOnSlashCommand") != true) {
      this.turnOnSlashCommand = true
    } else {
      this.turnOnSlashCommand = options["turnOnSlashCommand"]
    }
    if(options.hasOwnProperty("drag") != true) {
      this.drag = true
    } else {
      this.drag = options["drag"]
    }
  }
  typeStyle(block,editor, extra) {
    block.writeDiv.setAttribute('placeholder', this.typeName);
  }
  typeOnLoadJS(block, editor){
  }
  typeOnInputJS(e, editor) {

  }
  typeOnkeyDownJS(e, editor) {
  }
  typeOnFocusJS(e, editor) {
  }
}
class Heading extends BlockClass {
  static type;
  static turnOnSlashCommand
  static extra;
  static drag;
  typeName;
  newBlockOnEnter;
  deletable;
  delBlockOnBack
  constructor(typeName, options) {
    super(typeName, options)
    this.type = "heading"
    this.extra = {"heading 1": "Head1", "heading 2": "Head2"}
    this.typeName = typeName
    if(options.hasOwnProperty("delBlockOnBack") != true) {
      this.delBlockOnBack = true
    } else {
      this.delBlockOnBack = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("newBlockOnEnter") != true) {
      this.newBlockOnEnter = true
    } else {
      this.newBlockOnEnter = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("deletable") != true) {
      this.deletable = true
    } else {
      this.deletable = options["deletable"]
    }
    if(options.hasOwnProperty("turnOnSlashCommand") != true) {
      this.turnOnSlashCommand = true
    } else {
      this.turnOnSlashCommand = options["turnOnSlashCommand"]
    }
    if(options.hasOwnProperty("drag") != true) {
      this.drag = true
    } else {
      this.drag = options["drag"]
    }
  }
  typeStyle(editor, extra) {
  }
  typeOnLoadJS(block, editor){
    block.writeDiv.setAttribute('placeholder', this.typeName);
  }
  typeOnInputJS(e, editor) {
  }
  typeOnkeyDownJS(e, editor) {
  }
  typeOnFocusJS(e, editor) {

  }
}
class List extends BlockClass {
  static type;
  static turnOnSlashCommand
  static drag;
  typeName;
  newBlockOnEnter;
  deletable;
  tabIndent;
  tabIndentUnit;
  tabLevel;
  delBlockOnBack;
  originalStyle;
  constructor(typeName, options) {
    super(typeName, options)
    this.type = "list"
    this.typeName = typeName
    this.originalStyle = {}
    if(options.hasOwnProperty("delBlockOnBack") != true) {
      this.delBlockOnBack = false
    } else {
      this.delBlockOnBack = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("newBlockOnEnter") != true) {
      this.newBlockOnEnter = false
    } else {
      this.newBlockOnEnter = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("deletable") != true) {
      this.deletable = true
    } else {
      this.deletable = options["deletable"]
    }
    if(options.hasOwnProperty("turnOnSlashCommand") != true) {
      this.turnOnSlashCommand = true
    } else {
      this.turnOnSlashCommand = options["turnOnSlashCommand"]
    }
    if(options.hasOwnProperty("tabIndent") != true) {
      this.tabIndent = 0.5
    } else {
      this.tabIndent = options["tabIndent"]
    }
    if(options.hasOwnProperty("tabIndentUnit") != true) {
      this.tabIndentUnit = "rem"
    } else {
      this.tabIndentUnit = options["tabIndentUnit"]
    }
    if(options.hasOwnProperty("tabLevel") != true) {
      this.tabLevel = 1
    } else {
      this.tabLevel = options["tabLevel"]
    }
    if(options.hasOwnProperty("drag") != true) {
      this.drag = true
    } else {
      this.drag = options["drag"]
    }
  }
  typeStyle(block, editor, extra) {
    block.writeDiv.setAttribute('placeholder', this.typeName);
    block.writeDiv.classList.add("listBlock")
    
    this.originalStyle["width"] = block.writeDiv.style.getPropertyValue("width") 
    this.originalStyle["margin-left"] = block.writeDiv.style.getPropertyValue("margin-left") 
    this.originalStyle["display"] = block.writeDiv.style.getPropertyValue("display") 
    this.originalStyle["list-style-type"] = block.writeDiv.style.getPropertyValue("list-style-type") 
    

    block.writeDiv.style.setProperty("display", "list-item")
    console.log(this.tabLevel)
    block.writeDiv.style.setProperty("list-style-type", ["disc", "circle", "square"][((this.tabLevel-1) % 3)])
    block.writeDiv.style.setProperty("width", "calc("+block.writeDiv.style.getPropertyValue("width")+"-"+(this.tabLevel * this.tabIndent) + this.tabIndentUnit+")")
    block.thisBlock.style.setProperty("margin-left", (this.tabLevel * this.tabIndent) + this.tabIndentUnit)
    // block.writeDiv.style.setProperty("display", "list-item")
  }
  typeRemoveStyle(block, editor, extra) {
    block.writeDiv.classList.remove("listBlock")
    block.writeDiv.style.setProperty("width", this.originalStyle["width"])
    block.thisBlock.style.setProperty("margin-left", this.originalStyle["margin-left"])
    block.writeDiv.style.setProperty("list-style-type", this.originalStyle["list-style-type"])
    block.writeDiv.style.setProperty("display", this.originalStyle["display"])
  }
  typeOnLoadJS(block, editor){
  }
  typeOnInputJS(e, editor) {

  }
  typeOnkeyDownJS(e, editor, shiftMod, block, slashCommand) {
    if(e.key == "Enter" && slashCommand == false) {
      e.preventDefault();
      block.newBlockOnEnter = false
      editor.createNewBlock(this.typeName, undefined, undefined, {"tabLevel": this.tabLevel, "tabIndent": this.tabIndent, "tabIndentUnit": this.tabIndentUnit})
    }
    if(e.key == "Tab") {
      e.preventDefault();
      console.log(["disc", "circle", "square"][(this.tabLevel % 3)], (this.tabLevel % 3))
      if(shiftMod == true) {
        if(((this.tabLevel * this.tabIndent - this.tabIndent) > 0)) {
          this.tabLevel--;
          block.thisBlock.style["margin-left"] = (this.tabLevel * this.tabIndent) + this.tabIndentUnit
          block.writeDiv.style.setProperty("list-style-type", ["disc", "circle", "square"][((this.tabLevel-1) % 3)])
        }
      } else {
        if(window.getComputedStyle(block.writeDiv).getPropertyValue("width").match(/\d+/g).map(Number)[0] > 300) {
          block.writeDiv.style.setProperty("width", "calc("+block.writeDiv.style.getPropertyValue("width")+"-"+(this.tabLevel * this.tabIndent) + this.tabIndentUnit+")")
          this.tabLevel++;
          block.thisBlock.style["margin-left"] = (this.tabLevel * this.tabIndent) + this.tabIndentUnit
          block.writeDiv.style.setProperty("list-style-type", ["disc", "circle", "square"][((this.tabLevel-1) % 3)])
        }
      }
    }
  }
  typeOnFocusJS(e, editor) {
  }
  typeOnKeyDownConvert(e, block) {
    if(e.key == "Backspace") {
      if(block.writeDiv.innerText == "" || block.writeDiv.innerText == "\n") {
        editor.convertBlock("text", editor.currentBlock())
      }
    }
  }
}


//fix:
  //click off error
class MathTex extends BlockClass {
  static type;
  static turnOnSlashCommand
  static extra;
  static drag;
  typeName;
  newBlockOnEnter;
  deletable;
  delBlockOnBack;
  constructor(typeName, options) {
    super(typeName, options)
    this.type = "math"
    this.typeName = typeName
    if(options.hasOwnProperty("delBlockOnBack") != true) {
      this.delBlockOnBack = true
    } else {
      this.delBlockOnBack = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("newBlockOnEnter") != true) {
      this.newBlockOnEnter = true
    } else {
      this.newBlockOnEnter = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("deletable") != true) {
      this.deletable = true
    } else {
      this.deletable = options["deletable"]
    }
    if(options.hasOwnProperty("turnOnSlashCommand") != true) {
      this.turnOnSlashCommand = true
    } else {
      this.turnOnSlashCommand = options["turnOnSlashCommand"]
    }
    if(options.hasOwnProperty("drag") != true) {
      this.drag = true
    } else {
      this.drag = options["drag"]
    }
  }
  typeStyle(block, editor, extra) {
    block.thisBlock.classList.add("Math")
  }
  typeOnLoadJS(block, editor){
    let mathInput = document.createElement("div")
    mathInput.innerText = ""
    mathInput.setAttribute("contenteditable", "true")
    // mathInput.setAttribute("id", "MathInput"+editor.id)
    mathInput.className = "MathInput"
    // $(mathInput).css("order", "2")
    // $(block).css("flex-flow", "flex-wrap")
    $(block.thisBlock).css("flex-flow", "row-wrap")
    $(block.writeDiv).css("flex", "1")
    $(mathInput).css("width", block.writeDiv.clientWidth/2)
    mathInput.popover = "auto"
    mathInput.style.margin = "0px"
    // $(mathInput).css("margin", "auto")
    // $(mathInput).css("position", "relative")
    // $(mathInput).css("display", "none")
    mathInput.hidePopover()
    mathInput.innerText = block.content
    block.writeDiv.innerHTML = ""
    block.content = ""
    block.thisBlock.appendChild(mathInput)
  }
  typeOnInputJS(e,editor){
    if(e.target.matches(".MathInput")) {
      let equation = editor.currentBlock().thisBlock.querySelector(".MathInput").innerText
      let html = katex.renderToString(equation, {
        throwOnError: false
      });
      let target = editor.currentBlock().writeDiv;
      target.innerHTML = html;
      editor.currentBlock().content = equation
    }
  }
  typeOnClickJS(e,editor){
    let thisBlock = editor.currentBlock().thisBlock
    let writeDiv = editor.currentBlock().writeDiv
    let mathInput = thisBlock.querySelector(".MathInput")
    const rect = editor.currentBlock().writeDiv.getBoundingClientRect();
    mathInput.style.top = `${rect.bottom+10}px`
    mathInput.style.left = `${rect.left+(writeDiv.clientWidth/4)}px` //center it
    mathInput.showPopover()
    setTimeout(() => {
      mathInput.focus();
      writeDiv.innerHTML = this.renderKatex(mathInput.innerText)
      editor.currentBlock().content = mathInput.innerText
      editor.currentBlock().setCaret('end', mathInput);
    }, 0);
  }
  typeOnkeyDownJS(e,editor, shiftMod) {
    if(e.target.matches(".MathInput")) {
      if(e.key == "Enter") {
        if(shiftMod == true) {
          this.typeOnFocusJS(e, editor)
        }
        if(shiftMod != true) {
          e.preventDefault()
          let mathInput = editor.currentBlock().thisBlock.querySelector(".MathInput")
          mathInput.hidePopover()
          editor.nextBlock(true)
        }
      }
      if(e.key == "ArrowUp") {
        let mathInput = editor.currentBlock().thisBlock.querySelector(".MathInput")
        mathInput.hidePopover()
        editor.prevBlock()
      }
      if(e.key == "ArrowDown") {
        let mathInput = editor.currentBlock().thisBlock.querySelector(".MathInput")
        mathInput.hidePopover()
        editor.nextBlock()
      }
      if(e.key == "Escape") {
        e.preventDefault()
        // let mathInput = editor.currentBlock().thisBlock.querySelector(".MathInput")
        // mathInput.hidePopover()
        // editor.nextBlock()
      }
      if(e.key == "Backspace" &&(e.target.innerText == "\n" || e.target.innerText == "")) {
        e.preventDefault()
        editor.deleteBlock(editor.currentBlock().id)
      }
    }
  }
  typeOnFocusJS(block, editor, e) {
    if(e.toString() == "[object MouseEvent]") {
      return none
    }
    let thisBlock = editor.currentBlock().thisBlock
    let writeDiv = editor.currentBlock().writeDiv
    let mathInput = thisBlock.querySelector(".MathInput")
    const rect = editor.currentBlock().writeDiv.getBoundingClientRect();
    mathInput.style.top = `${rect.bottom+10}px`
    mathInput.style.left = `${rect.left+(writeDiv.clientWidth/4)}px` //center it
    mathInput.showPopover()
    setTimeout(() => {
      mathInput.focus();
      writeDiv.innerHTML = this.renderKatex(mathInput.innerText)
      editor.currentBlock().content = mathInput.innerText
      editor.currentBlock().setCaret('end', mathInput);
    }, 0);
  }
  onEditorLoad(editor) {
    let katexScript = document.createElement("script")
    document.getElementsByTagName("head")[0].appendChild(katexScript)
    katexScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js")
    // katexScript.setAttribute()
    katexScript.setAttribute("integrity", "sha384-hIoBPJpTUs74ddyc4bFZSM1TVlQDA60VBbJS0oA934VSz82sBx1X7kSx2ATBDIyd")
    katexScript.setAttribute("crossorigin", "anonymous")
    katexScript.onload = () => {
      for (let i in editor.blocks) {
        if(editor.blocks[i].type == this.type) {
          let block = editor.blocks[i]
          let writeDiv = block.writeDiv
          let mathInput = block.thisBlock.querySelector(".MathInput")
          writeDiv.innerHTML = this.renderKatex(mathInput.innerText)
        }
      }
    }
  }
  renderKatex(eq) {
    return katex.renderToString(eq, {
        throwOnError: false
      });
  }
  afterSaveDataLoad() {
  }
}


class Table extends BlockClass {
  static type;
  static turnOnSlashCommand
  static drag;
  typeName;
  newBlockOnEnter;
  deletable;
  delBlockOnBack;
  constructor(typeName, options) {
    super(typeName, options)
    this.type = "Table"
    this.typeName = typeName
    if(options.hasOwnProperty("delBlockOnBack") != true) {
      this.delBlockOnBack = true
    } else {
      this.delBlockOnBack = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("newBlockOnEnter") != true) {
      this.newBlockOnEnter = true
    } else {
      this.newBlockOnEnter = options["newBlockOnEnter"]
    }
    if(options.hasOwnProperty("deletable") != true) {
      this.deletable = true
    } else {
      this.deletable = options["deletable"]
    }
    if(options.hasOwnProperty("turnOnSlashCommand") != true) {
      this.turnOnSlashCommand = true
    } else {
      this.turnOnSlashCommand = options["turnOnSlashCommand"]
    }
    if(options.hasOwnProperty("drag") != true) {
      this.drag = true
    } else {
      this.drag = options["drag"]
    }
  }
  typeStyle(block,editor, extra) {
    block.writeDiv.setAttribute('placeholder', this.typeName);
  }
  typeOnLoadJS(block, editor){
    block.writeDiv.setAttribute("contenteditable", "false")
    
  }
  typeOnInputJS(e, editor) {
  }
  typeOnkeyDownJS(e, editor) {
  }
  typeOnFocusJS(e, editor) {
  }
}