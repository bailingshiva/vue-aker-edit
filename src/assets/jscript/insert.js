//插入html
export function insertHtmlAtCaret(html,lastEditRange) {
  var sel, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (lastEditRange) {
      //console.log(lastEditRange)
      // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
      sel.removeAllRanges()
      sel.addRange(lastEditRange)
    }
    else{
      var textNode=document.getElementById("editdiv");//获取你的文本域
      range = document.createRange();
      range.selectNodeContents(textNode);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      /*console.log(getCursortPosition(textNode));
      range = document.createRange();
      range.selectNodeContents(textNode);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(getCursortPosition(textNode));*/
    }
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(), node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}
function getCursortPosition (textDom) {
  var cursorPos = 0;
  if (document.selection) {
    // IE Support
    textDom.focus ();
    var selectRange = document.selection.createRange();
    selectRange.moveStart ('character', -textDom.value.length);
    cursorPos = selectRange.text.length;
  }else if (textDom.selectionStart || textDom.selectionStart == '0') {
    // Firefox support
    cursorPos = textDom.selectionStart;
  }
  return cursorPos;
}
