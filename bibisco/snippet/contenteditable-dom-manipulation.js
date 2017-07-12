v
/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

function recognizeMarkAtCaretPosition {
  let nodeTypeAtCaretPosition = getNodeTypeAtCaretPosition();
  if (nodeTypeAtCaretPosition && (nodeTypeAtCaretPosition.includes('MARK') ||
      nodeTypeAtCaretPosition.includes(
        'mark') || nodeTypeAtCaretPosition.includes('Mark'))) {
    self.highlightactive = true;
  } else {
    self.highlightactive = false;
  }
}

function mark() {
  if (window.getSelection) {
    var sel = window.getSelection();
    var ranges = [];
    var range;
    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
      ranges.push(sel.getRangeAt(i));
    }
    sel.removeAllRanges();

    // Surround ranges in reverse document order to prevent surrounding subsequent ranges messing with already-surrounded ones
    i = ranges.length;

    while (i--) {
      range = ranges[i];
      let unmark = checkUnmark(range);

      if (!unmark) {
        surroundRangeContents(range);
      }

      sel.addRange(range);
    }

    // put caret outside <mark> tag
    range = document.createRange();
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}


function checkUnmark(range) {
  let unmark = false;
  let nodes = getNodesInRange(range);
  for (let i = 0, node; node = nodes[i++];) {
    let parentNode = node.parentNode;
    if (parentNode && (parentNode.tagName == 'MARK' || parentNode
        .tagName == 'mark' || parentNode.tagName == 'Mark')) {
      unmark = true;

      var grandparentNode = parentNode.parentNode;

      // move the node out of the <mark> element
      grandparentNode.insertBefore(node, parentNode);

      // if mark node is empty, I remove it
      if (!parentNode.firstChild) {
        grandparentNode.removeChild(parentNode);
      }
    }
  }

  return unmark;
}


function getNodeTypeAtCaretPosition() {
  var node = null;
  node = window.getSelection().getRangeAt(0).commonAncestorContainer;
  node = ((node.nodeType === 1) ? node : node.parentNode);
  if (!node) {
    return null;
  }

  var nodeArray = [];
  return returnParentTag(node, nodeArray);
}

function returnParentTag(elem, nodeArray) {
  nodeArray.push(elem.tagName);
  if (elem.id != "richtexteditor") {
    var next = returnParentTag(elem.parentNode, nodeArray);
    if (next) return next;
  } else
    return nodeArray;
}



// ************************************************************************

function getNextNode(node) {
  var next = node.firstChild;
  if (next) {
    return next;
  }
  while (node) {
    if ((next = node.nextSibling)) {
      return next;
    }
    node = node.parentNode;
  }
}

function getNodesInRange(range) {
  var start = range.startContainer;
  var end = range.endContainer;
  var commonAncestor = range.commonAncestorContainer;
  var nodes = [];
  var node;

  // Walk parent nodes from start to common ancestor
  for (node = start.parentNode; node; node = node.parentNode) {
    nodes.push(node);
    if (node == commonAncestor) {
      break;
    }
  }
  nodes.reverse();

  // Walk children and siblings from start until end is found
  for (node = start; node; node = getNextNode(node)) {
    nodes.push(node);
    if (node == end) {
      break;
    }
  }

  return nodes;
}

function getNodeIndex(node) {
  var i = 0;
  while ((node = node.previousSibling)) {
    ++i;
  }
  return i;
}

function insertAfter(node, precedingNode) {
  var nextNode = precedingNode.nextSibling,
    parent = precedingNode.parentNode;
  if (nextNode) {
    parent.insertBefore(node, nextNode);
  } else {
    parent.appendChild(node);
  }
  return node;
}

// Note that we cannot use splitText() because it is bugridden in IE 9.
function splitDataNode(node, index) {
  var newNode = node.cloneNode(false);
  newNode.deleteData(0, index);
  node.deleteData(index, node.length - index);
  insertAfter(newNode, node);
  return newNode;
}

function isCharacterDataNode(node) {
  var t = node.nodeType;
  return t == 3 || t == 4 || t == 8; // Text, CDataSection or Comment
}

function splitRangeBoundaries(range) {
  var sc = range.startContainer,
    so = range.startOffset,
    ec = range.endContainer,
    eo = range.endOffset;
  var startEndSame = (sc === ec);

  // Split the end boundary if necessary
  if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
    splitDataNode(ec, eo);
  }

  // Split the start boundary if necessary
  if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
    sc = splitDataNode(sc, so);
    if (startEndSame) {
      eo -= so;
      ec = sc;
    } else if (ec == sc.parentNode && eo >= getNodeIndex(sc)) {
      ++eo;
    }
    so = 0;
  }
  range.setStart(sc, so);
  range.setEnd(ec, eo);
}

function getTextNodesInRange(range) {
  var textNodes = [];
  var nodes = getNodesInRange(range);
  for (var i = 0, node, el; node = nodes[i++];) {
    if (node.nodeType == 3) {
      textNodes.push(node);
    }
  }
  return textNodes;
}

function surroundRangeContents(range) {

  let templateElement = document.createElement("mark");
  splitRangeBoundaries(range);
  let textNodes = getTextNodesInRange(range);
  if (textNodes.length == 0) {
    return;
  }
  for (let i = 0, node, el; node = textNodes[i++];) {
    el = templateElement.cloneNode(false);
    node.parentNode.insertBefore(el, node);
    el.appendChild(node);
  }

  range.setStart(textNodes[0], 0);
  var lastTextNode = textNodes[textNodes.length - 1];
  range.setEnd(lastTextNode, lastTextNode.length);
}

function getSelectionHtml() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type == "Text") {
      html = document.selection.createRange().htmlText;
    }
  }
  return html;
}
