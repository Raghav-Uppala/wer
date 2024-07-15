$('div').first().focus();

$('div').on("selectstart", function() {
    $('div').attr("contenteditable", false);
});
$('div').on("click", function() {
    $('div').attr("contenteditable", "true");
});

let blockIds = []
let currentId;
let currentIdIndex = 0;

let slashCommand = false
let oldText = ""
let searchText = ""

let noResults = false;
let escapeSearch = false;
let shiftMod = false
let selectedBlocks = false //set to true when either clicking a block or after mouseup event after selection box 

document.addEventListener('keydown', function(e) {if (e.key == 'Shift') {shiftMod = true}});
document.addEventListener('keyup', function(e) {if (e.key == 'Shift') {shiftMod = false}});

let ctrlMod = false
document.addEventListener('keydown', function(e) {if (e.key == 'Control') {ctrlMod = true}});
document.addEventListener('keyup', function(e) {if (e.key == 'Control') {ctrlMod = false}});


function addOnlyClass(className, id) {
  document.getElementById(id).childNodes[1].setAttribute('class', 'block')
  document.getElementById(id).childNodes[1].classList.add(className)
}

function nextBlock(create=true) {
  if(create == false && currentIdIndex == (blockIds.length - 1)) {
    return;
  }
  if(create == true && currentIdIndex == (blockIds.length - 1)) {
    createBlock()
  }
  currentIdIndex++;
  document.getElementById(blockIds[currentIdIndex]).childNodes[1].focus()
}
function prevBlock() {
  if(currentIdIndex == 0) {
    return;
  }
  currentIdIndex--;
  let previousBlock = document.getElementById(blockIds[currentIdIndex]).childNodes[1]
  previousBlock.focus()
  setCaret('end', previousBlock)
}
function setCaret(char, el) {
    let range = document.createRange()
    let sel = window.getSelection()
    if(char == 'end') {
      char = el.childNodes[0].data.length
    }
    range.setStart(el.childNodes[0], char)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
}

function createBlock() {
  let newBlock = document.createElement('div');
  newBlock.className = 'fullBlock';
  newBlock.id = Math.floor(Math.random() * 1000000)
  newBlock.setAttribute('ondrop', "drop(event)")
  newBlock.setAttribute('ondragover', "allowDrop(event)")
  newBlock.setAttribute('ondragstart', "drag(event)")
  newBlock.setAttribute('draggable', "false")

  let dragButton = document.createElement('div')
  dragButton.className = "dragButton";
  dragButton.innerHTML = "&#10303;"
  newBlock.appendChild(dragButton)

  // let containerDiv = document.createElement('div')

  // let dropDiv = document.createElement('div')
  // dropDiv.className = "dropDiv"
  // containerDiv.appendChild(dropDiv)
  
  let blockEditor = document.createElement('div');
  blockEditor.className = "block"
  blockEditor.setAttribute('contenteditable', 'true');
  blockEditor.setAttribute('ondragenter',"event.preventDefault(); event.dataTransfer.dropEffect = 'none';")
  blockEditor.setAttribute('ondragover',"event.preventDefault(); event.dataTransfer.dropEffect = 'none';")
  blockEditor.innerHTML = newBlock.id

  newBlock.appendChild(blockEditor)

  // newBlock.appendChild(containerDiv)

  blockIds.push(newBlock.id)
  document.getElementById('editor').appendChild(newBlock);
}

function deleteBlock() {
  if(blockIds.length == 1) {
    return
  }
  document.getElementById(blockIds[currentIdIndex]).remove()
  blockIds.splice(currentIdIndex, 1)
  prevBlock()
}

function allowDrop(ev) {
  ev.preventDefault();
}

function node_walk(node, func) {
  var result = func(node);
  for(node = node.firstChild; result !== false && node; node = node.nextSibling)
    result = node_walk(node, func);
  return result;
}

function getCaretPosition(elem) {
  var sel = window.getSelection();
  var cum_length = [0, 0];
  if(sel.anchorNode == elem)
    cum_length = [sel.anchorOffset, sel.focusNode];
  else {
    var nodes_to_find = [sel.anchorNode, sel.focusNode];
    if(!elem.contains(sel.anchorNode) || !elem.contains(sel.focusNode))
      return undefined;
    else {
      var found = [0,0];
      var i;
      node_walk(elem, function(node) {
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
  if(cum_length[0] <= cum_length[1])
    return cum_length;
  return [cum_length[1], cum_length[0]];
}

function toolBar(property,id) {
  let editingBlock = document.getElementById(blockIds[currentIdIndex]).childNodes[1]
  let text = editingBlock.innerText
  let element = document.getElementById(id)
  let selectedText = window.getSelection().toString()
  let start, end;
  [start, end] = getCaretPosition(editingBlock); 

  console.log(editingBlock.innerHTML)
  // if(property == "bold") {
    
  // }
  // let newHtml = text.slice(0, start) + "<span style='"+cssRule+"'>" + selectedText + "</span>" + text.slice(end, text.length)
  // editingBlock.innerHTML = newHtml
  
  // document.execCommand(property);
  // let el = document.getElementById(id)
  // let boldOrNot = el.style.getPropertyValue('font-weight');
  // console.log(boldOrNot)
  // if(boldOrNot === 'bold') {
  //   el.style.setProperty('font-weight', 'normal');
  // }
  // if(boldOrNot === 'normal' || boldOrNot == "") {
  //   el.style.setProperty('font-weight', 'bold');
  // }
}

function getSelected() {
  if(window.getSelection().toString()){
    let position = getCaretGlobalPosition()
    let toolbar = document.getElementById("toolbar")
    let blockEdit = document.getElementById(blockIds[currentIdIndex]).childNodes[1]
    if(position == undefined) {
      position = blockEdit.getBoundingClientRect();
      position = {left: position.left, top: position.top+blockEdit.clientHeight}
    }
    if(position !== undefined) {
      toolbar.style["display"] = "flex"
      toolbar.style.setProperty('left', Math.floor(position["left"]) + "px")
      toolbar.style.setProperty('top', Math.floor(position["top"]) + "px")
    } else {
      return;
    }
  }
}

function getCaretGlobalPosition(){
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

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  // ev.target.childNodes[5].style["display"] = "none"
  console.log(document.getElementById(data))
	document.getElementById("editor").insertBefore(document.getElementById(data), ev.target);
  blockIds.splice(blockIds.indexOf(data), 1)
  blockIds.splice(blockIds.indexOf(ev.target.id), 0, data)
}

document.addEventListener('mousedown', function(e) {
  if(e.target.matches(".dragButton")) {
    e.target.parentNode.setAttribute("draggable", "true")
  }
})
document.addEventListener('dragend', function(e) {
  if(e.target.matches(".fullBlock")) {
    e.target.setAttribute("draggable", "false")
  }
})
// let initialx = 0;
// let initialy = 0;
document.addEventListener('mouseup', function(e) {
  if(e.target.matches(".block") || e.target.matches(".fullBlock")) {
    document.getElementById("toolbar").style["display"] = "none"
    getSelected()
  }
})
document.addEventListener('keyup', function(e) {
  if(e.target.matches(".block") || e.target.matches(".fullBlock")) {
    document.getElementById("toolbar").style["display"] = "none"
    getSelected()
  }
})
document.addEventListener('dblclick', function(e) {
  if(e.target.matches(".block") || e.target.matches(".fullBlock")) {
    document.getElementById("toolbar").style["display"] = "none"
    getSelected()
  }
})

// document.addEventListener('mousedown', function(e) {
//   initialx = e.clientX
//   initialy = e.clientY
// })
// document.addEventListener('mousemove', function(e) {
//   if(e.buttons == 1 && selectedBlocks == false) {
//     e.preventDefault();
//     let selector = document.getElementById("selector")
//     selector.style.display = "block"
//     let width = initialx - e.clientX
//     let height = initialy - e.clientY
//     let left = e.clientX
//     let top = e.clientY
//     if(width < 0) {
//       width = -width
//       left = left - width
//     } if(height < 0) {
//       height = -height
//       top = top - height
//     }
//     selector.style.height = height + "px"
//     selector.style.width = width + "px"
//     selector.style.left = left + "px"
//     selector.style.top = top + "px"
    

//     //extend to all blocks
//     rect1 = selector.getBoundingClientRect();
//     rect2 = document.getElementById("editor").getBoundingClientRect();
//     let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)
//     console.log(overlap)
//   }
// });
document.addEventListener('mousedown', function(e) {
  if(e.target.matches('.block') == true) {
    currentId = e.target.parentNode.id
    currentIdIndex = blockIds.indexOf(currentId)
  }
});

//recodes the behaviour related to multiple blocks
document.addEventListener('keydown', function(e) {
  if (e.target.matches('.block') == true) {
    if(e.key == 'Enter') {
      e.preventDefault();
      if(slashCommand != true) {
        nextBlock()
      }
    }
    if(e.key == 'ArrowUp') {
      e.preventDefault();
      prevBlock()
    }
    if(e.key == 'ArrowDown') {
      e.preventDefault();
      nextBlock(false);
    }
    if(ctrlMod == true && e.key == "s") {
      e.preventDefault();
      console.log(blockIds)
    }
    if(e.key=="Backspace" && (e.target.innerText == "\n" || e.target.innerText == "")) {
      e.preventDefault();
      deleteBlock()
    }

    // test to add shortcuts
    if(e.target.matches('.block') == true && ctrlMod == true && e.key == "h") {
      e.preventDefault();
      addOnlyClass('H1', currentId)
    }
  }
});


document.addEventListener('keyup', function(e) {
  if (e.target.matches('.block') == true) {
    if(slashCommand == false) {
      currentId =  document.querySelector(":focus").parentNode.getAttribute("id")
    }
    let wholeText = e.target.innerText;
    if(e.key == '/') {
      document.getElementById("popup").style.display = "block";
      slashCommand = true;
    }
    if(slashCommand == false) {
      oldText = wholeText
    }
    if(slashCommand == true) {
      focusedId =  document.querySelector(":focus").parentNode.getAttribute("id")
      if(focusedId != currentId) {
        escapeSearch = true
      }
      let filter, ul, li, a, i, txtValue;
      ul = document.getElementById("myUL");
      li = ul.getElementsByTagName('li');

      // for (let i = 0; i < oldText.length; i++) {
      //   if (wholeText[i] == '/' && oldText[i] != '/') {
      //     slashIndex = i;
      //   }
      // }
      // console.log(slashIndex);


      //get the length of the searchText and the index which it starts at
      let searchTextLen = 0 
      let x = 0;
      let startBool = true;
      let slashindex = 0;
      for (let i = 0; i < wholeText.length; i++) { 
        if(wholeText[i] != oldText[x]) {
          if(wholeText[i] == '/') {
            slashindex = i;
          }
          if(startBool == true) {
            if(wholeText[i] != '/'){
              escapeSearch = true;
            }
            startBool = false;
          }
          searchTextLen++;
        } else {
          x++;
        }
      }
      
      // Conditions to end the search
      if(escapeSearch == true || e.key == 'Escape' || (e.key == 'Backspace' &&(wholeText.length < slashindex + 1 || wholeText[slashindex] != "/"))) {
        document.getElementById("popup").style.display = "none";
        slashCommand = false;
        searchText = ""
        oldText = wholeText
        for (i = 0; i < li.length; i++) {
          li[i].getElementsByTagName("a")[0].setAttribute('class', '');
        }
        escapeSearch = false;
        noResults = false;
        return;
      }

      // Selects the focused option and ends the search
      if(e.key == "Enter") {
        let selectedOpt
        for (i = 0; i < li.length; i++) {
          if(li[i].getElementsByTagName("a")[0].getAttribute('class') == "focused") {
            selectedOpt = li[i].getElementsByTagName("a")[0]
          }
        }
        addOnlyClass(selectedOpt.getAttribute('type'), currentId)
        if(selectedOpt.getAttribute('type') == "MB") {
          let newDiv = document.createElement("div")
          newDiv.className = "MB-1"
          newDiv.id = "MB-1"+currentId
          newDiv.setAttribute("contentEditable", "true")
          document.getElementById(currentId).appendChild(newDiv)
        }
        document.getElementById("popup").style.display = "none";
        slashCommand = false;
        searchText = ""
        for (i = 0; i < li.length; i++) {
          li[i].getElementsByTagName("a")[0].setAttribute('class', '');
        }
        e.target.innerText = oldText;
        return;
      }
      // if(e.key == 'Backspace') {
      //   if(wholeText.length < slashIndex + 1 || wholeText[slashIndex] != "/") {
      //     document.getElementById("popup").style.display = "none";
      //     slashCommand = false;
      //   }
      // }
      // if (e.code === `Key${e.key.toUpperCase()}` || e.code === `Digit${e.key.toUpperCase()}` || e.key == " ") {
      //   searchText += e.key
      // }
      // if (e.key == 'Backspace') {
      //   if(ctrlMod == true) {
      //     searchText = ''
      //   }
      //   searchText = searchText.substring(0, searchText.length - 1); 
      // }

      // Filters the popup based on the searchText
      searchText = wholeText.substring(slashindex+1, slashindex+searchTextLen).replace(/(\r\n|\n|\r)/gm, "");
      filter = searchText.toUpperCase()
        // Loop through all list items, and hide those who don't match the search query
      let popupIndices = [];
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        a.setAttribute('class', '');
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
        li[popupIndices[0]].getElementsByTagName("a")[0].setAttribute('class', 'focused');
      } else {
        if(noResults == false) {
          escapeSearch = true
        }
        noResults = false;
        // console.log("No results found");
      }
    }
  }
});

document.addEventListener('input', function(e) {
  if(e.target.matches(".MB-1")) {
    let equation = e.target.innerText
    let html = katex.renderToString(equation, {
      throwOnError: false
    });
    let target = document.getElementById(e.target.id.replace("MB-1", "")).childNodes[1];
    target.innerHTML = html;
  }
})