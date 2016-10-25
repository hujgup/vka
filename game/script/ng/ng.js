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
		})();
		this.execution = new(function() {
			var _this3 = this;
			this.ACTION_MOVE = _this2.CONFIG_ENGINE_PREFIX+"teleport";
			this.ACTION_MOVE_TO = _this2.CONFIG_ENGINE_PREFIX+"to";
			this.ACTION_EXAMINE = _this2.CONFIG_ENGINE_PREFIX+"examine";
			this.ACTION_EXAMINE_OBJECT = _this2.CONFIG_ENGINE_PREFIX+"object";
			this.ACTION_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"interact";
			this.ACTION_INTERACT_OBJECT = this.ACTION_EXAMINE_OBJECT;
			this.ACTION_LOG = _this2.CONFIG_ENGINE_PREFIX+"log";
			this.FLOW_IF = _this2.CONFIG_ENGINE_PREFIX+"if";
			this.FLOW_CONDITION = _this2.CONFIG_ENGINE_PREFIX+"limit";
			this.FLOW_THEN = _this2.CONFIG_ENGINE_PREFIX+"then";
			this.FLOW_ELSE = _this2.CONFIG_ENGINE_PREFIX+"else";
			this.STATE_GET_VAR = _this2.CONFIG_ENGINE_PREFIX+"get";
			this.STATE_SET_VAR_BY_VAR = _this2.CONFIG_ENGINE_PREFIX+"setToVar";
			this.STATE_SET_VAR_BY_LITERAL = _this2.CONFIG_ENGINE_PREFIX+"setToLiteral";
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
			this.OP_VARS = _this2.CONFIG_ENGINE_PREFIX+"vars";
			this.OP_LITERALS = _this2.CONFIG_ENGINE_PREFIX+"literals";
			this.OP_OUTPUT = _this2.CONFIG_ENGINE_PREFIX+"out";
			this.REGEX_NUMBER = /^[+\-]?\d+(\.\d+)?(e[+\-]?\d+)?$/i;
			this.REGEX_BOOLEAN = /^(true|false)$/;
			this.BOOL_TRUE = "true";
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

	var _parseVarValue = function(str) {
		if (_this.Consts.execution.REGEX_NUMBER.test(res)) {
			res = parseFloat(res);
		} else if (_this.Consts.execution.REGEX_BOOLEAN.test(res)) {
			res = res === _this.Consts.execution.BOOL_TRUE;
		}
		return res;
	};

	var Scope = function(name) {
		var _this2 = this;
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
		_defineMethod("hasVariable",function(v) {
			return typeof _this2.getVariable(v) !== "undefined";
		});
		_defineMethod("getVariable",function(v) {
			var scope = _this2._getVarScope(v);
			return scope !== null ? _parseVarValue(scope._getVar(v)) : undefined;
		});
		_defineMethod("setVariable",function(v,value) {
			var scope = _this2._getVarScope(v);
			if (scope !== null) {
				scope._setVar(v,value);
			} else {
				throw new Error("Variable '"+v+"' is undefined.");
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

	var EngineCommand = function(node) {
		var _this2 = this;
		var _commands = [];
		this.push = function(cmd) {
			_commands.push(cmd);
		};
		this.forEach = function(callback) {
			for (var i = 0; i < _commands.length; i++) {
				callback(_commands[i]);
			}
		};
		this.execute = function(context) {
			context = typeof context !== "undefined" ? context : {
				stack: new EngineCommand.ScopeStack(_state),
				logBroken: false
			};
			this.forEach(function(cmd) {
				cmd.execute(context);
			});
		};
		this.attemptMath = function(child,name) {
			var res;
			switch (name) {
				case _this.Consts.execution.MATH_ADD:
					res = new MathAddCommand(child);
					break;
				case _this.Consts.execution.MATH_SUBTRACT:
					res = new MathSubtractCommand(child);
					break;
				case _this.Consts.execution.MATH_MULTIPLY:
					res = new MathMultiplyCommand(child);
					break;
				case _this.Consts.execution.MATH_DIVIDE:
					res = new MathDivideCommand(child);
					break;
				case _this.Consts.execution.MATH_MOD:
					res = new MathModCommand(child);
					break;
				case _this.Consts.execution.MATH_EXP:
					res = new MathExpCommand(child);
					break;
				case _this.Consts.execution.MATH_LN:
					res = new MathLnCommand(child);
					break;
				case _this.Consts.execution.MATH_LOG2:
					res = new MathLog2Command(child);
					break;
				case _this.Consts.execution.MATH_LOG10:
					res = new MathLog10Command(child);
					break;
				case _this.Consts.execution.MATH_ROUND:
					res = new MathRoundCommand(child);
					break;
				case _this.Consts.execution.MATH_FLOOR:
					res = new MathFloorCommand(child);
					break;
				case _this.Consts.execution.MATH_CEILING:
					res = new MathCeilingCommand(child);
					break;
				case _this.Consts.execution.MATH_TRUNCATE:
					res = new MathTruncateCommand(child);
					break;
			}
			return res;
		};
		this.attemptScoping = function(child,name) {
			if (name.startsWith(_this.Consts.CONFIG_ENGINE_PREFIX)) {
				throw new Error("Unexpected engine-defined child \""+name+"\".");
			} else {
				return new ScopingCommand(child,name);
			}
		};
		if (typeof node !== "undefined") {
			var cmd;
			node.children.forEach(function(child) {
				var name = child.name.rawString;
				switch (name) {
					case _this.Consts.execution.FLOW_IF:
						cmd = new IfCommand(child);
						break;
					case _this.Consts.execution.STATE_SET_VAR:
						cmd = new SetVarCommand(child);
						break;
					case _this.Consts.execution.ACTION_LOG:
						cmd = new LogCommand(child);
						break;
					case _this.Consts.execution.ACTION_MOVE:
						cmd = new MoveCommand(child);
						break;
					case _this.Consts.execution.ACTION_EXAMINE:
						cmd = new ExamineCommand(child);
						break;
					case _this.Consts.execution.ACTION_INTERACT:
						cmd = new InteractCommand(child);
						break;
					default:
						cmd = _this2.attemptMath(child,name); 
						if (typeof cmd === "undefined") {
							cmd = _this2.attemptScoping(child,name);
						}
						break;
				}
				_this2.push(cmd);
			});
		}
	};
	EngineCommand.ScopeStack = function(root) {
		var _stack = [root];
		this.peek = function() {
			return _stack[_stack.length - 1];
		};
		this.push = function(scope) {
			_stack.push(scope);
		};
		this.pop = function() {
			return _stack.pop();
		};
	};
	EngineCommand.NO_OP = new EngineCommand();
	EngineCommand.prototype.constructor = EngineCommand;
	var ScopingCommand = function(node,name) {
		EngineCommand.call(this,node);
		var _name = name;
		var _parentExec = this.execute;
		this.execute = function(context) {
			var child = context.stack.peek().getChildNamed(_name);
			if (typeof child !== "undefined") {
				context.stack.push(child);
				var res = _parentExec(context);
				context.stack.pop();
				return res;
			} else {
				throw new Error("Scope '"+context.stack.peek().name+"' does not have a child '"+_name+"'.");
			}
		};
	};
	ScopingCommand.prototype = EngineCommand;
	ScopingCommand.prototype.constructor = ScopingCommand;
	var SetVarCommand = function(node) {
		EngineCommand.call(this);
		var assocs = [];
		this.execute = function(context) {
			assocs.forEach(function(entry) {
				context.setVariable(entry[0],entry[1]);
			});
		};
		node.associations.forEach(function(key,value) {
			assocs.push([key,_parseVarValue(value)]);
		});
	};
	SetVarCommand.prototype = EngineCommand.prototype;
	SetVarCommand.prototype.constructor = SetVarCommand;
	var MoveCommand = function(node) {
		EngineCommand.call(this);
		var _to;
		this.execute = function(context) {
			_teleportPlayer(_to);
		};
		_to = node.getAssociation(_this.Consts.execution.ACTION_MOVE_TO);
		if (typeof _to !== "undefined") {
			_to = _to.rawString;
		} else {
			throw new Error(_this.Consts.execution.ACTION_MOVE+": Required association '"+_this.Consts.execution.ACTION_MOVE_TO+"' is undefined.");
		}
	};
	MoveCommand.prototype = EngineCommand.prototype;
	MoveCommand.prototype.constructor = MoveCommand;
	var ExamineCommand = function(node) {
		EngineCommand.call(this);
		var _object;
		this.examine = function(context) {
			_examineObject(_object,context.logBroken);
		};
		_object = node.getAssociation(_this.Consts.execution.ACTION_EXAMINE_OBJECT);
		if (typeof _object !== "undefined") {
			_object = _object.rawString;
		} else {
			throw new Error(_this.Consts.execution.ACTION_EXAMINE+": Required association '"+_this.Consts.execution.ACTION_EXAMINE_OBJECT+"' is undefined.");
		}
	};
	ExamineCommand.prototype = EngineCommand.prototype;
	ExamineCommand.prototype.constructor = ExamineCommand;
	var InteractCommand = function(node) {
		EngineCommand.call(this);
		var _object;
		this.examine = function(context) {
			_interactWithObject(_object,context);
		};
		_object = node.getAssociation(_this.Consts.execution.ACTION_INTERACT_OBJECT);
		if (typeof _object !== "undefined") {
			_object = _object.rawString;
		} else {
			throw new Error(_this.Consts.execution.ACTION_INTERACT+": Required association '"+_this.Consts.execution.ACTION_INTERACT_OBJECT+"' is undefined.");
		}
	};
	InteractCommand.prototype = EngineCommand.prototype;
	InteractCommand.prototype.constructor = InteractCommand;
	var LogCommand = function(node) {
		EngineCommand.call(this);
		var _strings = [];
		var _log = function(context,id) {
			if (context.logBroken) {
				_logPushNoBreak(id);
			} else {
				_logPush(id);
			}
		};
		this.execute = function(context) {
			_strings.forEach(function(id) {
				_log(context,id);
			});
		};
		node.entries.forEach = function(entry) {
			_strings.push(entry.rawString);
		};
	};
	LogCommand.prototype = EngineCommand.prototype;
	LogCommand.prototype.constructor = LogCommand;
	var IfCommand = function(node) {
		EngineCommand.call(this);
		var _limit = new AndCommand(node.getChildNamed(_this.Consts.execution.FLOW_CONDITION));
		var _then = new EngineCommand(node.getChildNamed(_this.Consts.execution.FLOW_THEN));
		var _else = new EngineCommand(node.getChildNamed(_this.Consts.execution.FLOW_ELSE));
		this.execute = function(context) {
			if (_limit.execute(context)) {
				_then.execute(context);
			} else {
				_else.execute(context);
			}
		};
	};
	IfCommand.prototype = EngineCommand.prototype;
	IfCommand.prototype.constructor = IfCommand;
	var MathCommand = function(node) {
		EngineCommand.call(this);
		var _this2 = this;
		var _out;
		this.initializeValue = function(value) {
			return value;
		};
		this.getId = function() {
		};
		this.execCallback = function(current,value) {
		};
		this.execute = function(context) {
			var values = [];
			var component;
			this.forEach(function(cmd) {
				component = cmd.execute(context);
				values.push(component);
			});
			if (values.length > 0) {
				var res = this.initializeValue(values[0]);
				for (var i = 1; i < values.length; i++) {
					res = this.setupCallback(res,values[i]);
				}
				context.stack.peek().setVariable(_out,res.toString());
				return res;
			} else {
				throw new Error(this.getId()+": no values to perform operation on.");
			}
		};
		var _thisExec = this.execute;
		node.children.forEach(function(child) {
			var name = child.name.rawString;
			var cmd;
			switch (name) {
				case _this.Consts.execution.OP_VARS:
					cmd = new ComparisonVarsCommand(child);
					break;
				case _this.Consts.execution.OP_LITERALS:
					cmd = new ComparisonLiteralsCommand(child);
					break;
				default:
					cmd = _this2.attemptScoping(child,name,context);
					break;
			}
			_this2.push(cmd);
		});
		_out = node.getAssociation(_this.Consts.execution.OP_OUTPUT).rawString;
		if (typeof out === "undefined") {
			throw new Error("Math operation output variable undefined.");
		}
	};
	MathCommand.prototype = EngineCommand.prototype;
	MathCommand.prototype.constructor = MathCommand;
	var MathAddCommand = function(node) {
		MathCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_ADD;
		};
		this.execCallback = function(current,value) {
			return current + value;
		};
	};
	MathAddCommand.prototype = MathCommand.prototype;
	MathAddCommand.prototype.constructor = MathAddCommand;
	var MathSubtractCommand = function(node) {
		MathCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_SUBTRACT;
		this.execCallback = function(current,value) {
			return current - value;
		};
	};
	MathSubtractCommand.prototype = MathCommand.prototype;
	MathSubtractCommand.prototype.constructor = MathSubtractCommand;
	var MathMultiplyCommand = function(node) {
		MathCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_MULTIPLY;
		};
		this.execCallback = function(current,value) {
			return current*value;
		};
	};
	MathMultiplyCommand.prototype = MathCommand.prototype;
	MathMultiplyCommand.prototype.constructor = MathMultiplyCommand;
	var MathDivideCommand = function(node) {
		MathCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_Divide;
		};
		this.execCallback = function(current,value) {
			return current/value;
		};
	};
	MathDivideCommand.prototype = MathCommand.prototype;
	MathDivideCommand.prototype.constructor = MathDivideCommand;
	var MathModCommand = function(node) {
		MathCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_MOD;
		};
		this.execCallback = function(current,value) {
			return current%value;
		};
	};
	MathModCommand.prototype = MathCommand.prototype;
	MathModCommand.prototype.constructor = MathModCommand;
	var MathExpCommand = function(node) {
		MathCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_EXP;
		};
		this.execCallback = function(current,value) {
			return Math.pow(current,value);
		};
	};
	MathExpCommand.prototype = MathCommand.prototype;
	MathExpCommand.prototype.constructor = MathExpCommand;
	var MathSingleCommand = function(node) {
		MathCommand.call(this,node);
		this.execCallback = function(current,value) {
			return this.initializeValue(value);
		};
	};
	MathSingleCommand.prototype = MathCommand.prototype;
	MathSingleCommand.prototype.constructor = MathSingleCommand;
	var MathLnCommand = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_LN;
		};
		this.initializeValue = function(value) {
			return Math.log(value);
		};
	};
	MathLnCommand.prototype = MathSingleCommand.prototype;
	MathLnCommand.prototype.constructor = MathLnCommand;
	var MathLog2Command = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_LOG2;
		};
		this.initializeValue = function(value) {
			return Math.log2(value);
		};
	};
	MathLog2Command.prototype = MathSingleCommand.prototype;
	MathLog2Command.prototype.constructor = MathLog2Command;
	var MathLog10Command = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_LOG10;
		};
		this.initializeValue = function(value) {
			return Math.log10(value);
		};
	};
	MathLog10Command.prototype = MathSingleCommand.prototype;
	MathLog10Command.prototype.constructor = MathLog10Command;
	var MathRoundCommand = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_ROUND;
		};
		this.initializeValue = function(value) {
			return Math.round(value);
		};
	};
	MathRoundCommand.prototype = MathSingleCommand.prototype;
	MathRoundCommand.prototype.constructor = MathRoundCommand;
	var MathFloorCommand = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_FLOOR;
		};
		this.initializeValue = function(value) {
			return Math.floor(value);
		};
	};
	MathFloorCommand.prototype = MathSingleCommand.prototype;
	MathFloorCommand.prototype.constructor = MathFloorCommand;
	var MathCeilingCommand = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_CEILING;
		};
		this.initializeValue = function(value) {
			return Math.ceil(value);
		};
	};
	MathCeilingCommand.prototype = MathSingleCommand.prototype;
	MathCeilingCommand.prototype.constructor = MathCeilingCommand;
	var MathTruncateCommand = function(node) {
		MathSingleCommand.call(this,node);
		this.getId = function() {
			return _this.Consts.execution.MATH_TRUNCATE;
		};
		this.initializeValue = function(value) {
			return Math.trunc(value);
		};
	};
	MathTruncateCommand.prototype = MathSingleCommand.prototype;
	MathTruncateCommand.prototype.constructor = MathTruncateCommand;
	var ComparisonCommand = function(node) {
		EngineCommand.call(this);
		var _values = [];
		this.setupExecCallback = function(cmp,value) {
		};
		this.setupExec = function(context,id) {
			var values = _thisExec(context);
			if (values.length > 0) {
				var res = true;
				var cmp = values[0];
				for (var i = 1; res && i < values.length; i++) {
					this.setupExecCallback(cmp,values[i]);
				}
				return res;
			} else {
				throw new Error(id+": no values to compare.");
			}
		};
		this.execute = function(context) {
			var values = [];
			var component;
			this.forEach(function(cmd) {
				component = cmd.execute(context);
				if (Array.isArray(component)) {
					values = values.concat(component);
				} else {
					values.push(component);
				}
			});
			return values;
		};
		var _thisExec = this.execute;
		node.children.forEach(function(child) {
			var name = child.name.rawString;
			var cmd;
			switch (name) {
				case _this.Consts.execution.OP_VARS:
					cmd = new ComparisonVarsCommand(child);
					break;
				case _this.Consts.execution.OP_LITERALS:
					cmd = new ComparisonLiteralsCommand(child);
					break;
				default:
					cmd = _this2.attemptScoping(child,name,context);
					break;
			}
			_this2.push(cmd);
		});
	};
	ComparisonCommand.prototype = EngineCommand.prototype;
	ComparisonCommand.prototype.constructor = ComparisonCommand;
	var ComparisonVarsCommand = function(node) {
		EngineCommand.call(this);
		var _this2 = this;
		var _vars = [];
		this.execute = function(context) {
			var res = [];
			for (var i = 0; i < _vars.length; i++) {
				res.push(context.stack.peek().getVariable(_vars[i]));
			}
			return res;
		};
		node.entries.forEach(function(entry) {
			_vars.push(entry.rawString);
		});
	};
	ComparisonVarsCommand.prototype = EngineCommand.prototype;
	ComparisonVarsCommand.prototype.constructor = ComparisonVarsCommand;
	var ComparisonLiteralsCommand = function(node) {
		EngineCommand.call(this);
		var _this2 = this;
		var _literals = [];
		this.execute = function(context) {
			return _literals;
		};
		node.entries.forEach(function(entry) {
			_literals.push(_parseVarValue(entry.rawString));
		});
	};
	ComparisonLiteralsCommand.prototype = EngineCommand.prototype;
	ComparisonLiteralsCommand.prototype.constructor = ComparisonLiteralsCommand;
	var LimitCommand = function(node) {
		EngineCommand.call(this);
		var _this2 = this;
		this.execute = function(context) {
			var res = new LimitCommand.Data();
			this.forEach(function(cmd) {
				var value = cmd.execute(context);
				if (typeof value === "boolean") {
					if (value) {
						res.trueCount++;
					}
					res.totalCount++;
				}
			});
			return trueCount;
		};
		node.children.forEach(function(child) {
			var name = child.name.rawString;
			var cmd;
			switch (name) {
				case _this.Consts.execution.LOGIC_AND:
					cmd = new AndCommand(child);
					break;
				case _this.Consts.execution.LOGIC_OR:
					cmd = new OrCommand(child);
					break;
				case _this.Consts.execution.LOGIC_NAND:
					cmd = new NandCommand(child);
					break;
				case _this.Consts.execution.LOGIC_NOR:
				case _this.Consts.execution.LOGIC_NOR_ALIAS:
					cmd = new NorCommand(child);
					break;
				case _this.Consts.execution.LOGIC_XOR:
					cmd = new XorCommand(child);
					break;
				case _this.Consts.execution.LOGIC_XNOR:
					cmd = new XnorCommand(child);
					break;
				case _this.Consts.execution.LOGIC_MUTEX:
					cmd = new MutexCommand(child);
					break;
				case _this.Consts.execution.CMP_EQ:
					cmd = new EqualsCommand(child);
					break;
				case _this.Consts.execution.CMP_NEQ:
					cmd = new NotEqualsCommand(child);
					break;
				case _this.Consts.execution.CMP_LT:
					cmd = new LessThanCommand(child);
					break;
				case _this.Consts.execution.CMP_GT:
					cmd = GreaterThanCommand(child);
					break;
				case _this.Consts.execution.CMP_LTEQ:
					cmd = LessThanOrEqualToCommand(child);
					break;
				case _this.Consts.execution.CMP_GTEQ:
					cmd = GreaterThanOrEqualTo(child);
					break;
				default:
					cmd = _this2.attemptMath(child,name);
					if (typeof cmd === "undefined") {
						cmd = _this2.attemptScoping(child,name);
					}
					break;
			}
			_this2.push(cmd);
		});
	};
	LimitCommand.Data = function() {
		this.trueCount = 0;
		this.totalCount = 0;
	};
	LimitCommand.prototype = EngineCommand.prototype;
	LimitCommand.prototype.constructor = LimitCommand;
	var EqualsCommand = function(node) {
		ComparisonCommand.call(this,node);
		this.setupExecCallback = function(cmp,value) {
			return cmp === value;
		};
		this.execute = function(context) {
			return this.setupExec(context,_this.Consts.execution.CMP_EQ);
		};
	};
	EqualsCommand.prototype = ComparisonCommand.prototype;
	EqualsCommand.prototype.constructor = EqualsCommand;
	var NotEqualsCommand = function(node) {
		ComparisonCommand.call(this,node);
		this.setupExecCallback = function(cmp,value) {
			return cmp !== value;
		};
		this.execute = function(context) {
			return this.setupExec(context,_this.Consts.execution.CMP_NEQ);
		};
	};
	NotEqualsCommand.prototype = ComparisonCommand.prototype;
	NotEqualsCommand.prototype.constructor = NotEqualsCommand;
	var LessThanCommand = function(node) {
		ComparisonCommand.call(this,node);
		this.setupExecCallback = function(cmp,value) {
			return cmp < value;
		};
		this.execute = function(context) {
			return this.setupExec(context,_this.Consts.execution.CMP_LT);
		};
	};
	LessThanCommand.prototype = ComparisonCommand.prototype;
	LessThanCommand.prototype.constructor = LessThanCommand;
	var GreaterThanCommand = function(node) {
		ComparisonCommand.call(this,node);
		this.setupExecCallback = function(cmp,value) {
			return cmp > value;
		};
		this.execute = function(context) {
			return this.setupExec(context,_this.Consts.execution.CMP_GT);
		};
	};
	GreaterThanCommand.prototype = ComparisonCommand.prototype;
	GreaterThanCommand.prototype.constructor = GreaterThanCommand;
	var LessThanOrEqualTo = function(node) {
		ComparisonCommand.call(this,node);
		this.setupExecCallback = function(cmp,value) {
			return cmp <= value;
		};
		this.execute = function(context) {
			return this.setupExec(context,_this.Consts.execution.CMP_LTEQ);
		};
	};
	LessThanOrEqualTo.prototype = ComparisonCommand.prototype;
	LessThanOrEqualTo.prototype.constructor = LessThanOrEqualTo;
	var GreaterThanOrEqualToCommand = function(node) {
		ComparisonCommand.call(this,node);
		this.setupExecCallback = function(cmp,value) {
			return cmp >= value;
		};
		this.execute = function(context) {
			return this.setupExec(context,_this.Consts.execution.CMP_GTEQ);
		};
	};
	GreaterThanOrEqualTo.prototype = ComparisonCommand.prototype;
	GreaterThanOrEqualTo.prototype.constructor = GreaterThanOrEqualTo;
	var AndCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount === data.totalCount;
		};
	};
	AndCommand.prototype = LimitCommand.prototype;
	AndCommand.prototype.constructor = AndCommand;
	Var OrCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount > 0;
		};
	};
	OrCommand.prototype = LimitCommand.prototype;
	OrCommand.prototype.constructor = OrCommand;
	Var NandCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount !== data.totalCount;
		};
	};
	NandCommand.prototype = LimitCommand.prototype;
	NandCommand.prototype.constructor = NandCommand;
	Var NorCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount === 0;
		};
	};
	NorCommand.prototype = LimitCommand.prototype;
	NorCommand.prototype.constructor = NorCommand;
	Var XorCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount%2 === 1;
		};
	};
	XorCommand.prototype = LimitCommand.prototype;
	XorCommand.prototype.constructor = XorCommand;
	Var XnorCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount%2 === 0;
		};
	};
	XnorCommand.prototype = LimitCommand.prototype;
	XnorCommand.prototype.constructor = XnorCommand;
	Var MutexCommand = function(node) {
		LimitCommand.call(this,node);
		var _parentExec = this.execute;
		this.execute = function(context) {
			var data = _parentExec(context);
			return data.trueCount === 1;
		};
	};
	MutexCommand.prototype = LimitCommand.prototype;
	MutexCommand.prototype.constructor = MutexCommand;

	var ImageReference = function(id,node) {
		if (typeof id !== "undefined") {
			this.id = id;
			this.filePath = _this.Consts.io.paths.GFX_USER+node.name.rawString;
			this.artist = node.getAssociation(_this.Consts.definition.IMAGE_ARTIST).rawString;
			this.source = node.getAssociation(_this.Consts.definition.IMAGE_SOURCE).rawString;
		}
	};
	var ObjectReference = function(id,node) {
		var _this2 = this;
		this.id = id;
		this.name = node.getAssociation(_this.Consts.definition.NAME).rawString;
		this.desc = node.getAssociation(_this.Consts.definition.DESC).rawString;
		this.removable = node.hasAssociation(_this.Consts.definition.OBJECT_REMOVABLE) ? _parseBool(node.getAssociation(_this.Consts.definition.OBJECT_REMOVABLE).rawString) : false;
		this.interactable = node.hasChildNamed(_this.Consts.definition.OBJECT_EVT_INTERACT);
		this.onInteract = this.interactable ? new EngineEvent(node.getChildNamed(_this.Consts.definition.OBJECT_EVT_INTERACT)) : EngineEvent.NO_OP;
	};
	var Room = function(id,node) {
		var _this2 = this;
		this.id = id;
		this.name = node.getAssociation(_this.Consts.definition.NAME).rawString;
		this.desc = node.getAssociation(_this.Consts.definition.DESC).rawString;
		this.imageId = node.hasAssociation(_this.Consts.definition.ROOM_IMAGE) ? node.getAssociation(_this.Consts.definition.ROOM_IMAGE) : null;
		this.contents = [];
		this.getImage = function() {
			return this.imageId !== null ? _images[this.imageId] : _imageAlpha;
		};
		
		if (node.hasChildNamed(_this.Consts.definition.ROOM_CONTENTS)) {
			node.getChildNamed(_this.Consts.definition.ROOM_CONTENTS).entries.forEach(function(entry) {
				if (_objects.hasOwnProperty(entry.rawString)) {
					_this2.contents.push(_objects[entry.rawString]);
				} else {
					throw new Error("Object \""+entry.rawString+"\" is undefined.");
				}
			});
		}
	};
	var Graph = function() {
		var _arr = [];
		this.getEdge = function(from,to) {
			if (typeof to !== "undefined") {
				to = from.to.id;
				from = from.from.id;
			}
			var res;
			var entry;
			for (var i = 0; i < _arr.length; i++) {
				entry = _arr[i];
				if (entry.from.id === from && entry.to.id === to) {
					res = entry;
					break;
				}
			}
			return res;
		};
		this.push = function(edge) {
			if (typeof this.getEdge(edge) !== "undefined") {
				throw new Error("Cannot push edge ("+edge.from.id+", "+edge.to.id+") because that edge is already defined.");
			} else {
				_arr.push(edge);
			}
		};
	};
	var GraphEdge = function(from,to,node) {
		this.from = _rooms[from];
		this.to = _rooms[to];
		this.onFirstTraversal = node.hasChildNamed(_this.Consts.definition.GRAPH_EVT_FIRST_TRAVERSAL) ? new EngineEvent(node.getChildNamed(_this.Consts.definition.GRAPH_EVT_FIRST_TRAVERSAL)) : EngineEvent.NO_OP;
	};

	// CFG
	var _roomsMap;
	var _objectsMap;
	var _graphMap;
	var _state;
	var _images;
	var _rooms;
	var _objects;
	var _graph;
	var _imageAlpha = new ImageReference();
	_imageAlpha.id = "alpha";
	_imageAlpha.filePath = _this.Consts.io.paths.GFX_ENGINE+"alpha.png";
	_imageAlpha.artist = "";
	_imageAlpha.source = "";
	// HTML
	var _container;
	var _containerContent;
	var _log;
	var _image;
	var _inv;
	var _actions;
	var _quests;

	var _parseBool = function(str) {
		str = str.toLowerCase();
		if (str === "true") {
			return true;
		} else if (str === "false") {
			return false;
		} else {
			throw new RangeError("Cannot convert value \""+str+"\" to a Boolean.");
		}
	};
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
	var _parseState = function(node) {
		var res = new Scope(node.name.rawString);
		node.associations.forEach(function(key,value) {
			res.setVariable(key,_parseVarValue(value.rawString));
		});
		node.children.forEach(function(child) {
			res.addChild(_parseState(child));
		});
		return res;
	};
	var _parseImages = function(map) {
		try {
			_images = {};
			var id;
			map.globalNode.children.forEach(function(child) {
				id = child.getAssociation(_this.Consts.definition.IMAGE_ID).rawString;
				if (_images.hasOwnProperty(id)) {
					throw new Error("An image with I.D. \""+id+"\" already exists.");
				} else {
					_images[id] = new ImageReference(id,child);
				}
			});
		} catch (e) {
			e.message += " (in image with I.D. \""+id+"\")";
			throw e;
		}
	};
	var _parseObjects = function() {
		try {
			_objects = {};
			var id;
			_objectsMap.globalNode.children.forEach(function(child) {
				id = child.name.rawString;
				if (_objects.hasOwnProperty(id)) {
					throw new Error("An object with I.D. \""+id+"\" already exists.");
				} else {
					_objects[id] = new ObjectReference(id,child);
				}
			});
		} catch (e) {
			e.message += " (in object with I.D. \""+id+"\")";
			throw e;
		}
	};
	var _parseRooms = function() {
		try {
			_rooms = {};
			var id;
			_roomsMap.globalNode.children.forEach(function(child) {
				id = child.name.rawString;
				if (_rooms.hasOwnProperty(id)) {
					throw new Error("A room with I.D. \""+id+"\" already exists.");
				} else {
					_rooms[id] = new Room(id,child);
				}
			});
		} catch (e) {
			e.message += " (in room with I.D. \""+id+"\")";
			throw e;
		}
	};
	var _parseGraph = function() {
		try {
			_graph = new Graph();
			var name;
			var from;
			var to;
			_graphMap.globalNode.children.forEach(function(child) {
				from = child.getAssociation(_this.Consts.definition.GRAPH_ORIGIN);
				to = child.getAssociation(_this.Consts.definition.GRAPH_DESTINATION);
				name = child.name.rawString;
				if (name === _this.Consts.definition.GRAPH_EDGE) {
					_graph.push(new GraphEdge(from,to,child));
				} else {
					throw new Error("Unexpected child \""+name+"\" in graph definition.");
				}
			});
		} catch (e) {
			e.message += " (in graph edge from \""+from+"\" to \""+to+"\")";
			throw e;
		}
	};

	var _teleportPlayer = function(to) {
		if (_rooms.hasOwnProperty(to)) {
			_state.setVariable(_this.Consts.definition.STATE_LOCATION,to);
		} else {
			throw new Error("Unable to move to room '"+to+"': no such room exists.");
		}
	};
	var _examineObject = function(id,breakFirst) {
		breakFirst = typeof breakFirst !== "undefined" ? breakFirst : false;
		if (_objects.hasOwnProperty(id)) {
			var obj = _objects[id];
			if (breakFirst) {
				_logPush(obj.desc);
			} else {
				_logPushNoBreak(obj.desc);
			}
		} else {
			throw new Error("Unable to examine object '"+id+"': no such object exists.");
		}
	};
	var _interactWithObject = function(id,context) {
		if (_objects.hasOwnProperty(id)) {
			var obj = _objects[id];
			if (obj.interactable) {
				obj.onInteract(context);
			} else {
				throw new Error("Unable to interact with object '"+id+"': object does not define interaction behavior.");
			}
		} else {
			throw new Error("Unable to interact with object '"+id+"': no such object exists.");
		}
	};
	var _logPush = function(id) {
		_htmlToNodes(LocalizationMap.getString(_this.Consts.localization.configKeys.BREAK),_log);
		_logPushNoBreak(id,true);
	};
	var _logPushNoBreak = function(id,keepLastInView) {
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
	};

	var _htmlToNodes = function(html,container) {
		var root = document.createElement("div");
		root.innerHTML = html;
		while (root.childNodes.length > 0) {
			container.appendChild(root.childNodes[0]);
		}
	};

	window.addEventListener("DOMContentLoaded",function() {
		_container = document.getElementById("container");
		_containerContent = container.innerHTML;

		var manager = new LoadCounter(7,_container);
		manager.onLoad = function() {
			var good = true;
			try {
				_parseObjects();
				_parseRooms();
				_parseGraph();
			} catch (e) {
				manager.error(e,null);
				good = false;
			}

			if (good) {
				_container.innerHTML = _containerContent;
				_log = document.getElementById(_this.Consts.html.page.LOG);
				_image = document.getElementById(_this.Consts.html.page.IMAGE);
				_inv = document.getElementById(_this.Consts.html.page.INV);
				_actions = document.getElementById(_this.Consts.html.page.ACTIONS);
				_quests = document.getElementById(_this.Consts.html.page.QUESTS);

				_log.textContent = "";
				_logPushNoBreak(_this.Consts.localization.configKeys.INITIAL);
				_inv.innerHTML = LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_INV);
				_actions.innerHTML = LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_ACTS);
				_quests.innerHTML = LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_QUESTS);
			}
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
		_wrapCallback(req3,manager,function(res) {
			_state = _parseState(new COM.Map(res.text).globalNode,"global");
			if (!_state.hasVariable(_this.Consts.definition.STATE_LOCATION)) {
				throw new Error("State definition is missing required association '"+_this.Consts.definition.STATE_LOCATION+"'.");
			}
		});
		var req4 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
		req4.data = {
			folder: _this.Consts.io.paths.COMMON_IMAGES
		};
		_wrapCallback(req4,manager,function(res) {
			_parseImages(new COM.Map(res.text));
		});
		var req5 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
		req5.data = {
			folder: _this.Consts.io.paths.COMMON_ROOMS
		};
		_wrapCallback(req5,manager,function(res) {
			_roomsMap = new COM.Map(res.text);
		});
		var req6 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
		req6.data = {
			folder: _this.Consts.io.paths.COMMON_OBJECTS
		};
		_wrapCallback(req6,manager,function(res) {
			_objectsMap = new COM.Map(res.text);
		});
		var req7 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
		req7.data = {
			folder: _this.Consts.io.paths.COMMON_GRAPH
		};
		_wrapCallback(req7,manager,function(res) {
			_graphMap = new COM.Map(res.text);
		});
	});
})();

