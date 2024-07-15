class ToolBar {
  tool;
  open;
  close;
  mdPrefix;
  mdSuffix;
  constructor() {
    this.tool;
    this.open;
    this.close;
    this.mdPrefix;
    this.mdSuffix;
  }
  HtmlEncode(s) {
    let el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    el.remove()
    return s;
  }
  onClickJS (property) {
    document.execCommand(property)
    // selectedBlock.writeDiv.innerHTML = newHtml
  }
  isActive(editor, property, otag, ctag) {
    const selectedBlock = editor.currentBlock()
    const text = window.getSelection().toString()
    // const htmlEscapedText = this.HtmlEncode(text)
    const HTML = selectedBlock.writeDiv.innerHTML

    const patt = /<[^<>]+>/g;
    let match;
    let matches = []
    let matchesNoHTML = []
    let tagCharLens = 0
    while (match = patt.exec(HTML)) {
      matches.push([match.index,patt.lastIndex]);
      if(HTML.slice(match.index, patt.lastIndex) == otag ||HTML.slice(match.index, patt.lastIndex) == ctag) {
        matchesNoHTML.push(match.index - tagCharLens);
      }
      tagCharLens += (patt.lastIndex-match.index) -1
    }

    const position = selectedBlock.getCaretPosition()
    const posArray = Array.from({length:(position[1]-position[0])},(v,k)=>k+position[0])
    for (let i in posArray) {
      if(matchesNoHTML.includes(posArray[i])) {
        return true
      }
    }
    return false
  }
}

class Bold extends ToolBar{
  static type;
  static name;
  active;
  tool;
  editor;
  tool;
  open;
  close;
  mdPrefix;
  mdSuffix;
  constructor(editor, button) {
    super(); 
    this.open = "<b>"
    this.close = "</b>"
    this.mdPrefix = "**";
    this.mdSuffix = "**";
    this.type = "bold"
    this.name = "Bold"
    this.active = false
    this.editor = editor
    this.tool = button
  }
  onClickJS(editor) {
    super.onClickJS(this.type)
    this.isActive(editor)
  }
  isActive(editor) {
    this.active = super.isActive(editor, this.type, "<b>", "</b>")
    if(this.active == true) {
      this.tool.classList.remove("notactive")
      this.tool.classList.add("active")
    }
    if(this.active == false) {
      this.tool.classList.remove("active")
      this.tool.classList.add("notactive")
    }
  }
}
class Italic extends ToolBar{
  static type;
  static name;
  active;
  tool;
  editor;
  tool;
  open;
  close;
  mdPrefix;
  mdSuffix;
  constructor(editor, button) {
    super(); 
    this.open = "<i>"
    this.close = "</i>"
    this.mdPrefix = "_";
    this.mdSuffix = "_";
    this.type = "italic"
    this.name = "Italics"
    this.active = false
    this.editor = editor
    this.tool = button
  }
  onClickJS(editor) {
    super.onClickJS(this.type)
    this.isActive(editor)
  }
  isActive(editor) {
    this.active = super.isActive(editor, this.type, "<i>", "</i>")
    if(this.active == true) {
      this.tool.classList.remove("notactive")
      this.tool.classList.add("active")
    }
    if(this.active == false) {
      this.tool.classList.remove("active")
      this.tool.classList.add("notactive")
    }
  }
}

class Test extends ToolBar{
  static type;
  static name;
  active;
  tool;
  editor;
  tool;
  open;
  close;
  mdPrefix;
  mdSuffix;
  constructor(editor, button) {
    super(); 
    this.open = "<span style='color:red;'>"
    this.close = "</span>"
    this.mdPrefix = "";
    this.mdSuffix = "";
    this.type = "test"
    this.name = "Test"
    this.active = false
    this.editor = editor
    this.tool = button
  }
  onClickJS(editor) {
    const selectedBlock = editor.currentBlock()
    const selectionIndex = selectedBlock.getSelectionCharacterOffsetWithin(selectedBlock.writeDiv)
    let newContent = selectedBlock.writeDiv.innerText
    newContent = newContent.slice(0, selectionIndex.end) + this.close + newContent.slice(selectionIndex.end);
    newContent = newContent.slice(0, selectionIndex.start) + this.open + newContent.slice(selectionIndex.start);
    newContent = newContent.replace(/\n|\r/g,'')
    selectedBlock.writeDiv.innerHTML = newContent
    // selectedBlock.writeDiv.innerText += " "
    // selectedBlock.setCurrentCursorPosition(selectionIndex.end+1, selectedBlock.writeDiv)
    console.log(selectedBlock.writeDiv.childNodes[1].nextSibling)
  }
  isActive(editor) {
    this.active = super.isActive(editor, this.type, "<span style='color:red;'>", "</span>")
    if(this.active == true) {
      this.tool.classList.remove("notactive")
      this.tool.classList.add("active")
    }
    if(this.active == false) {
      this.tool.classList.remove("active")
      this.tool.classList.add("notactive")
    }
  }
}