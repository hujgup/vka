/*
Ctrl+F headings:

[ENGINE ERROR]
[DEFAULT APPLIERS]
[ELEMENT ID]
[CONSTS]
[UTIL FUNCTIONS]
[NODE STRUCTURE]
[SCOPE]
[MANAGER]
[LOCALIZATION]
[COMMANDS - ROOT]
[COMMANDS - SCOPE STACK]
[COMMANDS - SCOPING]
[COMMANDS - SET VAR]
[COMMANDS - ACTIONS]
[COMMANDS - LOG]
[COMMANDS - IF]
[COMMANDS - MATH BASE]
[COMMANDS - MATH BASIC OPS]
[COMMANDS - MATH FUNCTIONS BASE]
[COMMANDS - MATH FUNCTIONS]
[COMMANDS - COMPARISON BASE]
[COMMANDS - GETTERS]
[COMMANDS - COMPARISON FUNCTIONS]
[COMMANDS - LIMITS]
[COMMANDS - LIMIT LOGIC]
[NG OBJECT REFERENCES]
[PLAYER ACTIONS]
[VARS]
[STATE WRAPPERS]
[ACTIONS]
[LOAD ASSISTORS]
[INIT]
[MAIN]
[LOADING]
*/

// TODO: Only show "Move", "Examine", and "Interact" actions if there are available sub-actions
// TODO: For each object that reads localization keys from a cfg node, verify that
// 	those keys exist (_this.LocalizationMap.hasString(x) || .hasGroup(x))
// TODO: Load state from io/loadState.php
// TODO: Make sure nothing else is being loaded straight from file.
// TODO: add room audio support

// [ENGINE ERROR]
// Custom error object. "cause" is the value that caused the error, "configStack" is the .cfg element stack the error occured in (if any).
var setupEngineError = function(globalThis) {
	var EngineError = function(message,cause,configStack) {
		this.name = "EngineError";
		this.message = message;
		this.cause = cause; 
		try {
			this.stack = (new Error()).stack;
		} catch (e) {
			this.stack = "";
		}
		this.configStack = Array.isArray(configStack) ? configStack : [];
	};
	EngineError.prototype = Object.create(Error.prototype);
	EngineError.prototype.constructor = EngineError;
	Object.defineProperty(globalThis,"EngineError",{
		value: Object.freeze(EngineError),
		enumerable: false,
		writable: false
	});
};
setupEngineError(this);

Object.defineProperty(this,"Engine",{
	value: Object.freeze(new (function() {
		var _this = this;

		// [DEFAULT APPLIERS]
		// Set default values for args.
		var _generateTypeOfFunc = function(type) {
			return function(value) {
				return typeof value === type;
			};
		};
		var _generateInstanceOfFunc = function(ctor) {
			return function(value) {
				return value instanceof ctor;
			};
		};
		var _defaultArg = function(arg,func,defaultBk) {
			return func(arg) ? arg : defaultBk;
		};
		var _defaultFunc = function(value,func,defaultArg,defaultBk) {
			return func(value) ? value : _defaultArg(defaultArg,func,defaultBk);
		};
		var _defaultTypeOf = function(value,type,defaultArg,defaultBk) {
			var func = _generateTypeOfFunc(type);
			var res;
			if (func(value)) {
				res = value;
			} else if (func(defaultArg)) {
				res = defaultArg;
			} else if (type !== "function" && typeof defaultArg === "function") {
				// Allowing people to only construct values when actually needed
				res = defaultArg();
			} else {
				res = defaultBk;
			}
			return res;
		};
		this.defaultTemplate = function(value,a,defaultArg,defaultBk) {
			var res;
			var type = typeof a;
			switch (type) {
				case "string":
					// Represents a type string
					res = _defaultTypeOf(value,a,defaultArg,defaultBk);
					breal;
				case "function":
					// Represents a complex function
					res = _defaultFunc(value,a,defaultArg,defaultBk);
					break;
				default:
					throw new EngineError("Second argument to function defaultTemplate must be of type 'string' or 'function', was '"+type+"'.",a);
			}
			return res;
		};
		this.defaultAny = function(value,defaultArg) {
			return typeof value !== "undefined" ? value : _defaultArg(defaultArg,function(v) {
				return typeof value !== "undefined";
			},null);
		};
		this.defaultBool = function(bool,defaultArg) {
			return _defaultTypeOf(bool,"boolean",defaultArg,false);
		};
		this.defaultNumber = function(n,defaultArg) {
			return _defaultTypeOf(n,"number",defaultArg,0);
		};
		this.defaultString = function(str,defaultArg) {
			return _defaultTypeOf(str,"string",defaultArg,"");
		};
		this.defaultArray = function(arr,defaultArg) {
			return _defaultFunc(arr,Array.isArray,defaultArg,[]);
		};
		this.defaultFunction = function(func,defaultArg) {
			return _defaultTypeOf(func,"function",defaultArg,function() {
			});
		};
		this.defaultObject = function(obj,defaultArg) {
			return _defaultTypeOf(obj,"object",defaultArg,{});
		};
		this.defaultInstanceOf = function(obj,ctor,defaultArg,fallback) {
			return _defaultFunc(obj,_generateInstanceOfFunc(ctor),defaultArg,_this.defaultAny(fallback));
		};
		this.defaultRegex = function(regex,defaultArg) {
			return _this.defaultInstanceOf(regex,RegExp,defaultArg,new RegExp());
		};

		// [ELEMENT ID]
		// Localization markup element. Stores data about how to translate between localization markup and HTML.
		var ElementId = function(html,id,ele,selfClosing,className,argsApplier) {
			var _hasClassName = typeof className !== "undefined";
			var _className = className;
			var _classId = " "+html.CLASS_OPEN;
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
					res += html.ATTR_CLOSE;
				}
				return res;
			};
			var _applier = _this.defaultFunction(argsApplier,_standardApplier);
			this.id = id;
			this.ele = ele;
			this.selfClosing = _this.defaultBool(selfClosing);
			this.argsApplier = function(args) {
				return _applier(args,_hasClassName,_className,_standardApplier);
			};
		};

		// [CONSTS]
		// Const values (strings and ElementIds).
		Object.defineProperty(this,"Consts",{
			value: Object.freeze(new (function() {
				var _this2 = this;
				this.CONFIG_ENGINE_PREFIX = "@";
				this.LOADING_MSG = "Loading...";
				this.VOID = "";
				this.html = Object.freeze(new (function() {
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
					this.page = Object.freeze(new (function() {
						var _this4 = this;
						this.LOG = "log";
						this.IMAGE = "imageContainer";
						this.INV = "inventory";
						this.ACTIONS = "actions";
						this.QUESTS = "quests";
					})());
				})());
				this.localization = Object.freeze(new (function() {
					var _this3 = this;
					this.OPEN_BLOCK = "[";
					this.CLOSE_BLOCK = "]";
					this.BLOCK_OPEN_PREFIX = "+";
					this.BLOCK_CLOSE_PREFIX = "/";
					this.BLOCK_ARGS_SEPARATOR = " ";
					this.ID_MAP = Object.freeze([
						Object.freeze(new ElementId(_this2.html,"s",_this2.html.INLINE_WRAPPER)),
						Object.freeze(new ElementId(_this2.html,"n",_this2.html.LINE_BREAK,true)),
						Object.freeze(new ElementId(_this2.html,"p",_this2.html.PARAGRAPH)),
						Object.freeze(new ElementId(_this2.html,"H",_this2.html.MAIN_HEADING)),
						Object.freeze(new ElementId(_this2.html,"h",_this2.html.SUBHEADING)),
						Object.freeze(new ElementId(_this2.html,"q",_this2.html.INLINE_WRAPPER,false,"soft")),
						Object.freeze(new ElementId(_this2.html,"i",_this2.html.EMPHASIS)),
						Object.freeze(new ElementId(_this2.html,"l",_this2.html.LINK,false,undefined,function(args,hasClassName,className,standardApplier) {
							args = args.split(_this2.localization.BLOCK_ARGS_SEPARATOR);
							if (args.length === 0) {
								throw new EngineError("l element in localization must have one argument specifying the URL to link to.");
							} else {
								var res = " "+_this.Consts.html.TARGET_FULL+" "+_this.Consts.html.HREF_OPEN+args[0]+_this.Consts.html.ATTR_CLOSE;
								args = args.slice(1).join(_this.Consts.localization.BLOCK_ARGS_SEPARATOR);
								res += standardApplier(args,hasClassName,className,standardApplier);
								return res;
							}
						})),
						Object.freeze(new ElementId(_this2.html,"w",_this2.html.WRAPPER)),
						Object.freeze(new ElementId(_this2.html,"r",_this2.VOID))
					]);
					this.configKeys = Object.freeze(new (function() {
						var _this4 = this;
						this.BREAK = _this2.CONFIG_ENGINE_PREFIX+"break";
						this.INITIAL = _this2.CONFIG_ENGINE_PREFIX+"init";
						this.TITLE_PAGE = _this2.CONFIG_ENGINE_PREFIX+"pageTitle";
						this.TITLE_INV = _this2.CONFIG_ENGINE_PREFIX+"inventoryTitle";
						this.TITLE_ACTS = _this2.CONFIG_ENGINE_PREFIX+"actionsTitle";
						this.TITLE_QUESTS = _this2.CONFIG_ENGINE_PREFIX+"questLogTitle";
						this.INV_ADD = _this2.CONFIG_ENGINE_PREFIX+"inventoryAdd";
						this.INV_REMOVE = _this2.CONFIG_ENGINE_PREFIX+"inventoryRemove";
						this.ACTION_MOVE = _this2.CONFIG_ENGINE_PREFIX+"actionMove";
						this.ACTION_EXAMINE = _this2.CONFIG_ENGINE_PREFIX+"actionExamine";
						this.ACTION_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"actionInteract";
						this.ACTION_NULL = _this2.CONFIG_ENGINE_PREFIX+"actionNull";
						this.ACTION_PERFORM = _this2.CONFIG_ENGINE_PREFIX+"actionPerform";
						this.ACTION_CONTINUE = _this2.CONFIG_ENGINE_PREFIX+"actionContinue";
						this.ACTION_MOVE_PERFORM = _this2.CONFIG_ENGINE_PREFIX+"actionMovePerform";
						this.ACTION_EXAMINE_PERFORM = _this2.CONFIG_ENGINE_PREFIX+"actionExaminePerform";
						this.ACTION_INTERACT_PERFORM = _this2.CONFIG_ENGINE_PREFIX+"actionInteractPerform";
						this.ACTION_ARCHIVE_DELIM = _this2.CONFIG_ENGINE_PREFIX+"actionArchiveDelim";
						this.QUEST_LOG_EMPTY = _this2.CONFIG_ENGINE_PREFIX+"questLogEmpty";
						this.CONCAT_IMAGE_SOURCE = _this2.CONFIG_ENGINE_PREFIX+"concatImageSource";
						this.CONCAT_AUDIO_SOURCE = _this2.CONFIG_ENGINE_PREFIX+"concatAudioSource";
						this.CONCAT_ARG_ID = _this2.CONFIG_ENGINE_PREFIX+"argId";
					})());
				})());
				this.definition = Object.freeze(new (function() {
					var _this3 = this;
					this.NAME = _this2.CONFIG_ENGINE_PREFIX+"name";
					this.DESC = _this2.CONFIG_ENGINE_PREFIX+"desc";
					this.GRAPH_EDGE = _this2.CONFIG_ENGINE_PREFIX+"edge";
					this.GRAPH_ORIGIN = _this2.CONFIG_ENGINE_PREFIX+"from";
					this.GRAPH_DESTINATION = _this2.CONFIG_ENGINE_PREFIX+"to";
					this.GRAPH_EVT_TRAVERSAL = _this2.CONFIG_ENGINE_PREFIX+"onTraversal";
					this.GRAPH_EVT_FIRST_TRAVERSAL = _this2.CONFIG_ENGINE_PREFIX+"onFirstTraversal";
					this.IMAGE_ID = _this2.CONFIG_ENGINE_PREFIX+"id";
					this.IMAGE_ARTIST = _this2.CONFIG_ENGINE_PREFIX+"artist";
					this.IMAGE_SOURCE = _this2.CONFIG_ENGINE_PREFIX+"source";
					this.OBJECT_REMOVABLE = _this2.CONFIG_ENGINE_PREFIX+"removable";
					this.OBJECT_EVT_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"onInteract";
					this.OBJECT_EVT_FIRST_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"onFirstInteract";
					this.ROOM_IMAGE = _this2.CONFIG_ENGINE_PREFIX+"image";
					this.ROOM_CONTENTS = _this2.CONFIG_ENGINE_PREFIX+"contents";
					this.ROOM_APPEND_ACTIONS = _this2.CONFIG_ENGINE_PREFIX+"actionsAdd";
					this.ROOM_OVERRIDE_ACTIONS = _this2.CONFIG_ENGINE_PREFIX+"actionsRemove";
					this.ROOM_CONTINUE_ACTION = _this2.CONFIG_ENGINE_PREFIX+"continue";
					this.STATE_LOCATION = _this2.CONFIG_ENGINE_PREFIX+"location";
					this.ACTION_DO = _this2.CONFIG_ENGINE_PREFIX+"do";
					this.ACTION_SUBACTIONS = _this2.CONFIG_ENGINE_PREFIX+"subActions";
					this.ACTION_PERFORM = _this2.CONFIG_ENGINE_PREFIX+"perform";
				})());
				this.execution = Object.freeze(new (function() {
					var _this3 = this;
					this.ACTION_TELEPORT = _this2.CONFIG_ENGINE_PREFIX+"teleport";
					this.ACTION_MOVE = _this2.CONFIG_ENGINE_PREFIX+"move";
					this.ACTION_MOVE_TO = _this2.CONFIG_ENGINE_PREFIX+"to";
					this.ACTION_EXAMINE = _this2.CONFIG_ENGINE_PREFIX+"examine";
					this.ACTION_EXAMINE_OBJECT = _this2.CONFIG_ENGINE_PREFIX+"object";
					this.ACTION_INTERACT = _this2.CONFIG_ENGINE_PREFIX+"interact";
					this.ACTION_INTERACT_OBJECT = this.ACTION_EXAMINE_OBJECT;
					this.ACTION_LOG = _this2.CONFIG_ENGINE_PREFIX+"log";
					this.ACTION_ROOT = _this2.CONFIG_ENGINE_PREFIX+"root";
					this.ACTION_NULL = _this2.CONFIG_ENGINE_PREFIX+"null";
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
					this.BOOL_FALSE = "false";
				})());
				this.io = Object.freeze(new (function() {
					var _this3 = this;
					this.USER_ID = "app";
					this.ENGINE_ID = "ng";
					this.CONFIG_EXT = ".cfg";
					this.paths = Object.freeze(new (function() {
						var _this4 = this;
						this.SCRIPT_ROOT = "script/";
						this.SCRIPT_USER = _this4.SCRIPT_ROOT+_this3.USER_ID+"/";
						this.SCRIPT_ENGINE = _this4.SCRIPT_ROOT+_this3.ENGINE_ID+"/";
						this.SCRIPT_IO = _this4.SCRIPT_ENGINE+"io/";
						this.COMMON_ROOT = "common/";
						this.COMMON_USER = _this4.COMMON_ROOT+_this3.USER_ID+"/";
						this.COMMON_ENGINE = _this4.COMMON_ROOT+_this3.ENGINE_ID+"/";
						this.COMMON_OBJECTS = _this4.COMMON_ENGINE+"objects/";
						this.COMMON_ROOMS = _this4.COMMON_ENGINE+"rooms/";
						this.COMMON_GRAPH = _this4.COMMON_ENGINE+"graph/";
						this.COMMON_IMAGES = _this4.COMMON_ENGINE+"images/";
						this.COMMON_ACTIONS = _this4.COMMON_ENGINE+"actions/";
						this.STYLE_ROOT = "style/";
						this.STYLE_USER = _this4.STYLE_ROOT+_this3.USER_ID+"/";
						this.GFX_ROOT = "gfx/";
						this.GFX_USER = _this4.GFX_ROOT+_this3.USER_ID+"/";
						this.GFX_ENGINE = _this4.GFX_ROOT+_this3.ENGINE_ID+"/";
						this.GFX_MIPMAP = _this4.GFX_ENGINE+"mipmaps/";
					})());
					this.files = Object.freeze(new (function() {
						var _this4 = this;
						this.SCRIPT_LOAD_STYLING = _this3.paths.SCRIPT_IO+"loadStyling.php";
						this.SCRIPT_LOAD_LOCALIZATION = _this3.paths.SCRIPT_IO+"loadLocalization.php";
						this.SCRIPT_LOAD_IMAGES = _this3.paths.SCRIPT_IO+"loadImages.php";
						this.SCRIPT_LOAD_MISC = _this3.paths.SCRIPT_IO+"loadNg.php";
						this.COMMON_STATE = _this3.paths.COMMON_ENGINE+"state"+_this3.CONFIG_EXT;
					})());
				})());
			})()),
			enumerable: true,
			writable: false
		});

		// [UTIL FUNCTIONS]
		// Functions that don't fit into any other category.
		var _parseVarValue = function(str) {
			var res = str;
			if (typeof str === "string") {
				if (_this.Consts.execution.REGEX_NUMBER.test(res)) {
					res = parseFloat(res);
				} else if (_this.Consts.execution.REGEX_BOOLEAN.test(res)) {
					res = res === _this.Consts.execution.BOOL_TRUE;
				}
			}
			return res;
		};
		var _parseBool = function(str) {
			str = str.toLowerCase();
			if (str === _this.Consts.execution.BOOL_TRUE) {
				return true;
			} else if (str === _this.Consts.execution.BOOL_FALSE) {
				return false;
			} else {
				throw new EngineError("Cannot convert value \""+str+"\" to a Boolean.",str);
			}
		};
		var _htmlToNodes = function(html,container) {
			var root = document.createElement("div");
			root.innerHTML = html;
			while (root.childNodes.length > 0) {
				container.appendChild(root.childNodes[0]);
			}
		};
		var _getConfigStack = function(node) {
			var res = [];
			while (node.parent !== null) { // Excluding the global node
				res.push(node.name.unescapedString);
				node = node.parent;
			}
			res.reverse();
			return res;
		};
		var _objectClone = function(obj) {
			var res = {};
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					res[key] = obj[key];
				}
			}
			return res;
		};
		var _objectCountKeys = function(obj) {
			var res = 0;
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					res++;
				}
			}
			return res;
		};
		this.isEngineKey = function(key) {
			if (key instanceof COM.String) {
				key = key.unescapedString;
			}
			return key.startsWith(_this.Consts.CONFIG_ENGINE_PREFIX);
		};
		this.isPermittedKey = function(key,whitelist) {
			if (key instanceof COM.String) {
				key = key.unescapedString;
			}
			return whitelist.indexOf(key) !== -1;
		};
		this.objectForEach = function(obj,callback) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					callback(key,obj[key],obj);
				}
			}
		};
		this.stripHTML = function(str) {
			var div = document.createElement("div");
			div.innerHTML = str;
			return div.textContent;
		};

		// [NODE STRUCTURE]
		// Methods to enforce certain config node structures.
		this.nodeEnforceNoEntries = function(node) {
			if (node.entriesLength > 0) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected exactly 0 entries, was "+node.entriesLength+".",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceNoAssociations = function(node) {
			if (node.associationsLength > 0) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected exactly 0 associations, was "+node.associationsLength+".",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceNoChildren = function(node) {
			if (node.childrenLength > 0) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected exactly 0 children, was "+node.childrenLength+".",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceAtLeastOneEntry = function(node) {
			if (node.entriesLength < 1) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected at least 1 entry, was "+node.entriesLength+".",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceAtLeastOneChild = function(node) {
			if (node.childrenLength < 1) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected at least 1 child, was "+node.childrenLength+".",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceHasAssociation = function(node,assoc) {
			if (!node.hasAssociation(assoc)) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected an association with key '"+assoc+"', but was not present.",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceHasChild = function(node,child) {
			if (!node.hasChildNamed(child)) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: expected a child named '"+child+"', but was not present.",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceOnlyTheseAssociations = function(node,whitelist) {
			var notSeen = whitelist.slice(0);
			node.associations.forEach(function(key) {
				if (_this.isPermittedKey(key,whitelist)) {
					notSeen.splice(notSeen.indexOf(key),1);
				} else {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: association '"+key+"' not permitted in this context.",node,_getConfigStack(node));
				}
			});
			if (notSeen.length > 0) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: missing required association(s) ["+notSeen.join()+"].",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceAssociationsComplex = function(node,assocs,throwIfNotInList) {
			var notSeen = _objectClone(assocs);
			node.associations.forEach(function(key) {
				if (!assocs.hasOwnProperty(key)) {
					if (throwIfNotInList) {
						throw new EngineError("Node '"+node.name.unescapedString+"' format error: association '"+key+"' not permitted in this context.",node,_getConfigStack(node));
					}
				} else {
					delete notSeen[key];
				}
			});
			if (_objectCountKeys(notSeen) > 0) {
				for (var key in notSeen) {
					if (notSeen.hasOwnProperty(key) && !notSeen[key]) {
						throw new EngineError("Node '"+node.name.unescapedString+"' format error: missing required association '"+key+"'.",node,_getConfigStack(node));
					}
				}
			}
		};
		this.nodeEnforceOnlyTheseChildren = function(node,whitelist) {
			var notSeen = whitelist.slice(0);
			node.children.forEach(function(child) {
				if (_this.isPermittedKey(child.name,whitelist)) {
					notSeen.splice(notSeen.indexOf(child.name.unescapedString),1);
				} else {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: child '"+child.name.unescapedString+"' not permitted in this context.",node,_getConfigStack(node));
				}
			});
			if (notSeen.length > 0) {
				throw new EngineError("Node '"+node.name.unescapedString+"' format error: missing required child(ren) ["+notSeen.join()+"].",node,_getConfigStack(node));
			}
		};
		this.nodeEnforceOnlyOneOfTheseChildren = function(node,whitelist) {
			var seen = [];
			node.children.forEach(function(child) {
				if (!_this.isPermittedKey(child.name,whitelist)) {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: child '"+child.name.unescapedString+"' not permitted in this context.",node,_getConfigStack(node));
				} else if (seen.indexOf(child.name.unescapedString) === -1) {
					seen.push(child.name.unescapedString);
				} else {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: duplicate child '"+child.name.unescapedString+"'.",node,_getConfigStack(node));
				}
			});
		};
		this.nodeEnforceMutexChildren = function(node,whitelist) {
			var seen = false;
			var seenNode;
			node.children.forEach(function(child) {
				if (_this.isPermittedKey(child.name,whitelist)) {
					if (seen) {
						throw new EngineError("Node '"+node.name.unescapedString+"' format error: child nodes '"+child.name.unescapedString+"' and '"+seenNode.name.unescapedString+"' are mutually exclusive.",node,_getConfigStack(node));
					} else {
						seen = true;
						seenNode = child;
					}
				}
			});
		};
		this.nodeEnforceChildrenComplex = function(node,children,throwIfNotInList,throwIfDuplicate) {
			throwIfDuplicate = _this.defaultBool(throwIfDuplicate,true);
			var notSeen = _objectClone(children);
			node.children.forEach(function(child) {
				if (!children.hasOwnProperty(child.name.unescapedString)) {
					if (throwIfNotInList) {
						throw new EngineError("Node '"+node.name.unescapedString+"' format error: child node '"+child.name.unescapedString+"' not permitted in this context.",node,_getConfigStack(node));
					}
				} else if (notSeen.hasOwnProperty(child.name.unescapedString)) {
					delete notSeen[child.name.unescapedString];
				} else if (throwIfDuplicate) {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: child node '"+child.name.unescapedString+"' appears more than once.",node,_getConfigStack(node));
				}
			});
			if (_objectCountKeys(notSeen) > 0) {
				for (var key in notSeen) {
					if (notSeen.hasOwnProperty(key) && !notSeen[key]) {
						throw new EngineError("Node '"+node.name.unescapedString+"' format error: missing required association '"+notSeen[key]+"'.",node,_getConfigStack(node));
					}
				}
			}
		};
		this.nodeEnforceNoneOfTheseChildren = function(node,children,reason) {
			children.forEach(function(child) {
				if (node.hasChildNamed(child)) {
					var msg = "Node '"+node.name.unescapedString+"' format error: child '"+child+"' is not permitted in this context.";
					if (typeof reason !== "undefined") {
						msg += " Reason: "+reason;
					}
					throw new EngineError(msg,node,_getConfigStack(node));
				}
			});
		};
		this.nodeEnforceNoEngineEntries = function(node,whitelist) {
			whitelist = _this.defaultArray(whitelist);
			node.entries.forEach(function(entry) {
				if (_isEngineKey(entry) && !_this.isPermittedKey(entry,whitelist)) {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: engine-prefixed entry '"+entry.unescapedString+"' not permitted in this context.",node,_getConfigStack(node));
				}
			});
		};
		this.nodeEnforceNoEngineAssociations = function(node,whitelist) {
			whitelist = _this.defaultArray(whitelist);
			node.associations.forEach(function(key) {
				if (_isEngineKey(key) && !_this.isPermittedKey(entry,whitelist)) {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: engine-prefixed association '"+key.unescapedString+"' not permitted in this context.",node,_getConfigStack(node));
				}
			});
		};
		this.nodeEnforceNoEngineChildren = function(node,whitelist) {
			whitelist = _this.defaultArray(whitelist);
			node.children.forEach(function(child) {
				if (_this.isEngineKey(child.name) && !_this.isPermittedKey(entry,whitelist)) {
					throw new EngineError("Node '"+node.name.unescapedString+"' format error: engine-prefixed child node '"+child.name.unescapedString+"' not permitted in this context.",node,_getConfigStack(node));
				}
			});
		};

		// [SCOPE]
		// State scope object. Controls access to state variables.
		var Scope = function(name,engineAssocWhitelist,engineChildWhitelist) {
			var _this2 = this;
			var _vars = {};
			var _children = [];
			var _assocWhitelist = _this.defaultArray(engineAssocWhitelist);
			var _childWhitelist = _this.defaultArray(engineChildWhitelist);
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
				if (_this.isEngineKey(v) && !_this.isPermittedKey(v,_assocWhitelist)) {
					throw new EngineError("Engine variable '"+v+"' is not permitted in this context.",v);
				}
				_vars[v] = _parseVarValue(value);
			});
			_defineMethod("hasVariable",function(v) {
				return typeof _this2.getVariable(v) !== "undefined";
			});
			_defineMethod("getVariable",function(v) {
				var scope = _this2._getVarScope(v);
				return scope !== null ? scope._getVar(v) : undefined;
			});
			_defineMethod("setVariable",function(v,value) {
				var scope = _this2._getVarScope(v);
				if (scope !== null) {
					scope._setVar(v,value);
				} else {
					throw new EngineError("Variable '"+v+"' is undefined.",v);
				}
			});
			_defineMethod("defineVariable",function(v,value) {
				_this2._setVar(v,value);
			});
			_defineMethod("hasChild",function(child,deep) {
				deep = _this.defaultBool(deep);
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
				deep = _this.defaultBool(deep);
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
				if (_this.isEngineKey(child.name) && !_this.isPermittedKey(child.name,_childWhitelist)) {
					throw new EngineError("Child '"+child.name.unescapedString+"' not permitted in this context.");
				}
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

		// [MANAGER]
		// Load manager object. Controls the display of load percentages and errors, as well as what to do when loading is done.
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
			this.error = function(e) {
				var msg = "";
				msg += e.name+": "+e.message+"\n"+e.stack;
				try {
					msg += "\nThrown because of "+e.cause;
				} catch (e2) {
				}
				var stack = "";
				if (Array.isArray(e.configStack)) {
					//e.configStack.reverse();
					stack = e.configStack.join(" -> ");
					msg += "\nConfig stack: "+stack;
				}
				console.error(msg);
				console.info("Cause:",e.cause);
				var toPush = " "+e.message;
				if (stack !== "") {
					toPush += " ("+stack+")";
				}
				_errors.push(toPush);
				document.title = "Error";
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

		// [LOCALIZATION]
		// Map for getting and setting localized string values by ID.
		Object.defineProperty(this,"LocalizationMap",{
			value: new (function() {
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
				var _validNgStrings = [];
				var _validNgGroups = [];
				var _externLocked = false;

				_defineMethod("defineNgString",function(key) {
					if (_externLocked) {
						throw new EngineError("User scripts cannot define engine strings.",_externLocked);
					}
					_validNgStrings.push(key);
				});
				_defineMethod("defineNgGroup",function(key) {
					if (_externLocked) {
						throw new EngineError("User scripts cannot define engine groups.",_externLocked);
					}
					_validNgGroups.push(key);
				});
				_defineMethod("externLock",function() {
					_externLocked = true;
				});
				_defineMethod("isAllowedNgString",function(key) {
					if (!_this.isEngineKey(key)) {
						throw new EngineError("Key '"+key+"' is not a valid engine key.",key);
					}
					return _this.isPermittedKey(key,_validNgStrings);
				});
				_defineMethod("isAllowedNgGroup",function(key) {
					if (!_this.isEngineKey(key)) {
						throw new EngineError("Key '"+key+"' is not a valid engine key.",key);
					}
					return _this.isPermittedKey(key,_validNgGroups);
				});
				_defineMethod("validateNgVars",function() {
					for (var i = 0; i < _validNgStrings.length; i++) {
						if (!_this2.hasString(_validNgStrings[i])) {
							throw new EngineError("Localization missing required association '"+_validNgStrings[i]+"'.",_this2);
						}
					}
					for (var i = 0; i < _validNgGroups.length; i++) {
						if (!_this2.hasGroup(_validNgGroups[i])) {
							throw new EngineError("Localization missing required child '"+_validNgGroups[i]+"'.",_this2);
						}
					}
				});
				_defineMethod("forEachString",function(callback) {
					var value;
					for (var key in _strings) {
						if (_strings.hasOwnProperty(key)) {
							value = _strings[key];
							callback(key,value,_this.isEngineKey(key));
						}
					}
				});
				_defineMethod("forEachGroup",function(callback) {
					var value;
					for (var key in _groups) {
						if (_groups.hasOwnProperty(key)) {
							value = _groups[key];
							callback(key,value,_this.isEngineKey(key));
						}
					}
				});
				_defineMethod("hasString",function(key) {
					return _strings.hasOwnProperty(key);
				});
				_defineMethod("getString",function(key) {
					return _this2.hasString(key) ? _strings[key] : undefined;
				});
				_defineMethod("setString",function(key,value) {
					if (_this.isEngineKey(key)) {
						if (!_this2.isAllowedNgString(key)) {
							throw new EngineError("Cannot define localization string with key '"+key+"': that is not a permitted engine key for strings.",key);
						}
					}
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
									throw new EngineError(context[0].toUpperCase()+context.substring(1)+" tag "+block.id+" in a localization file cannot be closed because it is self-closing.",block.id);
								} else {
									callback(id);
									return;
								}
							}
						}
						throw new EngineError("Unknown "+context+" tag "+_this.Consts.localization.BLOCK_OPEN_PREFIX+block.id+" in a localization file.",block.id);
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
									if (id.ele !== _this.Consts.VOID) {
										res += _this.Consts.html.TAG_OPEN+id.ele+_formatArgs(id);
										if (id.selfClosing) {
											res += _this.Consts.html.TAG_SELF_CLOSING;
										} else {
											res += _this.Consts.html.TAG_CLOSE;
										}
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
									if (id.ele !== _this.Consts.VOID) {
										res += _this.Consts.html.CLOSE_TAG_PREFIX+id.ele+_this.Consts.html.TAG_CLOSE;
									}
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
					if (_this.isEngineKey(key)) {
						if (!_this2.isAllowedNgGroup(key)) {
							throw new EngineError("Cannot define localization group with key '"+key+"': that is not a permitted engine key for groups.",key);
						}
					}
					_groups[key] = value;
				});
			})(),
			writable: false,
			enumerable: true
		});
		var LocalizedConcat = function(id,node) {
			_this.nodeEnforceNoChildren(node);
			_this.nodeEnforceAtLeastOneEntry(node);
			_this.nodeEnforceOnlyTheseAssociations(node,[_this.Consts.localization.configKeys.CONCAT_ARG_ID]);

			var _this2 = this;
			var _argId = node.getAssociation(_this.Consts.localization.configKeys.CONCAT_ARG_ID).unescapedString;
			var _keys = node.entries.map(function(entry) {
				return entry.unescapedString;
			});
			this.id = id;
			this.invoke = function(arg) {
				var res = "";
				_keys.forEach(function(key) {
					if (key === _argId) {
						res += arg;
					} else {
						res += _this.LocalizationMap.getString(key);
					}
				});
				return res;
			};
		};

		// [COMMANDS - ROOT]
		// Engine command root object. Controls adding child commands, exception wrapping, enforcing conditions on nodes, and execution.
		var EngineCommand = function(parent,node) {
			var _this2 = this;
			var _commands = [];
			this.parent = parent;
			this.nodeName = null;
			this.ngCatch = function(callback) {
				try {
					callback();
				} catch (e) {
					if (!(e instanceof EngineError) && typeof node !== "undefined") {
						if (typeof e.configStack === "undefined" || e.configStack.length === 0) {
							e.configStack = _getConfigStack(node);
						} else {
							e = new EngineError(e.message,this,_getConfigStack(node));
						}
					}
					throw e;
				}
			};
			this.push = function(cmd) {
				_commands.push(cmd);
			};
			this.forEach = function(callback) {
				for (var i = 0; i < _commands.length; i++) {
					callback(_commands[i]);
				}
			};

			this.enforceNoEntries = function(node) {
				_this.nodeEnforceNoEntries(node);
			};
			this.enforceNoAssociations = function(node) {
				_this.nodeEnforceNoAssociations(node);
			};
			this.enforceNoChildren = function(node) {
				_this.nodeEnforceNoChildren(node);
			};
			this.enforceAtLeastOneEntry = function(node) {
				_this.nodeEnforceAtLeastOneEntry(node);
			};
			this.enforceAtLeastOneChild = function(node) {
				_this.nodeEnforceAtLeastOneChild(node);
			};
			this.enforceHasAssociation = function(node,assoc) {
				_this.nodeEnforceHasAssociation(node,assoc);
			};
			this.enforceHasChild = function(node,child) {
				_this.nodeEnforceHasChild(node,child);
			};
			this.enforceOnlyTheseAssociations = function(node,whitelist) {
				_this.nodeEnforceOnlyTheseAssociations(node,whitelist);
			};
			this.enforceOnlyTheseChildren = function(node,whitelist) {
				_this.nodeEnforceOnlyTheseChildren(node,whitelist);
			};
			this.enforceOnlyOneOfTheseChildren = function(node,whitelist) {
				_this.nodeEnforceOnlyOneOfTheseChildren(node,whitelist);
			};

			this.internalExecute = function(context) {
				this.forEach(function(cmd) {
					cmd.execute(context);
				});
			};
			this.execute = function(context) {
				var creator = function() {
					return {
						stack: new EngineCommand.ScopeStack(_state),
						logBroken: false
					};
				};
				if (typeof context === "boolean") {
					var temp = creator();
					temp.logBroken = context;
					context = temp;
				} else {
					context = _this.defaultObject(context,creator);
				}
				var res;
				this.ngCatch(function() {
					res = _this2.internalExecute.call(_this2,context);
				});
				return res;
			};
			this.attemptMath = function(child,name) {
				var res;
				switch (name) {
					case _this.Consts.execution.MATH_ADD:
						res = new MathAddCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_SUBTRACT:
						res = new MathSubtractCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_MULTIPLY:
						res = new MathMultiplyCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_DIVIDE:
						res = new MathDivideCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_MOD:
						res = new MathModCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_EXP:
						res = new MathExpCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_LN:
						res = new MathLnCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_LOG2:
						res = new MathLog2Command(_this2,child);
						break;
					case _this.Consts.execution.MATH_LOG10:
						res = new MathLog10Command(_this2,child);
						break;
					case _this.Consts.execution.MATH_ROUND:
						res = new MathRoundCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_FLOOR:
						res = new MathFloorCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_CEILING:
						res = new MathCeilingCommand(_this2,child);
						break;
					case _this.Consts.execution.MATH_TRUNCATE:
						res = new MathTruncateCommand(_this2,child);
						break;
				}
				return res;
			};
			this.attemptScoping = function(child,name) {
				if (_this.isEngineKey(name)) {
					throw new EngineError("Unexpected engine-defined child \""+name+"\".",name,_getConfigStack(child));
				} else {
					return new ScopingCommand(_this2,child);
				}
			};
			if (typeof node !== "undefined") {
				this.ngCatch(function() {
					_this2.nodeName = node.name.unescapedString;
					_this2.enforceNoEntries(node);
					_this2.enforceNoAssociations(node);
					var cmd;
					node.children.forEach(function(child) {
						var name = child.name.unescapedString;
						console.log(name,_this.Consts.execution.STATE_SET_VAR_BY_LITERAL,name === _this.Consts.execution.STATE_SET_VAR_BY_LITERAL);
						switch (name) {
							case _this.Consts.execution.FLOW_IF:
								cmd = new IfCommand(_this2,child);
								break;
							case _this.Consts.execution.STATE_SET_VAR:
								cmd = new SetVarCommand(_this2,child);
								break;
							case _this.Consts.execution.ACTION_LOG:
								cmd = new LogCommand(_this2,child);
								break;
							case _this.Consts.execution.ACTION_TELEPORT:
								cmd = new TeleportCommand(_this2,child);
								break;
							case _this.Consts.execution.ACTION_MOVE:
								cmd = new MoveCommand(_this2,child);
								break;
							case _this.Consts.execution.ACTION_EXAMINE:
								cmd = new ExamineCommand(_this2,child);
								break;
							case _this.Consts.execution.ACTION_INTERACT:
								cmd = new InteractCommand(_this2,child);
								break;
							case _this.Consts.execution.STATE_SET_VAR_BY_VAR:
								cmd = new SetVarByVarCommand(_this2,child);
								break;
							case _this.Consts.execution.STATE_SET_VAR_BY_LITERAL:
								cmd = new SetVarByLiteralCommand(_this2,child);
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
				});
			}
		};
		// [COMMANDS - SCOPE STACK]
		// Controls the state scoping stack.
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
		EngineCommand.NO_OP = new EngineCommand(null);
		EngineCommand.prototype.constructor = EngineCommand;
		// [COMMANDS - SCOPING]
		// Controls moving the scoping stack into a child scope.
		var ScopingCommand = function(parent,node) {
			var firstNonScopingParent = parent;
			// Preventing infinite recursion in cases where parent is also a ScopingCommand
			while (firstNonScopingParent instanceof ScopingCommand) {
				firstNonScopingParent = firstNonScopingParent.parent;
			}
			console.log("scope -> this node",node.name.unescapedString);
			console.log("scope -> immediate parent",parent.nodeName);
			console.log("scope -> first non-scoping parent",firstNonScopingParent.nodeName,firstNonScopingParent);
			firstNonScopingParent.constructor.call(this,parent,node);
			var _this2 = this;
			var _stdExec = this.internalExecute;
			this.internalExecute = function(context) {
				var child = context.stack.peek().getChildNamed(_this2.nodeName);
				if (typeof child !== "undefined") {
					context.stack.push(child);
					var res = _stdExec.call(_this2,context);
					context.stack.pop();
					return res;
				} else {
					throw new EngineError("Scope '"+context.stack.peek().name.unescapedString+"' does not have a child '"+_this2.nodeName+"'.",context.stack.peek(),_getConfigStack(node));
				}
			};
		};
		ScopingCommand.prototype = Object.create(EngineCommand.prototype);
		ScopingCommand.prototype.constructor = ScopingCommand;
		// [COMMANDS - SET VAR]
		// Controls updating the value of a state variable.
		var SetVarCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _assocs = [];
			this.set = function(entry,context) {
			};
			this.internalExecute = function(context) {
				_assocs.forEach(function(entry) {
					_this2.set(entry,context);
				});
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoChildren(node);
				node.associations.forEach(function(key,value) {
					_assocs.push({
						key: key,
						value: value
					});
				});
			});
		};
		SetVarCommand.prototype = Object.create(EngineCommand.prototype);
		SetVarCommand.prototype.constructor = SetVarCommand;
		var SetVarByVarCommand = function(parent,node) {
			SetVarCommand.call(this,parent,node);
			this.set = function(entry,context) {
				context.stack.peek().setVariable(entry.key,context.getVariable(entry.value));
			};
		};
		SetVarByVarCommand.prototype = Object.create(SetVarCommand.prototype);
		SetVarByVarCommand.prototype.constructor = SetVarByVarCommand;
		var SetVarByLiteralCommand = function(parent,node) {
			SetVarCommand.call(this,parent,node);
			this.set = function(entry,context) {
				context.stack.peek().setVariable(entry.key,entry.value);
			};
		};
		SetVarByLiteralCommand.prototype = Object.create(SetVarCommand.prototype);
		SetVarByLiteralCommand.prototype.constructor = SetVarByLiteralCommand;
		// [COMMANDS - ACTIONS]
		// Commands that involve player-doable actions.
		var TeleportCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _to;
			this.internalExecute = function(context) {
				_teleportPlayer(_to);
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoChildren(node);
				_this2.enforceOnlyTheseAssociations(node,[_this.Consts.execution.ACTION_MOVE_TO]);
				_to = node.getAssociation(_this.Consts.execution.ACTION_MOVE_TO);
				if (typeof _to !== "undefined") {
					_to = _to.unescapedString;
				} else {
					throw new EngineError(_this.Consts.execution.ACTION_TELEPORT+": Required association '"+_this.Consts.execution.ACTION_MOVE_TO+"' is undefined.",node,_getConfigStack(node));
				}
			});
		};
		TeleportCommand.prototype = Object.create(EngineCommand.prototype);
		TeleportCommand.prototype.constructor = TeleportCommand;
		var MoveCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _to;
			this.internalExecute = function(context) {
				_movePlayer(_to,context);
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoChildren(node);
				_this2.enforceOnlyTheseAssociations(node,[_this.Consts.execution.ACTION_MOVE_TO]);
				_to = node.getAssociation(_this.Consts.execution.ACTION_MOVE_TO);
				if (typeof _to !== "undefined") {
					_to = _to.unescapedString;
				} else {
					throw new EngineError(_this.Consts.execution.ACTION_MOVE+": Required association '"+_this.Consts.execution.ACTION_MOVE_TO+"' is undefined.",node,_getConfigStack(node));
				}
			});
		};
		MoveCommand.prototype = Object.create(EngineCommand.prototype);
		MoveCommand.prototype.constructor = MoveCommand;
		var ExamineCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _object;
			this.internalExecute = function(context) {
				_examineObject(_object,!context.logBroken);
				context.logBroken = true;
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoChildren(node);
				_this2.enforceOnlyTheseAssociations(node,[_this.Consts.execution.ACTION_EXAMINE_OBJECT]);
				_object = node.getAssociation(_this.Consts.execution.ACTION_EXAMINE_OBJECT);
				if (typeof _object !== "undefined") {
					_object = _object.unescapedString;
				} else {
					throw new EngineError(_this.Consts.execution.ACTION_EXAMINE+": Required association '"+_this.Consts.execution.ACTION_EXAMINE_OBJECT+"' is undefined.",node,_getConfigStack(node));
				}
			});
		};
		ExamineCommand.prototype = Object.create(EngineCommand.prototype);
		ExamineCommand.prototype.constructor = ExamineCommand;
		var InteractCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _object;
			this.internalExecute = function(context) {
				_interactWithObject(_object,context);
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoChildren(node);
				_this2.enforceOnlyTheseAssociations(node,[_this.Consts.execution.ACTION_INTERACT_OBJECT]);
				_object = node.getAssociation(_this.Consts.execution.ACTION_INTERACT_OBJECT);
				if (typeof _object !== "undefined") {
					_object = _object.unescapedString;
				} else {
					throw new EngineError(_this.Consts.execution.ACTION_INTERACT+": Required association '"+_this.Consts.execution.ACTION_INTERACT_OBJECT+"' is undefined.",node,_getConfigStack(node));
				}
			});
		};
		InteractCommand.prototype = Object.create(EngineCommand.prototype);
		InteractCommand.prototype.constructor = InteractCommand;
		// [COMMANDS - LOG]
		var LogCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _strings = [];
			var _log = function(context,id) {
				if (context.logBroken) {
					_this.logPushNoBreak(id);
				} else {
					_this.logPush(id);
				}
				context.logBroken = true;
			};
			this.internalExecute = function(context) {
				_strings.forEach(function(id) {
					_log(context,id);
				});
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoAssociations(node);
				_this2.enforceNoChildren(node);
				_this2.enforceAtLeastOneEntry(node);
				node.entries.forEach(function(entry) {
					_strings.push(entry.unescapedString);
				});
			});
		};
		LogCommand.prototype = Object.create(EngineCommand.prototype);
		LogCommand.prototype.constructor = LogCommand;
		// [COMMANDS - IF]
		// Controls conditional branching.
		var IfCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _limit;
			var _then;
			var _else;
			this.internalExecute = function(context) {
				if (_limit.execute(context)) {
					_then.execute(context);
				} else {
					_else.execute(context);
				}
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoAssociations(node);
				_this2.enforceHasChild(node,_this.Consts.execution.FLOW_CONDITION);
				_this2.enforceHasChild(node,_this.Consts.execution.FLOW_THEN);
				_this2.enforceOnlyOneOfTheseChildren(node,[_this.Consts.execution.FLOW_CONDITION,_this.Consts.execution.FLOW_THEN,_this.Consts.execution.FLOW_ELSE]);
				_limit = new AndCommand(_this2,node.getChildNamed(_this.Consts.execution.FLOW_CONDITION));
				_then = new EngineCommand(_this2,node.getChildNamed(_this.Consts.execution.FLOW_THEN));
				_else = new EngineCommand(_this2,node.getChildNamed(_this.Consts.execution.FLOW_ELSE));
			});
		};
		IfCommand.prototype = Object.create(EngineCommand.prototype);
		IfCommand.prototype.constructor = IfCommand;
		// [COMMANDS - MATH BASE]
		// Controls how mathematical operations work.
		var MathCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _out;
			this.initializeValue = function(value) {
				return value;
			};
			this.execCallback = function(current,value) {
			};
			this.internalExecute = function(context) {
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
				} else {
					throw new EngineError(_this2.nodeName+": no values to perform operation on.",this,_getConfigStack(node));
				}
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceOnlyTheseAssociations(node,[_this.Consts.execution.OP_OUTPUT]);
				node.children.forEach(function(child) {
					var name = child.name.unescapedString;
					var cmd;
					switch (name) {
						case _this.Consts.execution.OP_VARS:
							cmd = new ComparisonVarsCommand(_this2,child);
							break;
						case _this.Consts.execution.OP_LITERALS:
							cmd = new ComparisonLiteralsCommand(_this2,child);
							break;
						default:
							cmd = _this2.attemptScoping(child,name);
							break;
					}
					_this2.push(cmd);
				});
				_out = node.getAssociation(_this.Consts.execution.OP_OUTPUT).unescapedString;
			});
		};
		MathCommand.prototype = Object.create(EngineCommand.prototype);
		MathCommand.prototype.constructor = MathCommand;
		// [COMMANDS - MATH BASIC OPS]
		// Controls basic arithmetic operations.
		var MathAddCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return current + value;
			};
		};
		MathAddCommand.prototype = Object.create(MathCommand.prototype);
		MathAddCommand.prototype.constructor = MathAddCommand;
		var MathSubtractCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return current - value;
			};
		};
		MathSubtractCommand.prototype = Object.create(MathCommand.prototype);
		MathSubtractCommand.prototype.constructor = MathSubtractCommand;
		var MathMultiplyCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return current*value;
			};
		};
		MathMultiplyCommand.prototype = Object.create(MathCommand.prototype);
		MathMultiplyCommand.prototype.constructor = MathMultiplyCommand;
		var MathDivideCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return current/value;
			};
		};
		MathDivideCommand.prototype = Object.create(MathCommand.prototype);
		MathDivideCommand.prototype.constructor = MathDivideCommand;
		var MathModCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return current%value;
			};
		};
		MathModCommand.prototype = Object.create(MathCommand.prototype);
		MathModCommand.prototype.constructor = MathModCommand;
		var MathExpCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return Math.pow(current,value);
			};
		};
		MathExpCommand.prototype = Object.create(MathCommand.prototype);
		MathExpCommand.prototype.constructor = MathExpCommand;
		// [COMMANDS - MATH FUNCTIONS BASE]
		// Base object for single-input math functions.
		var MathSingleCommand = function(parent,node) {
			MathCommand.call(this,parent,node);
			this.execCallback = function(current,value) {
				return this.initializeValue(value);
			};
		};
		MathSingleCommand.prototype = Object.create(MathCommand.prototype);
		MathSingleCommand.prototype.constructor = MathSingleCommand;
		// [COMMANDS - MATH FUNCTIONS]
		// Controls functional/complex arithmetic operations.
		var MathLnCommand = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.log(value);
			};
		};
		MathLnCommand.prototype = Object.create(MathSingleCommand.prototype);
		MathLnCommand.prototype.constructor = MathLnCommand;
		var MathLog2Command = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.log2(value);
			};
		};
		MathLog2Command.prototype = Object.create(MathSingleCommand.prototype);
		MathLog2Command.prototype.constructor = MathLog2Command;
		var MathLog10Command = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.log10(value);
			};
		};
		MathLog10Command.prototype = Object.create(MathSingleCommand.prototype);
		MathLog10Command.prototype.constructor = MathLog10Command;
		var MathRoundCommand = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.round(value);
			};
		};
		MathRoundCommand.prototype = Object.create(MathSingleCommand.prototype);
		MathRoundCommand.prototype.constructor = MathRoundCommand;
		var MathFloorCommand = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.floor(value);
			};
		};
		MathFloorCommand.prototype = Object.create(MathSingleCommand.prototype);
		MathFloorCommand.prototype.constructor = MathFloorCommand;
		var MathCeilingCommand = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.ceil(value);
			};
		};
		MathCeilingCommand.prototype = Object.create(MathSingleCommand.prototype);
		MathCeilingCommand.prototype.constructor = MathCeilingCommand;
		var MathTruncateCommand = function(parent,node) {
			MathSingleCommand.call(this,parent,node);
			this.initializeValue = function(value) {
				return Math.trunc(value);
			};
		};
		MathTruncateCommand.prototype = Object.create(MathSingleCommand.prototype);
		MathTruncateCommand.prototype.constructor = MathTruncateCommand;
		// [COMMANDS - COMPARISON BASE]
		// Controls the comparing of values.
		var ComparisonCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			this.execCallback = function(cmp,value) {
			};
			this.internalExecute = function(context) {
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
				if (values.length > 0) {
					var res = true;
					var cmp = values[0];
					for (var i = 1; res && i < values.length; i++) {
						res = this.execCallback(cmp,values[i]);
					}
					return res;
				} else {
					throw new EngineError(this.nodeName+": no values to compare.",this,_getConfigStack(node));
				}
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoAssociations(node);
				node.children.forEach(function(child) {
					var name = child.name.unescapedString;
					var cmd;
					switch (name) {
						case _this.Consts.execution.OP_VARS:
							cmd = new ComparisonVarsCommand(_this2,child);
							break;
						case _this.Consts.execution.OP_LITERALS:
							cmd = new ComparisonLiteralsCommand(_this2,child);
							break;
						default:
							cmd = _this2.attemptScoping(child,name);
							break;
					}
					_this2.push(cmd);
				});
			});
		};
		ComparisonCommand.prototype = Object.create(EngineCommand.prototype);
		ComparisonCommand.prototype.constructor = ComparisonCommand;
		// [COMMANDS - GETTERS]
		// Controls getting the values in variables or literals.
		var ComparisonVarsCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _vars = [];
//			this.internalExecute = function(cmp,value) {
			this.internalExecute = function(context) {
				var res = [];
				for (var i = 0; i < _vars.length; i++) {
					res.push(context.stack.peek().getVariable(_vars[i]));
				}
				return res;
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoAssociations(node);
				_this2.enforceNoChildren(node);
				node.entries.forEach(function(entry) {
					_vars.push(entry.unescapedString);
				});
			});
		};
		ComparisonVarsCommand.prototype = Object.create(EngineCommand.prototype);
		ComparisonVarsCommand.prototype.constructor = ComparisonVarsCommand;
		var ComparisonLiteralsCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			var _literals = [];
			this.internalExecute = function(context) {
				return _literals;
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoAssociations(node);
				_this2.enforceNoChildren(node);
				node.entries.forEach(function(entry) {
					_literals.push(_parseVarValue(entry.unescapedString));
				});
			});
		};
		ComparisonLiteralsCommand.prototype = Object.create(EngineCommand.prototype);
		ComparisonLiteralsCommand.prototype.constructor = ComparisonLiteralsCommand;
		// [COMMANDS - COMPARISON FUNCTIONS]
		// Controls basic value comparison.
		var EqualsCommand = function(parent,node) {
			ComparisonCommand.call(this,parent,node);
			this.execCallback = function(cmp,value) {
				return cmp === value;
			};
		};
		EqualsCommand.prototype = Object.create(ComparisonCommand.prototype);
		EqualsCommand.prototype.constructor = EqualsCommand;
		var NotEqualsCommand = function(parent,node) {
			ComparisonCommand.call(this,parent,node);
			this.execCallback = function(cmp,value) {
				return cmp !== value;
			};
		};
		NotEqualsCommand.prototype = Object.create(ComparisonCommand.prototype);
		NotEqualsCommand.prototype.constructor = NotEqualsCommand;
		var LessThanCommand = function(parent,node) {
			ComparisonCommand.call(this,parent,node);
			this.execCallback = function(cmp,value) {
				return cmp < value;
			};
		};
		LessThanCommand.prototype = Object.create(ComparisonCommand.prototype);
		LessThanCommand.prototype.constructor = LessThanCommand;
		var GreaterThanCommand = function(parent,node) {
			ComparisonCommand.call(this,parent,node);
			this.execCallback = function(cmp,value) {
				return cmp > value;
			};
		};
		GreaterThanCommand.prototype = Object.create(ComparisonCommand.prototype);
		GreaterThanCommand.prototype.constructor = GreaterThanCommand;
		var LessThanOrEqualToCommand = function(parent,node) {
			ComparisonCommand.call(this,parent,node);
			this.execCallback = function(cmp,value) {
				return cmp <= value;
			};
		};
		LessThanOrEqualToCommand.prototype = Object.create(ComparisonCommand.prototype);
		LessThanOrEqualToCommand.prototype.constructor = LessThanOrEqualToCommand;
		var GreaterThanOrEqualToCommand = function(parent,node) {
			ComparisonCommand.call(this,parent,node);
			this.execCallback = function(cmp,value) {
				return cmp >= value;
			};
		};
		GreaterThanOrEqualToCommand.prototype = Object.create(ComparisonCommand.prototype);
		GreaterThanOrEqualToCommand.prototype.constructor = GreaterThanOrEqualToCommand;
		// [COMMANDS - LIMITS]
		// Base class for objects that may return true or false.
		var LimitCommand = function(parent,node) {
			EngineCommand.call(this,parent);
			var _this2 = this;
			this.count = function(context) {
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
				return res;
			};
			this.ngCatch(function() {
				_this2.nodeName = node.name.unescapedString;
				_this2.enforceNoEntries(node);
				_this2.enforceNoAssociations(node);
				node.children.forEach(function(child) {
					var name = child.name.unescapedString;
					var cmd;
					switch (name) {
						case _this.Consts.execution.LOGIC_AND:
							cmd = new AndCommand(_this2,child);
							break;
						case _this.Consts.execution.LOGIC_OR:
							cmd = new OrCommand(_this2,child);
							break;
						case _this.Consts.execution.LOGIC_NAND:
							cmd = new NandCommand(_this2,child);
							break;
						case _this.Consts.execution.LOGIC_NOR:
						case _this.Consts.execution.LOGIC_NOR_ALIAS:
							cmd = new NorCommand(_this2,child);
							break;
						case _this.Consts.execution.LOGIC_XOR:
							cmd = new XorCommand(_this2,child);
							break;
						case _this.Consts.execution.LOGIC_XNOR:
							cmd = new XnorCommand(_this2,child);
							break;
						case _this.Consts.execution.LOGIC_MUTEX:
							cmd = new MutexCommand(_this2,child);
							break;
						case _this.Consts.execution.CMP_EQ:
							cmd = new EqualsCommand(_this2,child);
							break;
						case _this.Consts.execution.CMP_NEQ:
							cmd = new NotEqualsCommand(_this2,child);
							break;
						case _this.Consts.execution.CMP_LT:
							cmd = new LessThanCommand(_this2,child);
							break;
						case _this.Consts.execution.CMP_GT:
							cmd = new GreaterThanCommand(_this2,child);
							break;
						case _this.Consts.execution.CMP_LTEQ:
							cmd = new LessThanOrEqualToCommand(_this2,child);
							break;
						case _this.Consts.execution.CMP_GTEQ:
							cmd = new GreaterThanOrEqualToCommand(_this2,child);
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
			});
		};
		LimitCommand.Data = function() {
			this.trueCount = 0;
			this.totalCount = 0;
		};
		LimitCommand.prototype = Object.create(EngineCommand.prototype);
		LimitCommand.prototype.constructor = LimitCommand;
		// [COMMANDS - LIMIT LOGIC]
		// Limits that emulate basic logical operations.
		var AndCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				console.log(this.nodeName);
				var data = this.count(context);
				return data.trueCount === data.totalCount;
			};
		};
		AndCommand.prototype = Object.create(LimitCommand.prototype);
		AndCommand.prototype.constructor = AndCommand;
		var OrCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				return this.count(context).trueCount > 0;
			};
		};
		OrCommand.prototype = Object.create(LimitCommand.prototype);
		OrCommand.prototype.constructor = OrCommand;
		var NandCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				var data = this.count(context);
				return data.trueCount !== data.totalCount;
			};
		};
		NandCommand.prototype = Object.create(LimitCommand.prototype);
		NandCommand.prototype.constructor = NandCommand;
		var NorCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				return this.count(context).trueCount === 0;
			};
		};
		NorCommand.prototype = Object.create(LimitCommand.prototype);
		NorCommand.prototype.constructor = NorCommand;
		var XorCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				return this.count(context).trueCount%2 === 1;
			};
		};
		XorCommand.prototype = Object.create(LimitCommand.prototype);
		XorCommand.prototype.constructor = XorCommand;
		var XnorCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				return this.count(context).trueCount%2 === 0;
			};
		};
		XnorCommand.prototype = Object.create(LimitCommand.prototype);
		XnorCommand.prototype.constructor = XnorCommand;
		var MutexCommand = function(parent,node) {
			LimitCommand.call(this,parent,node);
			this.internalExecute = function(context) {
				return this.count(context).trueCount === 1;
			};
		};
		MutexCommand.prototype = Object.create(LimitCommand.prototype);
		MutexCommand.prototype.constructor = MutexCommand;

		// [NG OBJECT REFERENCES]
		// Objects that wrap data read from .cfg files.
		var MipmapComponent = function(x,y,width,height,img) {
			var _img = img;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.ratio = height/width;
			this.draw = function(canvas,targetWidth) {
				var targetHeight = targetWidth*this.ratio;
				canvas.width = targetWidth;
				canvas.height = targetHeight;
				var context = canvas.getContext("2d");
				context.clearRect(0,0,targetWidth,targetHeight);
				context.drawImage(_img,this.x,this.y,this.width,this.height,0,0,targetWidth,targetHeight);
			};
		};
		var MipmappedImage = function(source) {
			var _img = document.createElement("img");
			_img.className = "offscreen";
			_img.src = source;
			document.documentElement.appendChild(_img);
			var _loaded = false;
			var _mipmaps = [];
			var _inRange = function(index,targetWidth) {
				return index === (_mipmaps.length - 1) || targetWidth > _mipmaps[index + 1].width;
			};
			var _create = function(x,y,width,height) {
				_mipmaps.push(new MipmapComponent(x,y,width,height,_img));
			};
			_img.addEventListener("load",function() {
				var x = 0;
				var y = 0;
				var width = _img.offsetWidth - _img.offsetWidth/3;
				var height = _img.offsetHeight;
				var firstIteration = true;
				while ((firstIteration || y + height < _img.offsetHeight) && width >= 1 && height >= 1) {
					_create(x,y,width,height);
					if (firstIteration) {
						x = width;
						firstIteration = false;
					} else {
						y += height;
					}
					width /= 2;
					height /= 2;
				}
				_loaded = true;
			});
			var _applyMipmap = function(container,artist,source,firstCall) {
				var a = document.createElement("a");
					a.target = "_blank";
					a.href = source;
					a.setAttribute("title",_this.stripHTML(_this.LocalizationMap.getGroup(_this.Consts.localization.configKeys.CONCAT_IMAGE_SOURCE).invoke(_this.LocalizationMap.getString(artist))));
					var canvas = document.createElement("canvas");
						canvas.width = 1;
						canvas.height = 10000; // So that clientWidth accounts for a potential scroll bar
					a.appendChild(canvas);
				container.appendChild(a);
				var targetWidth = container.clientWidth;
				for (var i = 0; i < _mipmaps.length; i++) {
					if (_inRange(i,targetWidth)) {
						_mipmaps[i].draw(canvas,targetWidth);
						i = _mipmaps.length;
					}
				}
				return a;
			};

			this.draw = function(container,artist,source) {
				return new Promise(function(resolve,reject) {
					if (_loaded) {
						resolve(_applyMipmap(container,artist,source));
					} else {
						_img.addEventListener("load",function() {
							if (_loaded) {
								resolve(_applyMipmap(container,artist,source));
							} else {
								// Guard against this listener firing before component creation listener
								setTimeout(function() {
									resolve(_applyMipmap(container,artist,source));
								},0);
							}
						});
					}
				});
			};
			this.dispose = function() {
				document.documentElement.removeChild(_img);
			};
		};
		var ImageReference = function(id,node) {
			var _this2 = this;
			if (typeof id !== "undefined") {
				_this.nodeEnforceNoEntries(node);
				_this.nodeEnforceNoChildren(node);
				_this.nodeEnforceOnlyTheseAssociations(node,[_this.Consts.definition.IMAGE_ID,_this.Consts.definition.IMAGE_ARTIST,_this.Consts.definition.IMAGE_SOURCE]);
				this.id = id;
				this.filePath = _this.Consts.io.paths.GFX_USER+node.name.unescapedString;
				this.artist = node.getAssociation(_this.Consts.definition.IMAGE_ARTIST).unescapedString;
				this.source = node.getAssociation(_this.Consts.definition.IMAGE_SOURCE).unescapedString;
				this.mipmap = new MipmappedImage(_this.Consts.io.paths.GFX_MIPMAP+node.name.unescapedString);
				this.isAlpha = false;
			}
			this.display = function() {
				_imageEle.textContent = "";
				if (!this.isAlpha) {
					this.mipmap.draw(_imageEle,this.artist,this.source);
				}
			};
			this.wrappedNode = node;
		};
		var ObjectReference = function(id,node) {
			_this.nodeEnforceNoEntries(node);
			var assocs = {};
			assocs[_this.Consts.definition.NAME] = false;
			assocs[_this.Consts.definition.DESC] = false;
			assocs[_this.Consts.definition.OBJECT_REMOVABLE] = true;
			_this.nodeEnforceAssociationsComplex(node,assocs,true);
			var children = {};
			children[_this.Consts.definition.OBJECT_EVT_FIRST_INTERACT] = true;
			children[_this.Consts.definition.OBJECT_EVT_INTERACT] = true;
			_this.nodeEnforceChildrenComplex(node,children,true);

			console.log(id);
			var _this2 = this;
			var _firstInteract = true;
			var _hasFirstInteract = node.hasChildNamed(_this.Consts.definition.OBJECT_EVT_FIRST_INTERACT);
			var _hasOngoingInteract = node.hasChildNamed(_this.Consts.definition.OBJECT_EVT_INTERACT);
			this.id = id;
			this.name = node.getAssociation(_this.Consts.definition.NAME).unescapedString;
			this.desc = node.getAssociation(_this.Consts.definition.DESC).unescapedString;
			this.removable = node.hasAssociation(_this.Consts.definition.OBJECT_REMOVABLE) ? _parseBool(node.getAssociation(_this.Consts.definition.OBJECT_REMOVABLE).unescapedString) : false;
			this.onInteract = _hasOngoingInteract ? new EngineCommand(null,node.getChildNamed(_this.Consts.definition.OBJECT_EVT_INTERACT)) : EngineCommand.NO_OP;
			this.onFirstInteract = _hasFirstInteract ? new EngineCommand(null,node.getChildNamed(_this.Consts.definition.OBJECT_EVT_FIRST_INTERACT)) : EngineCommand.NO_OP;
			this.interact = function(context) {
				if (this.interactable) {
					if (_firstInteract) {
						_firstInteract = false;
						if (_hasFirstInteract) {
							this.onFirstInteract.execute(context);
						} else {
							this.onInteract.execute(context);
						}
					} else {
						this.onInteract.execute(context);
					}
				} else {
					throw new EngineError("Object '"+this.id+"' is not interactable.",this,_getConfigStack(node));
				}
			};
			Object.defineProperty(this,"interactable",{
				get: function() {
					return _hasOngoingInteract || (_firstInteract && _hasFirstInteract);
				}
			});
			this.wrappedNode = node;
		};
		var Room = function(id,node) {
			_this.nodeEnforceNoEntries(node);
			var assocs = {};
			assocs[_this.Consts.definition.NAME] = false;
			assocs[_this.Consts.definition.DESC] = false;
			assocs[_this.Consts.definition.ROOM_IMAGE] = true;
			assocs[_this.Consts.definition.ROOM_CONTINUE_ACTION] = true;
			_this.nodeEnforceAssociationsComplex(node,assocs,true);
			var children = {};
			children[_this.Consts.definition.ROOM_CONTENTS] = true;
			var _hasContinue = node.hasAssociation(_this.Consts.definition.ROOM_CONTINUE_ACTION);
			if (_hasContinue) {
				_this.nodeEnforceNoneOfTheseChildren(node,[_this.Consts.definition.ROOM_APPEND_ACTIONS,_this.Consts.definition.ROOM_OVERRIDE_ACTIONS],_this.Consts.definition.ROOM_CONTINUE_ACTION+" overrides the action menu.");
			} else {
				children[_this.Consts.definition.ROOM_APPEND_ACTIONS] = true;
				children[_this.Consts.definition.ROOM_OVERRIDE_ACTIONS] = true;
			}
			_this.nodeEnforceChildrenComplex(node,children,true);

			var _this2 = this;
			this.id = id;
			this.name = node.getAssociation(_this.Consts.definition.NAME).unescapedString;
			this.desc = node.getAssociation(_this.Consts.definition.DESC).unescapedString;
			this.imageId = node.hasAssociation(_this.Consts.definition.ROOM_IMAGE) ? node.getAssociation(_this.Consts.definition.ROOM_IMAGE).unescapedString : null;
			//this.audioId // TODO
			this.contents = [];
			this.hasContinue = _hasContinue;
			this.actions = _hasContinue ? [node.getAssociation(_this.Consts.definition.ROOM_CONTINUE_ACTION).unescapedString] : [_this.Consts.execution.ACTION_MOVE,_this.Consts.execution.ACTION_EXAMINE,_this.Consts.execution.ACTION_INTERACT];
			this.getImage = function() {
				return this.imageId !== null ? _images[this.imageId] : _imageAlpha;
			};
			this.getActionObjects = function() {
				return this.actions.reduce(function(obj,actionId) {
					obj[actionId] = _actions[actionId];
					return obj;
				},{});
			};

			if (node.hasChildNamed(_this.Consts.definition.ROOM_CONTENTS)) {
				node.getChildNamed(_this.Consts.definition.ROOM_CONTENTS).entries.forEach(function(entry) {
					if (_objects.hasOwnProperty(entry.unescapedString)) {
						_this2.contents.push(_objects[entry.unescapedString]);
					} else {
						throw new EngineError("Object \""+entry.unescapedString+"\" is undefined.",entry.unescapedString,_getConfigStack(node));
					}
				});
			}
			if (node.hasChildNamed(_this.Consts.definition.ROOM_REMOVE_ACTIONS)) {
				var rm = node.getChildNamed(_this.Consts.definition.ROOM_REMOVE_ACTIONS);
				_this.nodeEnforceNoAssociations(rm);
				_this.nodeEnforceNoChildren(rm);
				_this.nodeEnforceAtLeastOneEntry(rm);
				rm.entries.forEach(function(entry) {
					var index = _this2.actions.indexOf(entry.unescapedString);
					if (index === -1) {
						throw new EngineEror("Cannot remove non-existant action '"+entry.unescapedString+"' from room '"+_this2.id+"'.",entry.unescapedString,_getConfigStack(rm));
					}
					_this2.actions.splice(index,1);
				});
			}
			if (node.hasChildNamed(_this.Consts.definition.ROOM_APPEND_ACTIONS)) {
				var add = node.getChildNamed(_this.Consts.definition.ROOM_APPEND_ACTIONS);
				_this.nodeEnforceNoAssociations(add);
				_this.nodeEnforceNoChildren(add);
				_this.nodeEnforceAtLeastOneEntry(add);
				add.entries.forEach(function(entry) {
					_this2.actions.push(entry.unescapedString);
				});
			}
			this.wrappedNode = node;
		};
		var Graph = function() {
			var _arr = [];
			this.getEdgesFrom = function(from) {
				return _arr.filter(function(edge) {
					return edge.from.id === from.id;
				});
			};
			this.getEdgesTo = function(to) {
				return _arr.filter(function(edge) {
					return edge.to.id === to.id;
				});
			};
			this.getEdge = function(from,to) {
				var res;
				var entry;
				for (var i = 0; i < _arr.length; i++) {
					entry = _arr[i];
					if (entry.from.id === from.id && entry.to.id === to.id) {
						res = entry;
						break;
					}
				}
				return res;
			};
			this.push = function(edge) {
				if (typeof this.getEdge(edge.from,edge.to) !== "undefined") {
					throw new EngineError("Cannot push edge ("+edge.from.id+", "+edge.to.id+") because that edge is already defined.",edge);
				} else {
					_arr.push(edge);
				}
			};
		};
		var GraphEdge = function(from,to,node) {
			_this.nodeEnforceNoEntries(node);
			_this.nodeEnforceOnlyTheseAssociations(node,[_this.Consts.definition.GRAPH_ORIGIN,_this.Consts.definition.GRAPH_DESTINATION]);
			var children = {};
			children[_this.Consts.definition.GRAPH_EVT_FIRST_TRAVERSAL] = true;
			children[_this.Consts.definition.GRAPH_EVT_TRAVERSAL] = true;
			_this.nodeEnforceChildrenComplex(node,children,true);

			var _firstTraversal = true;
			var _hasFirstTraversal = node.hasChildNamed(_this.Consts.definition.GRAPH_EVT_FIRST_TRAVERSAL);
			var _hasOngoingTraversal = node.hasChildNamed(_this.Consts.definition.GRAPH_EVT_TRAVERSAL);
			this.from = _rooms[from.unescapedString];
			this.to = _rooms[to.unescapedString];
			this.onFirstTraversal = _hasFirstTraversal ? new EngineCommand(null,node.getChildNamed(_this.Consts.definition.GRAPH_EVT_FIRST_TRAVERSAL)) : EngineCommand.NO_OP;
			this.onTraversal = _hasOngoingTraversal ? new EngineCommand(null,node.getChildNamed(_this.Consts.definition.GRAPH_EVT_TRAVERSAL)) : EngineCommand.NO_OP;
			this.traverse = function(context) {
				_updateLocation(to.unescapedString);
				if (_firstTraversal) {
					_firstTraversal = false;
					if (_hasFirstTraversal) {
						this.onFirstTraversal.execute(context);
					} else if (_hasOngoingTraversal) {
						this.onTraversal.execute(context);
					}
				} else if (_hasOngoingTraversal) {
					this.onTraversal.execute(context);
				}
			};
			this.wrappedNode = node;
		};

		// [PLAYER ACTIONS]
		// Actions the player can perform.
		var AbstractAction = function(id) {
			this.id = id;
			this.isFinalAction = false;
			this.nameKey = null;
			this.performKey = null;
			this.command = null;
			this.subActions = null;
		};
		var Action = function(id,node) {
			_this.nodeEnforceNoEntries(node);
			var children = [_this.Consts.definition.ACTION_DO,_this.Consts.definition.ACTION_SUBACTIONS];
			var childrenObj = {};
			for (var i = 0; i < children.length; i++) {
				childrenObj[children[i]] = true;
			}
			_this.nodeEnforceChildrenComplex(node,childrenObj,true);
			_this.nodeEnforceMutexChildren(node,children);
			var assocs = {};
			assocs[_this.Consts.definition.NAME] = false;
			var _isFinalAction = node.hasChildNamed(_this.Consts.definition.ACTION_DO);
			if (_isFinalAction) {
				assocs[_this.Consts.definition.ACTION_PERFORM] = true;
			}
			_this.nodeEnforceAssociationsComplex(node,assocs,true);

			AbstractAction.call(this,id);
			var _this2 = this;
			this.nameKey = node.getAssociation(_this.Consts.definition.NAME).unescapedString;
			this.performKey = node.hasAssociation(_this.Consts.definition.ACTION_PERFORM) ? node.getAssociation(_this.Consts.definition.ACTION_PERFORM).unescapedString : _this.Consts.localization.configKeys.ACTION_PERFORM;
			this.isFinalAction = _isFinalAction;
			if (this.isFinalAction) {
				this.command = new EngineCommand(null,node.getChildNamed(_this.Consts.definition.ACTION_DO));
			} else {
				var subDef = node.getChildNamed(_this.Consts.definition.ACTION_SUBACTIONS);
				_this.nodeEnforceNoAssociations(subDef);
				_this.nodeEnforceNoChildren(subDef);
				_this.nodeEnforceAtLeastOneEntry(subDef);
				this.subActions = subDef.entries.map(function(entry) {
					return entry.unescapedString;
				});
			}
			this.wrappedNode = node;
		};
		Action.makeCtor = function(id,child) {
			return function() {
				Action.call(this,id,child);
			};
		};
		var MoveActionRoom = function(room) {
			AbstractAction.call(this,room.id);
			this.nameKey = room.name;
			this.performKey = _this.Consts.localization.configKeys.ACTION_MOVE_PERFORM;
			this.isFinalAction = true;
			var map = new COM.Map("");
			map.globalNode.setAssociation(_this.Consts.execution.ACTION_MOVE_TO,room.id);
			this.command = new MoveCommand(null,map.globalNode);
		};
		var MoveAction = function(currentRoom) {
			AbstractAction.call(this,_this.Consts.execution.ACTION_MOVE);
			this.nameKey = _this.Consts.localization.configKeys.ACTION_MOVE;
			this.subActions = _graph.getEdgesFrom(currentRoom).map(function(edge) {
				return new MoveActionRoom(edge.to);
			});
		};
		var ExamineActionObject = function(obj) {
			AbstractAction.call(this,obj.id);
			this.nameKey = obj.name;
			this.performKey = _this.Consts.localization.configKeys.ACTION_EXAMINE_PERFORM;
			this.isFinalAction = true;
			var map = new COM.Map("");
			map.globalNode.setAssociation(_this.Consts.execution.ACTION_EXAMINE_OBJECT,obj.id);
			this.command = new ExamineCommand(null,map.globalNode);
		};
		var ExamineAction = function(currentRoom) {
			AbstractAction.call(this,_this.Consts.execution.ACTION_EXAMINE);
			this.nameKey = _this.Consts.localization.configKeys.ACTION_EXAMINE;
			this.subActions = currentRoom.contents.map(function(obj) {
				return new ExamineActionObject(obj);
			});
		};
		var InteractActionObject = function(obj) {
			AbstractAction.call(this,obj.id);
			this.nameKey = obj.name;
			this.performKey = _this.Consts.localization.configKeys.ACTION_INTERACT_PERFORM;
			this.isFinalAction = true;
			var map = new COM.Map("");
			map.globalNode.setAssociation(_this.Consts.execution.ACTION_INTERACT_OBJECT,obj.id);
			this.command = new InteractCommand(null,map.globalNode);
		};
		var InteractAction = function(currentRoom) {
			AbstractAction.call(this,_this.Consts.execution.ACTION_INTERACT);
			this.nameKey = _this.Consts.localization.configKeys.ACTION_INTERACT;
			this.subActions = currentRoom.contents.filter(function(obj) {
				return obj.interactable;
			}).map(function(obj) {
				return new InteractActionObject(obj);
			});
		};

		// [VARS]
		// Variables containing data that everyone needs to know about.
		// CFG
		var _state;
		var _images;
		var _rooms;
		var _objects;
		var _graph;
		var _actions;
		var _imageAlpha = new ImageReference();
		_imageAlpha.isAlpha = true;
		_imageAlpha = Object.freeze(_imageAlpha);
		// HTML
		var _container;
		var _containerContent;
		var _logEle;
		var _imageEle;
		var _invEle;
		var _actionsEle;
		var _questsEle;

		// [STATE WRAPPERS]
		// Aliasing some things to reduce the amount of code being written.
		Object.defineProperty(this,"state",{
			get: function() {
				return _state;
			},
			enumerable: true
		});
		var _getCurrentRoom = function() {
			return _rooms[_state.getVariable(_this.Consts.definition.STATE_LOCATION)];
		};

		// [ACTIONS]
		// Fuctions that change the state of the game.
		var _updateLocation = function(newLocation) {
			_state.setVariable(_this.Consts.definition.STATE_LOCATION,newLocation);
			ActionManager.update();
		};
		var _teleportPlayer = function(to) {
			if (_rooms.hasOwnProperty(to)) {
				_updateLocation(to);
			} else {
				throw new EngineError("Unable to teleport to room '"+to+"': no such room exists.",to);
			}
		};
		var _movePlayer = function(to,context) {
			if (_rooms.hasOwnProperty(to)) {
				var edge = _graph.getEdge(_getCurrentRoom(),_rooms[to]);
				if (typeof edge !== "undefined") {
					edge.traverse(context);
				} else {
					throw new EngineError("Unable to move to room '"+to+"': current location +'"+_getCurrentLocation().id+"' and destination '"+to+"' have no direct connection.",to);
				}
			} else {
				throw new EngineError("Unable to move to room '"+to+"': no such room exists.",to);
			}
		};
		var _examineObject = function(id,breakFirst) {
			breakFirst = _this.defaultBool(breakFirst);
			if (_objects.hasOwnProperty(id)) {
				var obj = _objects[id];
				if (breakFirst) {
					_this.logPush(obj.desc);
				} else {
					_this.logPushNoBreak(obj.desc);
				}
			} else {
				throw new EngineError("Unable to examine object '"+id+"': no such object exists.",id);
			}
		};
		var _interactWithObject = function(id,context) {
			if (_objects.hasOwnProperty(id)) {
				var obj = _objects[id];
				console.log(obj);
				if (obj.interactable) {
					obj.interact(context);
				} else {
					throw new EngineError("Unable to interact with object '"+id+"': object does not define interaction behavior in this context.",id);
				}
			} else {
				throw new EngineError("Unable to interact with object '"+id+"': no such object exists.",id);
			}
		};
		this.logPush = function(id) {
			_this.logPushRawString(_this.LocalizationMap.getString(id));
		};
		this.logPushNoBreak = function(id,keepLastInView) {
			_this.logPushRawStringNoBreak(_this.LocalizationMap.getString(id),keepLastInView);
		};
		this.logPushRawString = function(str) {
			_htmlToNodes(_this.LocalizationMap.getString(_this.Consts.localization.configKeys.BREAK),_logEle);
			_this.logPushRawStringNoBreak(str,true);
		};
		this.logPushRawStringNoBreak = function(str,keepLastInView) {
			var lastElement = _logEle.children.length > 0 ? _logEle.children[_logEle.children.length - 1] : null;
			_htmlToNodes(str,_logEle);
			if (lastElement !== null) {
				keepLastInView = _this.defaultBool(keepLastInView);
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
				_logEle.scrollTop = refElement.offsetTop;
			}
		};
		this.logPushError = function(e) {
			// TODO: when refactoring error handling, change this function
			var msg = "<span class='error'>ERROR:</span> "+e.message;
			if (e.hasOwnProperty("configStack")) {
				msg += " ("+e.configStack.join()+")";
			}
			_this.logPush(msg);
		};

		// [UI]
		// User interface functions and objects.
		// TODO: Move mipmapping stuff down here
		var ActionDropdown = function(action,container,parent) {
			var _this2 = this;
			var _text = null;
			this.parent = _this.defaultObject(parent,null);
			this.child = null;
			var option;
			var _li = document.createElement("li");
				var _select = document.createElement("select");
					option = document.createElement("option");
						option.value = _this.Consts.execution.ACTION_NULL;
						option.selected = "selected";
						option.innerHTML = _this.LocalizationMap.getString(_this.Consts.localization.configKeys.ACTION_NULL);
					_select.appendChild(option);
					action.subActions.forEach(function(subAction) {
						option = document.createElement("option");
							option.value = subAction.id;
							option.innerHTML = _this.LocalizationMap.getString(subAction.nameKey);
						_select.appendChild(option);
					});
					_select.addEventListener("change",function() {
						_this2.wipe(false);
						var value = _select.value;
						if (value !== _this.Consts.execution.ACTION_NULL) {
							_text = _select.options[_select.selectedIndex].text;
							var found = false;
							var subAction;
							for (var i = 0; !found && i < action.subActions.length; i++) {
								subAction = action.subActions[i];
								found = subAction.id === value;
							}
							if (found) {
								if (subAction.isFinalAction) {
									_this2.child = document.createElement("li");
										var button = document.createElement("button");
											button.type = "button";
											button.className = "btn";
											button.innerHTML = _this.LocalizationMap.getString(subAction.performKey);
											button.addEventListener("click",function() {
												var components = [_this.stripHTML(_this.LocalizationMap.getString(_getCurrentRoom().name))];
												components = components.concat(_this2.getActionText());
												components = components.join(_this.LocalizationMap.getString(_this.Consts.localization.configKeys.ACTION_ARCHIVE_DELIM));
												_this.logPushRawString("<p><em>"+components+"</em></p>");
												ActionManager.update();
												subAction.command.execute(true);
											});
										_this2.child.appendChild(button);
									container.appendChild(_this2.child);
								} else {
									_this2.child = new ActionDropdown(subAction,container,_this2);
								}
							} else {
								throw new EngineError("Unable to locate sub-action with I.D. '"+value+"'.",_this2);
							}
						} else {
							_text = null;
						}
					});
				_li.appendChild(_select);
			container.appendChild(_li);

			this.wipe = function(wipeSelf) {
				wipeSelf = _this.defaultBool(wipeSelf,true);
				if (this.child !== null) {
					if (this.child instanceof ActionDropdown) {
						this.child.wipe();
					} else {
						container.removeChild(this.child);
						this.child = null;
					}
				}
				if (wipeSelf) {
					try {
						container.removeChild(_li);
					} catch (e) {
						// _li was already removed
					}
				}
			};
			this.getActionText = function(arr) {
				arr = _this.defaultArray(arr,[]);
				arr.unshift(_text);
				if (this.parent !== null) {
					this.parent.getActionText(arr);
				}
				return arr;
			};
		};
		var ActionManager = new (function() {
			var _this2 = this;
			var _rootDropdown;
			this.container = null;
			this.update = function() {
				this.container.textContent = "";
				_rootDropdown = null;
				_dropdownStack = [];
				var room = _getCurrentRoom();
				var actions = room.getActionObjects();
				if (room.hasContinue) {
					var cntAction = new (actions[0])(room);
					var button = document.createElement("button");
						button.type = "button";
						button.className = "btn";
						button.innerHTML = _this.LocalizationMap.getString(_this.Consts.localization.configKeys.ACTION_CONTINUE);
						button.addEventListener("click",function() {
							_this2.update();
							cntAction.command.execute();
						});
					this.container.appendChild(button);
				} else {
					var ol = document.createElement("ol");
						ol.className = "actions-list";
					this.container.appendChild(ol);
					var rootAction = new AbstractAction(_this.Consts.execution.ACTION_ROOT);
					rootAction.subActions = [];
					_this.objectForEach(actions,function(key,action) {
						rootAction.subActions.push(new action(room));
					});
					_rootDropdown = new ActionDropdown(rootAction,ol);
				}
			};
		})();
		var _setupActionsUI = function() {
			_actionsEle.textContent = "";
			var div = document.createElement("div");
				div.className = "action-title-container";
				div.innerHTML = _this.LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_ACTS);
			_actionsEle.appendChild(div);
			div = document.createElement("div");
				div.className = "action-select-container";
			_actionsEle.appendChild(div);
			ActionManager.container = div;
			ActionManager.update();
		};

		// [LOAD ASSISTORS]
		// Functions that assist in loading.
		var _wrapLoad = function(body,arg,manager) {
			var res = true;
			try {
				body(arg);
			} catch (e) {
				res = false;
				if (!(e instanceof EngineError)) {
					var stack = e.stack;
					e = new EngineError(e.message);
					e.stack = stack;
				}
				manager.error(e);
			}
			return res;
		};
		var _wrapCallback = function(req,manager,callback) {
			req.execute(function(res) {
				if (res.error) {
					manager.error(new EngineError(res.text,res));
				} else {
					try {
						callback(res);
						manager.increment();
					} catch (e) {
						manager.error(e);
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
		var _wrapParser = function(body,fallbackNode) {
			var changeFallbackNode = function(newNode) {
				fallbackNode = newNode;
			};
			try {
				body(changeFallbackNode);
			} catch (e) {
				if (!Array.isArray(e.configStack) || e.configStack.length === 0) {
					e.configStack = _getConfigStack(fallbackNode);
				}
				throw e;
			}
		};
		var _parseLocalization = function(map) {
			_wrapParser(function(change) {
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.BREAK);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.INITIAL);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.TITLE_PAGE);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.TITLE_INV);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.TITLE_ACTS);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.TITLE_QUESTS);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.INV_ADD);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.INV_REMOVE);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_MOVE);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_EXAMINE);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_INTERACT);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_NULL);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_PERFORM);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_CONTINUE);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_MOVE_PERFORM);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_EXAMINE_PERFORM);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_INTERACT_PERFORM);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.ACTION_ARCHIVE_DELIM);
				_this.LocalizationMap.defineNgString(_this.Consts.localization.configKeys.QUEST_LOG_EMPTY);
				_this.LocalizationMap.defineNgGroup(_this.Consts.localization.configKeys.CONCAT_IMAGE_SOURCE);
				_this.LocalizationMap.defineNgGroup(_this.Consts.localization.configKeys.CONCAT_AUDIO_SOURCE);
				map.globalNode.children.forEach(function(file) {
					change(file);
					_this.nodeEnforceNoEntries(file);
					file.associations.forEach(function(key,value) {
						_this.LocalizationMap.setString(key,value);
					});
					file.children.forEach(function(child) {
						change(child);
						_this.LocalizationMap.setGroup(child.name.unescapedString,child);
					});
				});
				change(map.globalNode);
				_this.LocalizationMap.validateNgVars();
				var update = {};
				_this.LocalizationMap.forEachGroup(function(key,value,isNgKey) {
					if (isNgKey) {
						update[key] = new LocalizedConcat(key,value);
					}
				});
				for (var key in update) {
					if (update.hasOwnProperty(key)) {
						_this.LocalizationMap.setGroup(key,update[key]);
					}
				}
				_this.LocalizationMap.externLock();
			},map.globalNode);
		};
		var _parseState = function(node,isFirstCall) {
			isFirstCall = _this.defaultBool(isFirstCall,true);
			var res;
			_wrapParser(function() {
				res = new Scope(node.name.unescapedString,isFirstCall ? [_this.Consts.definition.STATE_LOCATION] : []);
				node.associations.forEach(function(key,value) {
					res.defineVariable(key,value.unescapedString);
				});
				node.children.forEach(function(child) {
					res.addChild(_parseState(child,false));
				});
				if (isFirstCall && !res.hasVariable(_this.Consts.definition.STATE_LOCATION)) {
					throw new EngineError("State definition is missing required association '"+_this.Consts.definition.STATE_LOCATION+"'.",_state,_getConfigStack(node));
				}
			},node);
			return res;
		};
		var _parseImages = function(map) {
			_wrapParser(function(change) {
				var id;
				_images = {};
				map.globalNode.children.forEach(function(file) {
					change(file);
					_this.nodeEnforceNoEntries(file);
					_this.nodeEnforceNoAssociations(file);
					_this.nodeEnforceNoEngineChildren(file);
					file.children.forEach(function(child) {
						change(child);
						_this.nodeEnforceNoEntries(child);
						_this.nodeEnforceNoChildren(child);
						_this.nodeEnforceHasAssociation(child,_this.Consts.definition.IMAGE_ID);
						id = child.getAssociation(_this.Consts.definition.IMAGE_ID).unescapedString;
						if (_images.hasOwnProperty(id)) {
							throw new EngineError("An image with I.D. \""+id+"\" already exists.",child,_getConfigStack(child));
						} else {
							_images[id] = Object.freeze(new ImageReference(id,child));
						}
					});
				});
			},map.globalNode);
		};
		var _parseObjects = function(map) {
			_wrapParser(function(change) {
				var id;
				_objects = {};
				map.globalNode.children.forEach(function(file) {
					change(file);
					_this.nodeEnforceNoEntries(file);
					_this.nodeEnforceNoAssociations(file);
					_this.nodeEnforceNoEngineChildren(file);
					file.children.forEach(function(child) {
						change(child);
						id = child.name.unescapedString;
						if (_objects.hasOwnProperty(id)) {
							throw new EngineError("An object with I.D. \""+id+"\" already exists.",child,_getConfigStack(child));
						} else {
							_objects[id] = Object.freeze(new ObjectReference(id,child));
						}
					});
				});
			},map.globalNode);
		};
		var _parseRooms = function(map) {
			_wrapParser(function(change) {
				var id;
				_rooms = {};
				map.globalNode.children.forEach(function(file) {
					change(file);
					_this.nodeEnforceNoEntries(file);
					_this.nodeEnforceNoAssociations(file);
					_this.nodeEnforceNoEngineChildren(file);
					file.children.forEach(function(child) {
						change(child);
						id = child.name.unescapedString;
						if (_rooms.hasOwnProperty(id)) {
							throw new EngineError("A room with I.D. \""+id+"\" already exists.",child,_getConfigStack(child));
						} else {
							_rooms[id] = Object.freeze(new Room(id,child));
						}
					});
				});
			},map.globalNode);
		};
		var _parseGraph = function(map) {
			var from;
			var to;
			try {
				_wrapParser(function(change) {
					var name;
					_graph = new Graph();
					map.globalNode.children.forEach(function(file) {
						change(file);
						_this.nodeEnforceNoEntries(file);
						_this.nodeEnforceNoAssociations(file);
						_this.nodeEnforceOnlyTheseChildren(file,[_this.Consts.definition.GRAPH_EDGE]);
						file.children.forEach(function(child) {
							change(child);
							_this.nodeEnforceHasAssociation(child,_this.Consts.definition.GRAPH_ORIGIN);
							_this.nodeEnforceHasAssociation(child,_this.Consts.definition.GRAPH_DESTINATION);
							from = child.getAssociation(_this.Consts.definition.GRAPH_ORIGIN);
							to = child.getAssociation(_this.Consts.definition.GRAPH_DESTINATION);
							name = child.name.unescapedString;
							if (name === _this.Consts.definition.GRAPH_EDGE) {
								_graph.push(new GraphEdge(from,to,child));
							} else {
								throw new EngineError("Unexpected child \""+name+"\" in graph definition.",child,_getConfigStack(child));
							}
						});
					});
				},map.globalNode);
			} catch (e) {
				if (typeof from !== "undefined" && typeof to !== "undefined") {
					e.message += " (in graph edge from \""+from.unescapedString+"\" to \""+to.unescapedString+"\")";
				}
				throw e;
			}
		};
		var _parseActions = function(map) {
			_wrapParser(function(change) {
				var id;
				_actions = {};
				_actions[_this.Consts.execution.ACTION_MOVE] = MoveAction;
				_actions[_this.Consts.execution.ACTION_EXAMINE] = ExamineAction;
				_actions[_this.Consts.execution.ACTION_INTERACT] = InteractAction;
				map.globalNode.children.forEach(function(file) {
					change(file);
					_this.nodeEnforceNoEntries(file);
					_this.nodeEnforceNoAssociations(file);
					_this.nodeEnforceNoEngineChildren(file);
					file.children.forEach(function(child) {
						change(child);
						id = child.name.unescapedString;
						if (_actions.hasOwnProperty(id)) {
							throw new EngineError("An action with I.D. \""+id+"\" already exists.",child,_getConfigStack(child));
						} else {
							_actions[id] = Action.makeCtor(id,child);
						}
					});
				});
			},map.globalNode);
		};

		var _validateContinues = function(map) {
			_wrapParser(function(change) {
				var action;
				_this.objectForEach(_rooms,function(room) {
					change(room.wrappedNode);
					if (room.hasContinue) {
						if (room.actions.length !== 1) {
							throw new EngineError("Rooms must have one and only one action if "+_this.Consts.definition.ROOM_CONTINUE_ACTION+" is set.",room.wrappedNode,_getConfigStack(room.wrappedNode));
						} else {
							action = new (room.getActionObjects()[0])(room);
							if (!action.isFinalAction) {
								throw new EngineError("Action '"+action.id+"' is not valid to be an "+_this.Consts.definition.ROOM_CONTINUE_ACTION+" target because it does not define "+_this.Consts.definition.ACTION_DO+".",room.wrappedNode,_getConfigStack(room.wrappedNode));
							}
						}
					}
				});
			},map.globalNode);
		};

		// [INIT]
		// Program entry point.
		window.addEventListener("DOMContentLoaded",function() {
			// TODO: One error exits entire load segment, rectify this and allow load function to throw many errors
			// 	(<ol> element with id errorLog)
			_container = document.getElementById("container");
			_containerContent = _container.innerHTML;

				// TODO: Special action for "continue"
				// i.e. @continue = someFinalAction
				// need to verify that someFinalAction is actually a final action (i.e. has @do and not @subActions)
				// (on load enumerate over all rooms and check then)

			var _stylesheets;
			var _localizationMap;
			var _stateMap;
			var _imagesMap;
			var _objectsMap;
			var _roomsMap;
			var _graphMap;
			var _actionsMap;

			var manager = new LoadCounter(8,_container);
			manager.onLoad = function() {
				// [MAIN]
				// Sets up the initial state and prepares for possible user input.
				var good = true;
				for (var i = 0; i < _stylesheets.length; i++) {
					good &= _wrapLoad(_loadStylesheet,_stylesheets[i],manager);
				}
				good &= _wrapLoad(_parseLocalization,_localizationMap,manager)
				good &= _wrapLoad(function() {
					_state = _parseState(_stateMap.globalNode,"global");
				},undefined,manager);
				good &= _wrapLoad(_parseImages,_imagesMap,manager);
				good &= _wrapLoad(_parseObjects,_objectsMap,manager);
				good &= _wrapLoad(_parseRooms,_roomsMap,manager);
				good &= _wrapLoad(_parseGraph,_graphMap,manager);
				good &= _wrapLoad(_parseActions,_actionsMap,manager);

				good &= _wrapLoad(_validateContinues,_roomsMap,manager);

				if (good) {
					// Freeing memory
					_stylesheets = null;
					_localizationMap = null;
					_stateMap = null;
					_imagesMap = null;
					_objectsMap = null;
					_roomsMap = null;
					_graphMap = null;
					_actionsMap = null;

					_container.innerHTML = _containerContent;
					_logEle = document.getElementById(_this.Consts.html.page.LOG);
					_imageEle = document.getElementById(_this.Consts.html.page.IMAGE);
					_invEle = document.getElementById(_this.Consts.html.page.INV);
					_actionsEle = document.getElementById(_this.Consts.html.page.ACTIONS);
					_questsEle = document.getElementById(_this.Consts.html.page.QUESTS);

					document.title = _this.stripHTML(_this.LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_PAGE));
					_logEle.textContent = "";
					_this.logPushNoBreak(_this.Consts.localization.configKeys.INITIAL);
					_invEle.innerHTML = _this.LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_INV);
					_questsEle.innerHTML = _this.LocalizationMap.getString(_this.Consts.localization.configKeys.TITLE_QUESTS);
					_setupActionsUI();
					_getCurrentRoom().getImage().display();
				}
			};
			var query = location.search;
			if (query.length !== 0) {
				var kvps = query.split("&");
				query = {};
				var kvp;
				for (var i = 0; i < kvps.length; i++) {
					kvp = kvps[i].split("=");
					query[kvp[0]] = kvp[1];
				}
			} else {
				query = {};
			}

			// [LOADING]
			// AJAX requests that load data from files.
			var req = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_STYLING);
			_wrapCallback(req,manager,function(res) {
				_stylesheets = JSON.parse(res.text);
			});
			var req2 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_LOCALIZATION);
			req2.data = {
				lang: query.hasOwnProperty("lang") ? query.lang : "en"
			};
			_wrapCallback(req2,manager,function(res) {
				_localizationMap = new COM.Map(res.text);
			});
			var req3 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.COMMON_STATE);
			_wrapCallback(req3,manager,function(res) {
				_stateMap = new COM.Map(res.text);
			});
			var req4 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_IMAGES);
			req4.data = {
				folder: _this.Consts.io.paths.COMMON_IMAGES
			};
			_wrapCallback(req4,manager,function(res) {
				_imagesMap = new COM.Map(res.text);
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
			var req8 = new AJAXRequest(HTTPMethods.POST,_this.Consts.io.files.SCRIPT_LOAD_MISC);
			req8.data = {
				folder: _this.Consts.io.paths.COMMON_ACTIONS
			};
			_wrapCallback(req8,manager,function(res) {
				_actionsMap = new COM.Map(res.text);
			});
		});
	})()),
	enumerable: false,
	writable: false
});