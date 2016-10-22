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

	var LoadCounter = function(max,container) {
		var _loaded = 0;
		var _max = max;
		var _errors = [];
		var _render = function() {
			container.textContent = "Loading... "+Math.round(100*_loaded/_max)+"%";
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
				p = document.createElement("p");
					span = document.createElement("span");
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

		var ElementId = function(id,ele,selfClosing,className,argsApplier) {
			var _hasClassName = typeof className !== "undefined";
			var _className = className;
			var _classId = " class='";
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
					res += "'";
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
		var _idMap = [
			new ElementId("s","span"),
			new ElementId("n","br",true),
			new ElementId("p","p"),
			new ElementId("H","h1"),
			new ElementId("h","h2"),
			new ElementId("q","span",false,"soft"),
			new ElementId("i","em"),
			new ElementId("l","a",false,undefined,function(args,hasClassName,className,standardApplier) {
				args = args.split(" ");
				if (args.length === 0) {
					throw new Error("l element in localization must have one argument specifying the URL to link to.");
				} else {
					var res = " href='"+args[0]+"'";
					args = args.slice(1).join(" ");
					res += standardApplier(args,hasClassName,className,standardApplier);
					return res;
				}
			}),
			new ElementId("w","div")
		];
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
				for (var i = 0; i < _idMap.length; i++) {
					id = _idMap[i];
					if (block.id === id.id) {
						if (ignoreSelfClosing && id.selfClosing) {
							throw new Error(context[0].toUpperCase()+context.substring(1)+" tag "+block.id+" in a localization file cannot be closed because it is self-closing.");
						} else {
							callback(id);
							return;
						}
					}
				}
				throw new Error("Unknown "+context+" tag +"+block.id+" in a localization file.");
			};
			value.forEach(function(c) {
				if (inOpenBlock) {
					if (c.escaped) {
						_pushChar(c.char);
					} else if (!inArgs && c.char === " ") {
						inArgs = true;
					} else if (c.char === "]") {
						inOpenBlock = false;
						inArgs = false;
						_findId("opening",function(id) {
							res += "<"+id.ele+_formatArgs(id);
							if (id.selfClosing) {
								res += " /";
							}
							res += ">";
						},false);
					} else {
						_pushChar(c.char);
					}
				} else if (inCloseBlock) {
					if (c.escaped) {
						_pushChar(c.char);
					} else if (c.char === "]") {
						inCloseBlock = false;
						_findId("closing",function(id) {
							res += "</"+id.ele+">";
						},true);
					} else {
						_pushChar(c.char);
					}
				} else if (openBracket) {
					openBracket = false;
					if (c.escaped || (c.char !== "+" && c.char !== "/")) {
						res += "["+c.char;
					} else {
						block.id = "";
						block.args = "";
						if (c.char === "+") {
							inOpenBlock = true;
							inCloseBlock = false;
							inArgs = false;
						} else {
							inOpenBlock = false;
							inCloseBlock = true;
						}
					}
				} else if (!c.escaped && c.char === "[") {
					openBracket = true;
					noBlocks = false;
				} else {
					res += c.char;
				}
			});
			if (noBlocks) {
				res = "<p>"+res+"</p>";
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
		new Action("@actionMove",function() {
			// TODO: Change player location
		}),
		new Action("@actionExamine",function() {
			// TODO: Display object examination text
		}),
		new Action("@actionInteract",function() {
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
		var link = document.createElement("link");
			link.setAttribute("rel","stylesheet");
			link.setAttribute("href","style/app/"+file);
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
		_htmlToNodes(LocalizationMap.getString("@break"),_log);
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
			_log = document.getElementById("log");
			_image = document.getElementById("image");
			_inv = document.getElementById("inventory");
			_actions = document.getElementById("actions");
			_quests = document.getElementById("quests");

			_log.textContent = "";
			_this.logPushNoBreak("@init");
			_inv.innerHTML = LocalizationMap.getString("@inventoryTitle");
			_actions.innerHTML = LocalizationMap.getString("@actionsTitle");
			_quests.innerHTML = LocalizationMap.getString("@questLogTitle");
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

		var req = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadStyling.php");
		_wrapCallback(req,manager,function(res) {
			var json = JSON.parse(res.text);
			for (var i = 0; i < json.length; i++) {
				_loadStylesheet(json[i]);
			}
		});
		var req2 = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadLocalization.php");
		req2.data = {
			lang: query.hasOwnProperty("lang") ? query.lang : "en"
		};
		_wrapCallback(req2,manager,function(res) {
			_parseLocalization(new COM.Map(res.text));
			
		});
		var req3 = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadNg.php");
		req3.data = {
			file: "common/ng/objects.cfg"
		};
		req3.execute(function(res) {
			if (res.error) {
				manager.error(res.text,res);
			} else {
				manager.increment();
			}
		});
		var req4 = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadNg.php");
		req4.data = {
			file: "common/ng/rooms.cfg"
		};
		req4.execute(function(res) {
			if (res.error) {
				manager.error(res.text,res);
			} else {
				manager.increment();
			}
		});
	});
})();

