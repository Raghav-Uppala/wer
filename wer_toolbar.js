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
  // onClickJS (property) {
  //   document.execCommand(property)
  // }
  onClickJS (innerText, innerHTML, selectedBlock, otag, ctag) {
    
    const selectionIndex = selectedBlock.getSelectionCharacterOffsetWithin(selectedBlock.writeDiv)

    const HTMLIndexStart = this.textIndexToHTMLIndex(innerText, innerHTML, selectionIndex.start)
    const HTMLIndexEnd = this.textIndexToHTMLIndex(innerText, innerHTML, selectionIndex.end - 1)

    const HTMLSelectionArr = [innerHTML.slice(0,HTMLIndexStart), innerHTML.slice(HTMLIndexStart, HTMLIndexEnd+1), innerHTML.slice(HTMLIndexEnd+1, innerHTML.length)]
    const HTMLSelectionTagsArr = [this.countTag(HTMLSelectionArr[0], otag, ctag), this.countTag(HTMLSelectionArr[1], otag, ctag), this.countTag(HTMLSelectionArr[2], otag, ctag)]
    

    // tests if the tags suround the selected text
    //add HTMLSelectionArr[0] == ""
    // if((HTMLSelectionTagsArr[0].open[0] > HTMLSelectionTagsArr[0].close[0] || ()) && (HTMLSelectionTagsArr[1].open[0] == HTMLSelectionTagsArr[1].close[0]) && (HTMLSelectionTagsArr[2].open[0] < HTMLSelectionTagsArr[2].close[0])) {
    //   console.log("do nothing")
    // }
    
    let newHTML = innerHTML

    // Surrounding
    if(HTMLSelectionTagsArr[0].open[0] - HTMLSelectionTagsArr[0].close[0] > 0  && HTMLSelectionTagsArr[1].open[0] - HTMLSelectionTagsArr[1].close[0] == 0 && HTMLSelectionTagsArr[2].open[0] - HTMLSelectionTagsArr[2].close[0] < 0) {
      console.log("g")
      if(HTMLSelectionTagsArr[0].open[1].at(-1)[1] == (HTMLSelectionArr[0].length - 1)) {
        newHTML = this.removeStr(HTMLSelectionArr[0], HTMLSelectionTagsArr[0].open[1].at(-1)[0], HTMLSelectionTagsArr[0].open[1].at(-1)[1])
      } else if(HTMLSelectionTagsArr[1].open[1].length == 0) {
        newHTML = HTMLSelectionArr[0] + ctag
      } else {
        newHTML = HTMLSelectionArr[0]
      }
      
      if(HTMLSelectionTagsArr[1].open[1].length > 0) {
        let tempSelectStr = this.removeMultipleStr(HTMLSelectionArr[1], [...HTMLSelectionTagsArr[1].open[1], ...HTMLSelectionTagsArr[1].close[1]])
        newHTML += otag + tempSelectStr + ctag
      } else {
        newHTML += HTMLSelectionArr[1]
      }
      if (HTMLSelectionTagsArr[2].close[1][0][0] == 0) {
        newHTML += this.removeStr(HTMLSelectionArr[2], HTMLSelectionTagsArr[2].close[1][0][0], HTMLSelectionTagsArr[2].close[1][0][1])
      } else if(HTMLSelectionTagsArr[1].open[1].length == 0) {
        newHTML += otag + HTMLSelectionArr[2]
      } else {
        newHTML += HTMLSelectionArr[2]
      }
    }

    //open on left close in selection
    else if(HTMLSelectionTagsArr[0].open[0] - HTMLSelectionTagsArr[0].close[0] > 0 && HTMLSelectionTagsArr[1].open[0] - HTMLSelectionTagsArr[1].close[0] < 0 && HTMLSelectionTagsArr[2].open[0] - HTMLSelectionTagsArr[2].close[0] == 0) {
      console.log("open on left close in selection")
      newHTML = HTMLSelectionArr[0]
      
      if(HTMLSelectionTagsArr[1].open[1].length > 0) {
        let tempSelectStr = this.removeMultipleStr(HTMLSelectionArr[1], [...HTMLSelectionTagsArr[1].open[1], ...HTMLSelectionTagsArr[1].close[1]])
        newHTML += tempSelectStr + ctag
      } else {
        newHTML += this.removeStr(HTMLSelectionArr[1], HTMLSelectionTagsArr[1].close[1][0][0], HTMLSelectionTagsArr[1].close[1][0][1]) + ctag
      }
      newHTML += HTMLSelectionArr[2]
    }

    //open in selection close in right
    else if(HTMLSelectionTagsArr[0].open[0] - HTMLSelectionTagsArr[0].close[0] == 0 && HTMLSelectionTagsArr[1].open[0] - HTMLSelectionTagsArr[1].close[0] > 0 && HTMLSelectionTagsArr[2].open[0] - HTMLSelectionTagsArr[2].close[0] < 0) {
      console.log("open in selection close in right")
      newHTML = HTMLSelectionArr[0] + otag 
      newHTML += this.removeMultipleStr(HTMLSelectionArr[1], [...HTMLSelectionTagsArr[1].open[1], ...HTMLSelectionTagsArr[1].close[1]]) 
      newHTML += HTMLSelectionArr[2]
    }

    //all in (to fix to work w multiple tags in selection)
    else if(HTMLSelectionTagsArr[0].open[0] - HTMLSelectionTagsArr[0].close[0] == 0 && HTMLSelectionTagsArr[1].open[0] > 0 && HTMLSelectionTagsArr[1].close[0] > 0 && HTMLSelectionTagsArr[1].open[0] - HTMLSelectionTagsArr[1].close[0] == 0 && HTMLSelectionTagsArr[2].open[0] - HTMLSelectionTagsArr[2].close[0] == 0) {
      console.log("h")
      newHTML = HTMLSelectionArr[0] + otag 
      newHTML += this.removeMultipleStr(HTMLSelectionArr[1], [...HTMLSelectionTagsArr[1].open[1], ...HTMLSelectionTagsArr[1].close[1]]) 
      newHTML += ctag + HTMLSelectionArr[2]
    }

    //no open/closed tags across sections
    else if(HTMLSelectionTagsArr[0].open[0] - HTMLSelectionTagsArr[0].close[0] == 0 && HTMLSelectionTagsArr[1].open[0] == 0 && HTMLSelectionTagsArr[1].close[0] == 0  && HTMLSelectionTagsArr[2].open[0] - HTMLSelectionTagsArr[2].close[0] == 0){
      console.log("s")
      if ((HTMLSelectionTagsArr[0].close[1].at(-1)||[])[1] != undefined && HTMLSelectionTagsArr[0].close[1].at(-1)[1] == HTMLSelectionArr[0].length - 1) {
        newHTML = this.removeStr(HTMLSelectionArr[0], HTMLSelectionTagsArr[0].close[1].at(-1)[0], HTMLSelectionTagsArr[0].close[1].at(-1)[1])
      } else {
        newHTML = HTMLSelectionArr[0] + otag 
      }
      newHTML += HTMLSelectionArr[1]
      // if(HTMLSelectionTagsArr[2].open[1][0][0] == undefined) {
      //   newHTML += ctag + HTMLSelectionArr[2]
      // } else {
      if ((HTMLSelectionTagsArr[2].open[1][0]||[])[0] != undefined && HTMLSelectionTagsArr[2].open[1][0][0] == 0) {
        newHTML += this.removeStr(HTMLSelectionArr[2], HTMLSelectionTagsArr[2].open[1][0][0], HTMLSelectionTagsArr[2].open[1][0][1])
      } else {
        newHTML += ctag + HTMLSelectionArr[2]
      }
    }
    console.log(newHTML)
    return newHTML    
    
  }
  isActive(editor, property, otag, ctag, selectionIndex = false) {
    const selectedBlock = editor.currentBlock()
    // const text = window.getSelection().toString()
    // const htmlEscapedText = this.HtmlEncode(text)
    const innerHTML = selectedBlock.writeDiv.innerHTML
    const innerText = selectedBlock.writeDiv.innerText

    // const patt = new RegExp(/<[^<>]+>/,"g");
    // let match;
    // let matches = []
    // let matchesNoHTML = []
    // let tagCharLens = 0
    // while (match = patt.exec(HTML)) {
    //   matches.push([match.index,patt.lastIndex]);
    //   if(HTML.slice(match.index, patt.lastIndex) == otag ||HTML.slice(match.index, patt.lastIndex) == ctag) {
    //     matchesNoHTML.push(match.index - tagCharLens);
    //   }
    //   tagCharLens += (patt.lastIndex-match.index) -1
    // }

    // // console.log(matchesNoHTML, tagCharLens, "h")

    // const position = selectedBlock.getCaretPosition()
    // const posArray = Array.from({length:(position[1]-position[0])},(v,k)=>k+position[0])
    // for (let i in posArray) {
    //   if(matchesNoHTML.includes(posArray[i])) {
    //     return true
    //   }
    // }
    // return false

    let matches = this.getTags(innerHTML)
    
    if (selectionIndex == false) {
      selectionIndex = selectedBlock.getSelectionCharacterOffsetWithin(selectedBlock.writeDiv)
    }
    
    const HTMLIndexStart = this.textIndexToHTMLIndex(innerText, innerHTML, selectionIndex.start)
    // const HTMLIndexEnd = this.textIndexToHTMLIndex(innerText, innerHTML, selectionIndex.end - 1)

    let count = {"open":0, "close":0}
    for (let i in matches)	{ 
      if(matches[i][0] < HTMLIndexStart) {
        if(matches[i][2] == otag) {
          count["open"] += 1
        }
        if(matches[i][2] == ctag) {
          count["close"] += 1
        }
      }
      else {
        if(count.open > count.close) {
          return true
        }
      }
    }
    return false

  }
  textIndexToHTMLIndex(text, html, index) {
    let matches = this.getTags(html)
    let cummdif = 0
    for (let i in matches)	{
      if((matches[i][0] - cummdif) <= index) {
        cummdif += (matches[i][1] - matches[i][0])  + 1
      }
    }
    return index + cummdif
  }
  countTag(string, otag, ctag) {
    const tags = this.getTags(string)
    let count = {"open":[0,[]], "close":[0, []]}
    for (let i = 0; i < tags.length; i++) {
      if(tags[i][2] == otag) {
        count.open[0] += 1
        count.open[1].push([tags[i][0],tags[i][1]])
      }
      if(tags[i][2] == ctag) {
        count.close[0] += 1
        count.close[1].push([tags[i][0],tags[i][1]])
      }
    }
    return count
  }
  getTags(string) {
    const patt = /<[^<>]+>/g
    let matches = []
    let match;
    while ((match = patt.exec(string)) != null) {
      matches.push([match.index, patt.lastIndex-1, match[0]])
    }
    return matches
  }
  // returns a new string after removing the char from the start to end of old str
  removeStr(string,start,end) {
    return string.slice(0,start) + string.slice(end + 1)
  }
  removeMultipleStr(string,IndexPairs) {
    let sortedIndex = IndexPairs.sort((a, b) => a[0] - b[0]);
    let reversed = sortedIndex.reverse()
    let newstring = string
    for (let i in reversed){
      newstring = this.removeStr(newstring, reversed[i][0], reversed[i][1])
    }
    return newstring
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
    this.otag = "<b>"
    this.ctag = "</b>"
    this.mdPrefix = "**";
    this.mdSuffix = "**";
    this.type = "bold"
    this.name = "Bold"
    this.active = false
    this.editor = editor
    this.tool = button
  }
  onClickJS(editor) {
    const selectedBlock = editor.currentBlock()
    let innerText = selectedBlock.writeDiv.innerText
    let innerHTML = selectedBlock.writeDiv.innerHTML
    
    let newHTML = super.onClickJS(innerText, innerHTML, selectedBlock, this.otag, this.ctag)
    selectedBlock.writeDiv.innerHTML = newHTML
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
    this.otag = "<i>"
    this.ctag = "</i>"
    this.mdPrefix = "_";
    this.mdSuffix = "_";
    this.type = "italic"
    this.name = "Italics"
    this.active = false
    this.editor = editor
    this.tool = button
  }
  onClickJS(editor) {
    const selectedBlock = editor.currentBlock()
    let innerText = selectedBlock.writeDiv.innerText
    let innerHTML = selectedBlock.writeDiv.innerHTML
    
    let newHTML = super.onClickJS(innerText, innerHTML, selectedBlock, this.otag, this.ctag)
    selectedBlock.writeDiv.innerHTML = newHTML
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


// Use popover api on the anchor tag to display the link info.
// the algo to add the anchor tag should be abstracted to its own function in ToolBar
// that algo should work based off of similar principals as the isActive algo
// checks for html tags before selection starts and in selection, then adds that as off set to the start and end index.
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
    this.otag = "<a style=\"color:red;\">"
    this.ctag = "</a>"
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
    let innerText = selectedBlock.writeDiv.innerText
    let innerHTML = selectedBlock.writeDiv.innerHTML
    
    let newHTML = super.onClickJS(innerText, innerHTML, selectedBlock, this.otag, this.ctag)
    selectedBlock.writeDiv.innerHTML = newHTML
    // const HTMLIndexStart = super.textIndexToHTMLIndex(innerText, innerHTML, selectionIndex.start)
    // const HTMLIndexEnd = super.textIndexToHTMLIndex(innerText, innerHTML, selectionIndex.end - 1)

    // const tagsInSelection = super.getTags(innerHTML.slice(HTMLIndexStart, HTMLIndexEnd+1))

    // if(super.isActive(editor, "", this.otag, this.ctag, selectionIndex) == false) {
    //   let newHTML = innerHTML.slice(0, HTMLIndexStart) + this.otag + innerHTML.slice(HTMLIndexStart, HTMLIndexEnd+1) + this.ctag + innerHTML.slice(HTMLIndexEnd+1)
    //   selectedBlock.writeDiv.innerHTML = newHTML
    //   console.log(newHTML)
    // }
    

    // // console.log(super.isActive(editor, "", this.open, this.close, selectionIndex), newHTML, innerText)

  }
  isActive(editor) {
    this.active = super.isActive(editor, this.type, this.otag, this.ctag)
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