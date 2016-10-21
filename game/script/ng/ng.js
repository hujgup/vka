var Engine = new (function() {
	var _this = this;

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
				var idMap = [{
					id: "s",
					ele: "span",
					selfClosing: false
				},
				{
					id: "b",
					ele: "br",
					selfClosing: true
				},
				{
					id: "p",
					ele: "p",
					selfClosing: false
				},
				{
					id: "H",
					ele: "h2",
					selfClosing: false
				},
				{
					id: "h",
					ele: "h2",
					selfClosing: false
				}];
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
				var _formatArgs = function() {
					var res = "";
					if (block.args.length !== 0) {
						res += " class='"+block.args+"'";
					}
					return res;
				};
				var _findId = function(context,callback,ignoreSelfClosing) {
					var id;
					for (var i = 0; i < idMap.length; i++) {
						id = idMap[i];
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
								res += "<"+id.ele+_formatArgs();
								if (id.selfClosing) {
									res += " /";
								}
								res += ">";
							},false);
						} else {
							_pushChar(c.char);
						}
					} else if (inCloseBlock) {
						if (c.isNewLine) {
							_pushChar("<br />");
						} else if (c.escaped) {
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
							res += "[";
							if (c.isNewLine) {
								res += "<br />";
							} else {
								res += c.char;
							}
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
		})(),
		writable: false,
		enumerable: false
	});

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
			if (key === "@questLogTitle") {
				console.log(key);
			}
			_this.LocalizationMap.setString(key,value);
		});
		map.globalNode.children.forEach(function(child) {
			_this.LocalizationMap.setGroup(child.name.rawString,child);
		});
	};

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
			_log.innerHTML = _this.LocalizationMap.getString("@init");
			_inv.innerHTML = _this.LocalizationMap.getString("@inventoryTitle");
			_actions.innerHTML = _this.LocalizationMap.getString("@actionsTitle");
			_quests.innerHTML = _this.LocalizationMap.getString("@questLogTitle");
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

