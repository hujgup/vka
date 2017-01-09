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
		// Passing functions to take advantage of short-circuit optimization
		return this.logic(function() {
			return this.left.resolve(whitelist);
		},function() {
			return this.right.resolve(whitelist);
		});
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
		return left() && right();
	};
}
LogicAndNode.prototype = LogicSplitNode.prototype;
LogicAndNode.prototype.constructor = LogicAndNode;
function LogicOrNode(left,right) {
	LogicSplitNode.call(this,left,right);
	this.logic = function(left,right) {
		return left() || right();
	};
}
LogicOrNode.prototype = LogicSplitNode.prototype;
LogicOrNode.prototype.constructor = LogicOrNode;
function LogicXorNode(left,right) {
	LogicSplitNode.call(this,left,right);
	this.logic = function(left,right) {
		left = left();
		right = right();
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

		str = str.trim().toLowerCase();
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
