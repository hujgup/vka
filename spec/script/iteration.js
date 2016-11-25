function DOMRecursiveIterator(root) {
	var _root = root;
	var _iterating = false;

	var StackFrame = function(node) {
		this.node = node;
		this.index = -1;
	};

	Object.defineProperty(this,"root",{
		get: function() {
			return _root;
		},
		set: function(value) {
			if (_iterating) {
				throw new Error("Cannot set the iterator's root element while iteration is in progress.");
			}
			_root = value;
		},
		enumerable: true
	});
	this.forEach = function(callback) {
		_iterating = true;
		var last = new StackFrame(_root);
		var stack = [last];
		var cnt = true;
		var callbackResult;
		var oldLast;
		while (cnt && stack.length > 0) {
			if (last.index === -1) {
				callbackResult = callback(last.node);
				if (typeof callbackResult !== "undefined" && callbackResult === true) {
					cnt = false;
				} else {
					last.index = 0;
				}
			} else if (last.index < last.node.children.length) {
				oldLast = last;
				last = new StackFrame(last.node.children[last.index]);
				oldLast.index++;
				stack.push(last);
			} else {
				stack.pop();
				if (stack.length > 0) {
					last = stack[stack.length - 1];
				}
			}
		}
		_iterating = false;
	};
}