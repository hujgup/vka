var Engine = new (function() {
	var _this = this;

	var _defineMethod = function(name,func) {
		Object.defineProperty(_this,name,{
			value: func,
			writable: false,
			enumerable: false
		});
	};
	var _defineObject = function(name,func) {
		Object.defineProperty(_this,name,{
			value: func,
			writable: false,
			enumerable: false
		});
	};

	var ElementId = function(id,ele,selfClosing,className,argsApplier) {
		var _hasClassName = typeof className !== "undefined";
		var _className = className;
		var _classId = " "+_this.Consts.html.CLASS_OPEN;
		var _standardApplier = function(args,hasClassName,className) {
			var res = "";
			var appliedClass = false;
			if (hasClassName) {
				appliedClass = true;
				res += _classId+className;
			}
			if (args.length > 0) {
				if (appliedClass) {
					res += " "+args;
				} else {
					appliedClass = true;
					res += _classId+args;
				}
			}
			if (appliedClass) {
				res += _this.Consts.html.ATTR_CLOSE;
			}
			return res;
		};
		var _applier = typeof argsApplier === "function" ? argsApplier : _standardApplier;
		this.id = id;
		this.ele = ele;
		this.selfClosing = typeof selfClosing !== "undefined" ? selfClosing : false;
		this.argsApplier = function(args) {
			return _applier(args,_hasClassName,_className,_standardApplier);
		};
	};

	this.Consts = new (function() {
		var _this2 = this;
		this.CONFIG_ENGINE_PREFIX = "@";
		this.LOADING_MSG = "Loading...";
		this.html = new(function() {
			var _this3 = this;
			this.TAG_OPEN = "<";
			this.TAG_CLOSE = ">";
			this.CLOSE_TAG_PREFIX = _this3.TAG_OPEN+"/";
			this.TAG_SELF_CLOSING = " "+_this3.CLOSE_TAG_PREFIX+_this3.TAG_CLOSE;
			this.TAG_LINK = "link";
			this.ATTR_OPEN = "='";
			this.ATTR_CLOSE = "'";
			this.ATTR_CLASS = "class";
			this.ATTR_HREF = "href";
			this.ATTR_REL = "rel";
			this.ATTR_TARGET = "target";
			this.CLASS_OPEN = _this3.ATTR_CLASS+_this3.ATTR_OPEN;
			this.HREF_OPEN = _this3.ATTR_HREF+_this3.ATTR_OPEN;
			this.TARGET_OPEN = _this3.ATTR_TARGET+_this3.ATTR_OPEN;
			this.TARGET_FULL = _this3.TARGET_OPEN+"_blank"+_this3.ATTR_CLOSE;
			this.INLINE_WRAPPER = "span";
			this.LINE_BREAK = "br";
			this.PARAGRAPH = "p";
			this.MAIN_HEADING = "h1";
			this.SUBHEADING = "h2";
			this.EMPHASIS = "em";
			this.LINK = "a";
			this.WRAPPER = "div";
			this.page = new(function() {
				var _this4 = this;
				this.LOG = "log";
				this.IMAGE = "image";
				this.INV = "inventory";
				this.ACTIONS = "actions";
				this.QUESTS = "quests";
			})();
		})();
		this.localization = new(function() {
			var _this3 = this;
			this.OPEN_BLOCK = "[";
			this.CLOSE_BLOCK = "]";
			this.BLOCK_OPEN_PREFIX = "+";
			this.BLOCK_CLOSE_PREFIX = "/";
			this.BLOCK_ARGS_SEPARATOR = " ";
			this.configKeys = new(function() {
				var _this4 = this;
				this.BREAK = _this2.CONFIG_ENGINE_PREFIX+"break";
				this.INITIAL = _this2.CONFIG_ENGINE_PREFIX+"init";
				this.TITLE_INV = _this2.CONFIG_ENGINE_PREFIX+"inventoryTitle";
				this.TITLE_ACTS = _this2.CONFIG_ENGINE_PREFIX+"actionsTitle";
				this.TITLE_QUESTS = _this2.CONFIG_ENGINE_PREFIX+"questLogTitle";
			})();
		})();
		this.definition = new(function() {
			var _this3 = this;
			this.NAME = _this2.CONFIG_ENGINE_PREFIX+"name";
			this.DESC = _this2.CONFIG_ENGINE_PREFIX+"desc";
			this.GRAPH_EDGE = _this2.CONFIG_ENGINE_PREFIX+"edge";
			this.GRAPH_ORIGIN = _this2.CONFIG_ENGINE_PREFIX+"from";
			this.GRAPH_DESTINATION = _this2.CONFIG_ENGINE_PREFIX+"to";
			this.GRAPH_EVT_FIRST_TRAVERSAL = _this2.CONFIG_ENGINE_PREFIX+"onFirstTraversal";
			this.IMAGE_ID = _this2.CONFIG_ENGINE_PREFIX+"id";
			this.IMAGE_ARTIST = _this2.CONFIG_ENGINE_PREFIX+"artist";
			this.IMAGE_SOURCE = _this2.CONFIG_ENGINE_PREFIX+"source";
			this.OBJECT_REMOVABLE = _this2.CONFIG_ENGINE_PREFIX+"removable";
			this.OBJECT_EVT_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"onInteract";
			this.ROOM_IMAGE = _this2.CONFIG_ENGINE_PREFIX+"image";
			this.ROOM_CONTENTS = _this2.CONFIG_ENGINE_PREFIX+"contents";
			this.STATE_LOCATION = _this2.CONFIG_ENGINE_PREFIX+"location";
			this.MATH_OP_ONE_VAR = _this2.CONFIG_ENGINE_PREFIX+"var";
			this.MATH_OP_ONE_LITERAL = _this2.CONFIG_ENGINE_PREFIX+"literal";
			this.MATH_OP_MANY_VARS = _this3.MATH_OP_ONE_VAR+"s";
			this.MATH_OP_MANY_LITERALS = _this3.MATH_OP_ONE_LITERAL+"s";
			this.MATH_OP_OUTPUT = _this2.CONFIG_ENGINE_PREFIX+"out";
		})();
		this.execution = new(function() {
			var _this3 = this;
			this.ACTION_MOVE = _this2.CONFIG_ENGINE_PREFIX+"teleport";
			this.ACTION_EXAMINE = _this2.CONFIG_ENGINE_PREFIX+"examine";
			this.ACTION_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"interact";
			this.ACTION_LOG = _this2.CONFIG_ENGINE_PREFIX+"log";
			this.ACTION_LOG_NO_BREAK = _this2.CONFIG_ENGINE_PREFIX+"logNoBreak";
			this.FLOW_IF = _this2.CONFIG_ENGINE_PREFIX+"if";
			this.FLOW_CONDITION = _this2.CONFIG_ENGINE_PREFIX+"limit";
			this.FLOW_THEN = _this2.CONFIG_ENGINE_PREFIX+"then";
			this.FLOW_ELSE = _this2.CONFIG_ENGINE_PREFIX+"else";
			this.FLOW_ELSE_IF = _this2.CONFIG_ENGINE_PREFIX+"elseIf";
			this.STATE_GET_VAR = _this2.CONFIG_ENGINE_PREFIX+"get";
			this.STATE_SET_VAR = _this2.CONFIG_ENGINE_PREFIX+"set";
			this.STATE_VAR_IS_DEFINED = _this2.CONFIG_ENGINE_PREFIX+"isDefined";
			this.STATE_DEFINE_VAR = _this2.CONFIG_ENGINE_PREFIX+"define";
			this.LOGIC_AND = _this2.CONFIG_ENGINE_PREFIX+"AND";
			this.LOGIC_OR = _this2.CONFIG_ENGINE_PREFIX+"OR";
			this.LOGIC_NAND = _this2.CONFIG_ENGINE_PREFIX+"NAND";
			this.LOGIC_NOR = _this2.CONFIG_ENGINE_PREFIX+"NOR";
			this.LOGIC_NOR_ALIAS = _this2.CONFIG_ENGINE_PREFIX+"NOT";
			this.LOGIC_XOR = _this2.CONFIG_ENGINE_PREFIX+"XOR";
			this.LOGIC_XNOR = _this2.CONFIG_ENGINE_PREFIX+"XNOR";
			this.LOGIC_MUTEX = _this2.CONFIG_ENGINE_PREFIX+"MUTEX";
			// Expandable
			this.MATH_ADD = _this2.CONFIG_ENGINE_PREFIX+"ADD";
			this.MATH_SUBTRACT = _this2.CONFIG_ENGINE_PREFIX+"SUB";
			this.MATH_MULTIPLY = _this2.CONFIG_ENGINE_PREFIX+"MULT";
			this.MATH_DIVIDE = _this2.CONFIG_ENGINE_PREFIX+"DIV";
			this.MATH_MOD = _this2.CONFIG_ENGINE_PREFIX+"MOD";
			this.MATH_EXP = _this2.CONFIG_ENGINE_PREFIX+"EXP";
			this.MATH_INCREMENT = _this2.CONFIG_ENGINE_PREFIX+"INC";
			this.MATH_DECREMENT = _this2.CONFIG_ENGINE_PREFIX+"DEC";
			// Non-Expandable
			this.MATH_LN = _this2.CONFIG_ENGINE_PREFIX+"LN";
			this.MATH_LOG2 = _this2.CONFIG_ENGINE_PREFIX+"LOG2";
			this.MATH_LOG10 = _this2.CONFIG_ENGINE_PREFIX+"LOG10";
			this.MATH_ROUND = _this2.CONFIG_ENGINE_PREFIX+"ROUND";
			this.MATH_FLOOR = _this2.CONFIG_ENGINE_PREFIX+"FLOOR";
			this.MATH_CEILING = _this2.CONFIG_ENGINE_PREFIX+"CEIL";
			this.MATH_TRUNCATE = _this2.CONFIG_ENGINE_PREFIX+"TRUNC";
			this.CMP_EQ = _this2.CONFIG_ENGINE_PREFIX+"EQ";
			this.CMP_NEQ = _this2.CONFIG_ENGINE_PREFIX+"NEQ";
			this.CMP_LT = _this2.CONFIG_ENGINE_PREFIX+"LT";
			this.CMP_GT = _this2.CONFIG_ENGINE_PREFIX+"GT";
			this.CMP_LTEQ = _this2.CONFIG_ENGINE_PREFIX+"LTEQ";
			this.CMP_GTEQ = _this2.CONFIG_ENGINE_PREFIX+"GTEQ";
			// End expandability clauses
		})();
		this.io = new(function() {
			var _this3 = this;
			this.USER_ID = "app";
			this.ENGINE_ID = "ng";
			this.CONFIG_EXT = ".cfg";
			this.paths = new(function() {
				var _this4 = this;
				this.SCRIPT_ROOT = "script/";
				this.SCRIPT_USER = _this4.SCRIPT_ROOT+_this3.USER_ID+"/";
				this.SCRIPT_ENGINE = _this4.SCRIPT_ROOT+_this3.ENGINE_ID+"/";
				this.SCRIPT_IO = _this4.SCRIPT_ENGINE+"io/";
				this.COMMON_ROOT = "common/";
				this.COMMON_USER = _this4.COMMON_ROOT+_this3.USER_ID+"/";
				this.COMMON_ENGINE = _this4.COMMON_ROOT+_this3.ENGINE_ID+"/";
				this.COMMON_OBJECTS = _this4.COMMON_ENGINE+"objects";
				this.COMMON_ROOMS = _this4.COMMON_ENGINE+"rooms";
				this.COMMON_GRAPH = _this4.COMMON_ENGINE+"graph";
				this.COMMON_IMAGES = _this4.COMMON_ENGINE+"images";
				this.COMMON_ROOMS = _this4.COMMON_ENGINE+"objects";
				this.STYLE_ROOT = "style/";
				this.STYLE_USER = _this4.STYLE_ROOT+_this3.USER_ID+"/";
				this.GFX_ROOT = "gfx/";
				this.GFX_USER = _this4.GFX_ROOT+_this3.USER_ID+"/";
				this.GFX_ENGINE = _this4.GFX_ROOT+_this3.ENGINE_ID+"/";
			})();
			this.files = new(function() {
				var _this4 = this;
				this.SCRIPT_LOAD_STYLING = _this3.paths.SCRIPT_IO+"loadStyling.php";
				this.SCRIPT_LOAD_LOCALIZATION = _this3.paths.SCRIPT_IO+"loadLocalization.php";
				this.SCRIPT_LOAD_MISC = _this3.paths.SCRIPT_IO+"loadNg.php";
				this.COMMON_STATE = _this3.paths.COMMON_ENGINE+"state"+_this3.CONFIG_EXT;
				this.GFX_ALPHA = _this3.paths.GFX_ENGINE+"alpha.png";
			})();
		})();
	});
	this.Consts.localization.ID_MAP = [
		new ElementId("s",_this.Consts.html.INLINE_WRAPPER),
		new ElementId("n",_this.Consts.html.LINE_BREAK,true),
		new ElementId("p",_this.Consts.html.PARAGRAPH),
		new ElementId("H",_this.Consts.html.MAIN_HEADING),
		new ElementId("h",_this.Consts.html.SUBHEADING),
		new ElementId("q",_this.Consts.html.INLINE_WRAPPER,false,"soft"),
		new ElementId("i",_this.Consts.html.EMPHASIS),
		new ElementId("l",_this.Consts.html.LINK,false,undefined,function(args,hasClassName,className,standardApplier) {
			args = args.split(_this.Consts.localization.BLOCK_ARGS_SEPARATOR);
			if (args.length === 0) {
				throw new Error("l element in localization must have one argument specifying the URL to link to.");
			} else {
				var res = " "+_this.Consts.html.TARGET_FULL+" "+_this.Consts.html.HREF_OPEN+args[0]+_this.Consts.html.ATTR_CLOSE;
				args = args.slice(1).join(_this.Consts.localization.BLOCK_ARGS_SEPARATOR);
				res += standardApplier(args,hasClassName,className,standardApplier);
				return res;
			}
		}),
		new ElementId("w",_this.Consts.html.WRAPPER)
	];
	this.Consts = Object.freeze(this.Consts);

	// TODO: Use this object for defining scoping when reading state.cfg
	var Scope = function(name) {
		var _this2 = this;
		var _flags = [];
		var _vars = {};
		var _children = [];
		var _parent = null;

		var _defineMethod = function(name,func) {
			Object.defineProperty(_this2,name,{
				value: func,
				writable: false,
				enumerable: false
			});
		};

		Object.defineProperty(this,"name",{
			value: name,
			enumerable: true,
			writable: false
		});
		Object.defineProperty(this,"parent",{
			get: function() {
				return _parent;
			},
			enumerable: true
		});
		Object.defineProperty(this,"hasParent",{
			get: function() {
				return _parent !== null;
			},
			enumerable: true
		});
		Object.defineProperty(this,"children",{
			value: new ImmutableArray(_children),
			writable: false,
			enumerable: true
		});
		Object.defineProperty(this,"hasChildren",{
			get: function() {
				return _children.length !== 0;
			},
			enumerable: true
		});

		_defineMethod("_setParent",function(value) {
			_parent = value;
		});
		_defineMethod("_getVarScope",function(v) {
			var res;
			if (_vars.hasOwnProperty(v)) {
				res = _this2;
			} else if (_this2.hasParent) {
				res = _parent._getVarScope(v);
			} else {
				res = null;
			}
			return res;
		});
		_defineMethod("_hasVar",function(v) {
			return _vars.hasOwnProperty(v);
		});
		_defineMethod("_getVar",function(v) {
			return _vars[v];
		});
		_defineMethod("_setVar",function(v,value) {
			_vars[v] = value;
		});
		_defineMethod("hasFlag",function(flag) {
			var res;
			if (_flags.indexOf(flag) !== -1) {
				res = true;
			} else if (_this2.hasParent) {
				res = _parent.hasFlag(flag);
			} else {
				res = false;
			}
			return res;
		});
		_defineMethod("addFlag",function(flag) {
			var res = !_this2.hasFlag(flag);
			if (res) {
				_flags.push(flag);
			}
			return res;
		});
		_defineMethod("removeFlag",function(flag) {
			var res;
			var index = _flags.indexOf(flag);
			if (index !== -1) {
				_flags.splice(index,1);
				res = true;
			} else if (_this2.hasParent) {
				res = _parent.removeFlag(flag);
			} else {
				res = false;
			}
			return res;
		});
		_defineMethod("getVariable",function(v,value) {
			var scope = _this2._getVarScope(v);
			return scope !== null ? scope._getVar(v) === value : false;
		});
		_defineMethod("setVariable",function(v,value) {
			var scope = _this2._getVarScope(v);
			if (scope !== null) {
				scope._setVar(v,value);
			} else {
				_this2._setVar(v,value);
			}
		});
		_defineMethod("hasChild",function(child,deep) {
			deep = typeof deep !== "undefined" ? deep : false;
			var res;
			if (_children.indexOf(child) !== -1) {
				res = true;
			} else if (deep && _this2.hasChildren) {
				res = false;
				for (var i = 0; i < _children.length; i++) {
					res = _children[i].hasChild(child,deep);
					if (res) {
						break;
					}
				}
			} else {
				res = false;
			}
			return res;
		});
		_defineMethod("hasChildNamed",function(name,deep) {
			return typeof _this2.getChildNamed(name,deep) !== "undefined";
		});
		_defineMethod("getChildNamed",function(name,deep) {
			deep = typeof deep !== "undefined" ? deep : false;
			var res;
			var child;
			for (var i = 0; i < _children.length; i++) {
				child = _children[i];
				if (child.name === name) {
					res = child;
					break;
				} else if (deep && child.hasChildren) {
					res = child.getChildNamed(name,deep);
					if (typeof res !== "undefined") {
						break;
					}
				}
			}
			return res;
		});
		_defineMethod("addChild",function(child) {
			child._setParent(_this2);
			_children.push(child);
		});
		_defineMethod("removeChild",function(child) {
			var index = _children.indexOf(child);
			var res = index !== -1;
			if (res) {
				_children.splice(index,1);
			}
			return res;
		});
		_defineMethod("removeChildNamed",function(name) {
			var child = _this2.getChildNamed(name);
			var res = typeof child !== "undefined";
			if (res) {
				res = _this2.removeChild(child);
			}
			return res;
		});
	};

	var LoadCounter = function(max,container) {
		var _loaded = 0;
		var _max = max;
		var _errors = [];
		var _render = function() {
			container.textContent = _this.Consts.LOADING_MSG+" "+Math.round(100*_loaded/_max)+"%";
		};
		this.increment = function() {
			if (_loaded < _max && _errors.length === 0) {
				_loaded++;
				_render();
				if (_loaded >= _max) {
					this.onLoad();
				}
			}
		};
		this.error = function(e,cause) {
			console.log(cause);
			console.error(e);
			_errors.push(" "+e.message);
			container.textContent = "";
			var p;
			var span;
			var text;
			for (var i = 0; i < _errors.length; i++) {
				p = document.createElement(_this.Consts.html.PARAGRAPH);
					span = document.createElement(_this.Consts.html.INLINE_WRAPPER);
						span.className = "error";
						span.textContent = "ERROR:";
					p.appendChild(span);
					text = document.createTextNode(_errors[i]);
					p.appendChild(text);
				container.appendChild(p);
			}
		};
		this.onLoad = function() {
		};
		_render();
	};

	var LocalizationMap = new (function() {
		var _this2 = this;

		var _defineMethod = function(name,func) {
			Object.defineProperty(_this2,name,{
				value: func,
				writable: false,
				enumerable: false
			});
		};

		var _strings = {};
		var _groups = {};

		_defineMethod("hasString",function(key) {
			return _strings.hasOwnProperty(key);
		});
		_defineMethod("getString",function(key) {
			return _this2.hasString(key) ? _strings[key] : undefined;
		});
		_defineMethod("setString",function(key,value) {
			var res = "";
			var openBracket = false;
			var inOpenBlock = false;
			var inArgs = false;
			var inCloseBlock = false;
			var noBlocks = true;
			var block = {
				id: "",
				args: ""
			};
			var _pushChar = function(c) {
				if (inArgs) {
					block.args += c;
				} else {
					block.id += c;
				}
			};
			var _formatArgs = function(id) {
				return id.argsApplier(block.args);
			};
			var _findId = function(context,callback,ignoreSelfClosing) {
				var id;
				for (var i = 0; i < _this.Consts.localization.ID_MAP.length; i++) {
					id = _this.Consts.localization.ID_MAP[i];
					if (block.id === id.id) {
						if (ignoreSelfClosing && id.selfClosing) {
							throw new Error(context[0].toUpperCase()+context.substring(1)+" tag "+block.id+" in a localization file cannot be closed because it is self-closing.");
						} else {
							callback(id);
							return;
						}
					}
				}
				throw new Error("Unknown "+context+" tag "+_this.Consts.localization.BLOCK_OPEN_PREFIX+block.id+" in a localization file.");
			};
			value.forEach(function(c) {
				if (inOpenBlock) {
					if (c.escaped) {
						_pushChar(c.char);
					} else if (!inArgs && c.char === _this.Consts.localization.BLOCK_ARGS_SEPARATOR) {
						inArgs = true;
					} else if (c.char === _this.Consts.localization.CLOSE_BLOCK) {
						inOpenBlock = false;
						inArgs = false;
						_findId("opening",function(id) {
							res += _this.Consts.html.TAG_OPEN+id.ele+_formatArgs(id);
							if (id.selfClosing) {
								res += _this.Consts.html.TAG_SELF_CLOSING;
							} else {
								res += _this.Consts.html.TAG_CLOSE;
							}
						},false);
					} else {
						_pushChar(c.char);
					}
				} else if (inCloseBlock) {
					if (c.escaped) {
						_pushChar(c.char);
					} else if (c.char === _this.Consts.localization.CLOSE_BLOCK) {
						inCloseBlock = false;
						_findId("closing",function(id) {
							res += _this.Consts.html.CLOSE_TAG_PREFIX+id.ele+_this.Consts.html.TAG_CLOSE;
						},true);
					} else {
						_pushChar(c.char);
					}
				} else if (openBracket) {
					openBracket = false;
					if (c.escaped || (c.char !== _this.Consts.localization.BLOCK_OPEN_PREFIX && c.char !== _this.Consts.localization.BLOCK_CLOSE_PREFIX)) {
						res += _this.Consts.localization.OPEN_BLOCK+c.char;
					} else {
						block.id = "";
						block.args = "";
						if (c.char === _this.Consts.localization.BLOCK_OPEN_PREFIX) {
							inOpenBlock = true;
							inCloseBlock = false;
							inArgs = false;
						} else {
							inOpenBlock = false;
							inCloseBlock = true;
						}
					}
				} else if (!c.escaped && c.char === _this.Consts.localization.OPEN_BLOCK) {
					openBracket = true;
					noBlocks = false;
				} else {
					res += c.char;
				}
			});
			if (noBlocks) {
				res = _this.Consts.html.TAG_OPEN+_this.Consts.html.PARAGRAPH+_this.Consts.html.TAG_CLOSE+res+_this.Consts.html.CLOSE_TAG_PREFIX+_this.Consts.html.PARAGRAPH+_this.Consts.html.TAG_CLOSE;
			}
			_strings[key] = res;
		});
		_defineMethod("hasGroup",function(key) {
			return _groups.hasOwnProperty(key);
		});
		_defineMethod("getGroup",function(key) {
			return _this2.hasGroup(key) ? _groups[key] : undefined;
		});
		_defineMethod("setGroup",function(key,value) {
			_groups[key] = value;
		});
	})();

	var Action = function(key,callback) {
		this.key = key;
		this.callback = callback;
	};

	var _topLevelActions = [
		new Action(_this.Consts.execution.ACTION_MOVE,function() {
			// TODO: Change player location
		}),
		new Action(_this.Consts.execution.ACTION_EXAMINE,function() {
			// TODO: Display object examination text
		}),
		new Action(_this.Consts.execution.ACTION_INTERACT,function() {
			// TODO: Execute object interaction function
		})
	];

	var _container;
	var _containerContent;
	var _log;
	var _image;
	var _inv;
	var _actions;
	var _quests;

	var _wrapCallback = function(req,manager,callback) {
		req.execute(function(res) {
			if (res.error) {
				manager.error(new Error(res.text),res);
			} else {
				try {
					callback(res);
					manager.increment();
				} catch (e) {
					manager.error(e,res);
				}
			}
		});
	};
	var _loadStylesheet = function(file) {
		var link = document.createElement(_this.Consts.html.TAG_LINK);
			link.setAttribute(_this.Consts.html.ATTR_REL,"stylesheet");
			link.setAttribute(_this.Consts.html.ATTR_HREF,_this.Consts.io.paths.STYLE_USER+file);
		document.head.appendChild(link);
	};
	var _parseLocalization = function(map) {
		map.globalNode.associations.forEach(function(key,value) {
			LocalizationMap.setString(key,value);
		});
		map.globalNode.children.forEach(function(child) {
			LocalizationMap.setGroup(child.name.rawString,child);
		});
	};

	var _htmlToNodes = function(html,container) {
		var root = document.createElement("div");
		root.innerHTML = html;
		while (root.childNodes.length > 0) {
			container.appendChild(root.childNodes[0]);
		}
	};

	_defineMethod("logPush",function(id) {
		_htmlToNodes(LocalizationMap.getString(_this.Consts.localization.configKeys.BREAK),_log);
		_this.logPushNoBreak(id,true);
	});
	_defineMethod("logPushNoBreak",function(id,keepLastInView) {
		var lastElement = _log.children.length > 0 ? _log.children[_log.children.length - 1] : null;
		_htmlToNodes(LocalizationMap.getString(id),_log);
		if (lastElement !== null) {
			keepLastInView = typeof keepLastInView !== "undefined" ? keepLastInView : false;
			var refElement;
			if (keepLastInView) {
				refElement = lastElement;
			} else {
				var nextElement = lastElement.nextElementSibling;
				if (nextElement !== null) {
					refElement = nextElement;
				} else {
					refElement = lastElement;
				}
			}
			_log.scrollTop = refElement.offsetTop;
		}
	});

	window.addEventListener("DOMContentLoaded",function() {
		_container = document.getElementById("container");
		_containerContent = container.innerHTML;

		var manager = new LoadCounter(4,_container);
		manager.onLoad = function() {
			_container.innerHTML = _containerContent;
			_log = document.getElementById(_this.Consts.html.page.LOG);
			_image = document.getElementById(_this.Consts.html.page.IMAGE);
			_inv = document.getElementById(_this.Consts.html.page.INV);
			_actions = document.getElementById(_this.Consts.html.page.ACTIONS);
			_quests = document.getElementById(_this.Consts.html.page.QUESTS);

			_log.textContent = "";
			_this.logPushNoBreak(_this.Consts.localization.configKeys.INITIAL);
			_inv.innerHTML = LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_INV);
			_actions.innerHTML = LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_ACTS);
			_quests.innerHTML = LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_QUESTS);
		};
		var query = location.search;
		if (query.length !== 0) {
			var kvps = query.split("&");
			var kvp;
			for (var i = 0; i < kvps.length; i++) {
				kvp = kvps[i].split("=");
				query[kvp[0]] = kvp[1];
			}
		} else {
			query = {};
		}

		var req = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_STYLING);
		_wrapCallback(req,manager,function(res) {
			var json = JSON.parse(res.text);
			for (var i = 0; i < json.length; i++) {
				_loadStylesheet(json[i]);
			}
		});
		var req2 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_LOCALIZATION);
		req2.data = {
			lang: query.hasOwnProperty("lang") ? query.lang : "en"
		};
		_wrapCallback(req2,manager,function(res) {
			_parseLocalization(new COM.Map(res.text));
			
		});
		var req3 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.COMMON_STATE);
		req3.execute(function(res) {
			console.log(res.text);
			if (res.error) {
				manager.error(new Error(res.text),res);
			} else {
				manager.increment();
			}
		});
		var req4 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
		req4.data = {
			folder: _this.Consts.io.paths.COMMON_OBJECTS
		};
		req4.execute(function(res) {
			if (res.error) {
				manager.error(new Error(res.text),res);
			} else {
				manager.increment();
			}
		});
		var req5 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
		req5.data = {
			folder: _this.Consts.io.paths.COMMON_ROOMS
		};
		req5.execute(function(res) {
			if (res.error) {
				manager.error(new Error(res.text),res);
			} else {
				manager.increment();
			}
		});
		// TODO: more requests for other common/ng folders
		// TODO: get common/ng/state.cfg and build Scope objects from that
	});
})();

