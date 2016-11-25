function tagParentEquals(potential,child) {
	var res = potential === child;
	if (!res) {
		if (!potential.hasAttribute("data-tags") && potential.parentElement !== null) {
			res = tagParentEquals(potential.parentElement,child);
		}
	}
	return res;
}
function getNextChildren(child) {
	var res;
	var potential = child.querySelectorAll("[data-children]");
	if (potential.length > 0) {
		for (var i = 0; i < potential.length; i++) {
			if (tagParentEquals(potential[i],child)) {
				res = potential[i];
				i = potential.length;
			}
		}
		if (typeof res === "undefined") {
			res = child;
		}
	} else {
		res = child;
	}
	return res;
}
function createList(parent,container,depth,tagCascade) {
	depth = typeof depth !== "undefined" ? depth : 0;
	tagCascade = Array.isArray(tagCascade) ? tagCascade : [];
	var depthPlusOne = depth + 1;
	var ol = document.createElement("ol");
		ol.className = "nav-list nav-list-"+depth;
		var child;
		var title;
		var li;
		var a;
		var span;
		var tags;
		var tagText;
		for (var i = 0; i < parent.children.length; i++) {
			child = parent.children[i];
			if (child.hasAttribute("data-tags")) {
				tags = child.getAttribute("data-tags");
				tags = tags.length > 0 ? tagCascade.concat(tags.split(" ")) : tagCascade.slice(0);
				title = child.querySelector("[data-title]");
				li = document.createElement("li");
					tagText = tags.join(" ");
					li.setAttribute("data-nav-tags",tagText);
					a = document.createElement("a");
						a.href = "#"+child.id;
						a.innerHTML = title.textContent;
					li.appendChild(a);
					span = document.createElement("span");
						span.className = "nav-tags mono";
						span.style.display = "none";
						span.textContent = " {"+tagText+"}";
					li.appendChild(span);
					createList(getNextChildren(child),li,depthPlusOne,tags);
				ol.appendChild(li);
			}
		}
	if (ol.children.length > 0) {
		container.appendChild(ol);
	}
}

function resolveTagDisplay(nav,show) {
	var i = new DOMRecursiveIterator(nav);
	i.forEach(function(node) {
		if (node.className.split(" ").indexOf("nav-tags") !== -1) {
			node.style.display = show ? "inline" : "none";
		}
	});
}

function LogicNode() {
	this.paths = 0;
	this.resolve = function(whitelist) {
		throw new Error("Abstract method \"resolve\" not implemented.");
	};
}
function LogicBoolNode(value) {
	LogicNode.call(this);
	this.value = value;
	this.resolve = function() {
		return this.value;
	};
}
LogicBoolNode.prototype = LogicNode.prototype;
LogicBoolNode.prototype.constructor = LogicBoolNode;
function LogicLiteralNode(value) {
	LogicNode.call(this);
	this.value = value;
	this.resolve = function(whitelist) {
		return whitelist.indexOf(this.value) !== -1;
	};
}
LogicLiteralNode.prototype = LogicNode.prototype;
LogicLiteralNode.prototype.constructor = LogicLiteralNode;
function LogicNotNode(child) {
	LogicNode.call(this);
	this.paths = 1;
	this.child = child;
	this.resolve = function(whitelist) {
		return !this.child.resolve(whitelist);
	};
}
LogicNotNode.prototype = LogicNode.prototype;
LogicNotNode.prototype.constructor = LogicNotNode;
function LogicSplitNode(left,right) {
	LogicNode.call(this);
	this.paths = 2;
	this.left = left;
	this.right = right;
	this.resolve = function(whitelist) {
		return this.logic(this.left.resolve(whitelist),this.right.resolve(whitelist));
	};
	this.logic = function(left,right) {
		throw new Error("Abstract method \"logic\" not implemented.");
	};
}
LogicSplitNode.prototype = LogicNode.prototype;
LogicSplitNode.prototype.constructor = LogicSplitNode;
function LogicAndNode(left,right) {
	LogicSplitNode.call(this,left,right);
	this.logic = function(left,right) {
		return left && right;
	};
}
LogicAndNode.prototype = LogicSplitNode.prototype;
LogicAndNode.prototype.constructor = LogicAndNode;
function LogicOrNode(left,right) {
	LogicSplitNode.call(this,left,right);
	this.logic = function(left,right) {
		return left || right;
	};
}
LogicOrNode.prototype = LogicSplitNode.prototype;
LogicOrNode.prototype.constructor = LogicOrNode;
function LogicXorNode(left,right) {
	LogicSplitNode.call(this,left,right);
	this.logic = function(left,right) {
		return (left || right) && !(left && right);
	};
}
LogicXorNode.prototype = LogicSplitNode.prototype;
LogicXorNode.prototype.constructor = LogicXorNode;
/*
function LogicXNode(left,right) {
	LogicSplitNode.call(this,left,right);
	this.logic = function(left,right) {

	};
}
LogicXNode.prototype = LogicSplitNode.prototype;
LogicXNode.prototype.constructor = LogicXNode;
*/
function LogicCompiler() {
	var _this = this;
	this.literalRegex = /^[a-z]+/i;
	this.not = "!";
	this.and = "&";
	this.or = "|";
	this.xor = "^";
	this.groupOpen = "(";
	this.groupClose = ")";
	this.compile = function(str) {
		var root;
		var current;

		var pushCurrent = function(node,text) {
			switch (current.paths) {
				case 2:
					if (typeof current.left === "undefined") {
						current.left = node;
					} else if (typeof current.right === "undefined") {
						current.right = node;
					} else {
						throw new Error("Syntax Error: Unexpected token \""+text+"\".");
					}
					break;
				case 1:
					if (typeof current.child === "undefined") {
						current.child = node;
					} else {
						throw new Error("Syntax Error: Unexpected token \""+text+"\".");
					}
					break;
				default:
					throw new Error("Syntax Error: Unexpected token \""+text+"\".");
			}
		};
		var pushChild = function(node,text) {
			if (typeof root === "undefined") {
				root = node;
				current = node;
			} else {
				pushCurrent(node,text);
			}
		};
		var pushRoot = function(node,text) {
			if (typeof root === "undefined") {
				root = node;
				current = node;
			} else {
				if (typeof current === "undefined") {
					throw new Error("Syntax Error: Binary operation \""+text+"\" requires a laft-hand argument to be specified.");
				} else if (current.paths === 1 && typeof current.child === "undefined") {
					throw new Error("Syntax Error: Previous unary operation must have a child element.");
				} else if (current.paths === 2 && (typeof current.left === "undefined" || typeof current.right === "undefined")) {
					throw new Error("Syntax Error: Previous binary operation must have both a left and right element.");
				}
				root = node;
				var oldCurrent = current;
				current = node;
				pushCurrent(oldCurrent,text);
			}
		};
		var extractGroup = function(str) {
			var res = "";
			var depth = 1;
			var c;
			for (var i = 1; depth > 0 && i < str.length; i++) {
				c = str[i];
				switch (c) {
					case _this.groupOpen:
						depth++;
						break;
					case _this.groupClose:
						depth--;
						break;
				}
				if (depth > 0) {
					res += c;
				}
			}
			if (depth > 0) {
				throw new Error("Syntax Error: "+depth+" unmatched group opener(s) in expression \""+_this.groupOpen+res+"\".");
			}
			return res;
		};

		str = str.trim();
		var removeLength;
		var group;
		var match;
		var node;
		var c;
		while (str.length > 0) {
			match = this.literalRegex.exec(str);
			if (match !== null) {
				node = new LogicLiteralNode(match[0]);
				pushChild(node,node.value);
				removeLength = match[0].length;
			} else {
				c = str[0];
				removeLength = 1;
				switch (c) {
					case this.not:
						node = new LogicNotNode();
						pushChild(node,this.not);
						current = node;
						break;
					case this.and:
						node = new LogicAndNode();
						pushRoot(node,this.and);
						break;
					case this.or:
						node = new LogicOrNode();
						pushRoot(node,this.or);
						break;
					case this.xor:
						node = new LogicXorNode();
						pushRoot(node,this.xor);
						break;
					case this.groupOpen:
						group = extractGroup(str);
						node = this.compile(group);
						group = this.groupOpen+group+this.groupClose;
						pushChild(node,group);
						removeLength= group.length;
						break;
					case this.groupClose:
						throw new Error("Syntax Error: Unexpected token \""+this.groupClose+"\".");
						break;
				}
			}
			str = str.substr(removeLength).trim();
		}
		if (typeof root === "undefined") {
			throw new Error("Syntax Error: Expression empty.");
		}
		return root;
	};
}
// humans | (trolls & coloration) | terezi
// x ^ (y | z & w) & a

function cascadeShow(node,nav) {
	if (node.hasAttribute("data-nav-tags")) {
		node.style.display = "list-item";
	}
	if (node !== nav && node.parentElement !== null) {
		cascadeShow(node.parentElement,nav);
	}
}
function filterTags(tagInput,nav) {
	var value = tagInput.value.trim();
	var errMsg;
	var filter;
	if (value.length > 0) {
		var compiler = new LogicCompiler();
		try {
			filter = compiler.compile(value);
			console.log(filter);
		} catch (e) {
			errMsg = e.message;
		}
	} else {
		filter = new LogicBoolNode(true);
	}
	if (typeof errMsg === "undefined") {
		var i = new DOMRecursiveIterator(nav);
		i.forEach(function(node) {
			if (node.hasAttribute("data-nav-tags")) {
				node.style.display = "none";
			}
		});
		var tags;
		i.forEach(function(node) {
			if (node.hasAttribute("data-nav-tags")) {
				tags = node.getAttribute("data-nav-tags").split(" ");
				if (filter.resolve(tags)) {
					cascadeShow(node,nav);
				}
			}
		});
	} else {
		alert(errMsg);
	}
}

function getTextColor(r,g,b) {
	var res;
	if (typeof r === "string") {
		var hex = r.substr(1);
		r = parseInt(hex.substr(0,2),16);
		g = parseInt(hex.substr(2,2),16);
		b = parseInt(hex.substr(4,2),16);
	}
	return Math.sqrt(0.241*r*r + 0.691*g*g + 0.068*b*b) < 130 ? "white" : "black";
}

function parseQueryString() {
	var res = {};
	if (location.search.length > 0) {
		var pairs = location.search.substr(1).split("&");
		var pair;
		for (var i = 0; i < pairs.length; i++) {
			pair = pairs[i].split("=");
			res[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}
	}
	return res;
}

window.addEventListener("load",function() {
	var root = document.getElementById("root");
	var nav = document.getElementById("navContainer");

	createList(root,nav);

	var tagShow = document.getElementById("tagShow");
	tagShow.addEventListener("click",function() {
		resolveTagDisplay(nav,tagShow.checked);
	});
	resolveTagDisplay(nav,tagShow.checked);

	var tagInput = document.getElementById("tagInput");
	var tagFilter = document.getElementById("tagFilter");
	tagFilter.addEventListener("click",function() {
		filterTags(tagInput,nav);
	});
	var query = parseQueryString();
	if (query.hasOwnProperty("filter")) {
		tagInput.value = query.filter;
		filterTags(tagInput,nav);
	}
	var makeLink = document.getElementById("makeLink");
	makeLink.addEventListener("click",function() {
		var value = tagInput.value.trim();
		var errMsg;
		if (value !== "") {
			var compiler = new LogicCompiler();
			try {
				compiler.compile(value);
			} catch (e) {
				errMsg = e.message;
			}
		}
		if (typeof errMsg === "undefined") {
			var text = location.origin+location.pathname;
			if (value !== "") {
				text += "?filter="+encodeURIComponent(value);
			}
			tagInput.value = text;
		} else {
			alert(errMsg);
		}
	});

	var bloodTable = document.getElementById("bloodTable");
	var i = new DOMRecursiveIterator(bloodTable);
	i.forEach(function(node) {
		if (node.tagName.toLowerCase() === "td") {
			node.className = "mono";
			node.style.backgroundColor = node.textContent;
			node.style.color = getTextColor(node.textContent);
		}
	});
});