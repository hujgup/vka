function strnatcasecmp (str1, str2) {
	// http://jsphp.co/jsphp/fn/view/strnatcasecmp
	// +	  original by: Martin Pool
	// + reimplemented by: Pierre-Luc Paour
	// + reimplemented by: Kristof Coomans (SCK-CEN (Belgian Nucleair Research Centre))
	// + reimplemented by: Brett Zamir (http://brett-zamir.me)
	// +	  bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +		 input by: Devan Penner-Woelk
	// +	  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// *		example 1: strnatcasecmp(10, 1);
	// *		returns 1: 1
	// *		example 1: strnatcasecmp('1', '10');
	// *		returns 1: -1
	var a = (str1 + '').toLowerCase();
	var b = (str2 + '').toLowerCase();

	var isWhitespaceChar = function (a) {
		return a.charCodeAt(0) <= 32;
	};

	var isDigitChar = function (a) {
		var charCode = a.charCodeAt(0);
		return (charCode >= 48 && charCode <= 57);
	};

	var compareRight = function (a, b) {
		var bias = 0;
		var ia = 0;
		var ib = 0;

		var ca;
		var cb;

		// The longest run of digits wins.  That aside, the greatest
		// value wins, but we can't know that it will until we've scanned
		// both numbers to know that they have the same magnitude, so we
		// remember it in BIAS.
		for (var cnt = 0; true; ia++, ib++) {
			ca = a.charAt(ia);
			cb = b.charAt(ib);

			if (!isDigitChar(ca) && !isDigitChar(cb)) {
				return bias;
			} else if (!isDigitChar(ca)) {
				return -1;
			} else if (!isDigitChar(cb)) {
				return 1;
			} else if (ca < cb) {
				if (bias === 0) {
					bias = -1;
				}
			} else if (ca > cb) {
				if (bias === 0) {
					bias = 1;
				}
			} else if (ca === '0' && cb === '0') {
				return bias;
			}
		}
	};

	var ia = 0,
		ib = 0;
	var nza = 0,
		nzb = 0;
	var ca, cb;
	var result;

	while (true) {
		// only count the number of zeroes leading the last number compared
		nza = nzb = 0;

		ca = a.charAt(ia);
		cb = b.charAt(ib);

		// skip over leading spaces or zeros
		while (isWhitespaceChar(ca) || ca === '0') {
			if (ca === '0') {
				nza++;
			} else {
				// only count consecutive zeroes
				nza = 0;
			}

			ca = a.charAt(++ia);
		}

		while (isWhitespaceChar(cb) || cb === '0') {
			if (cb === '0') {
				nzb++;
			} else {
				// only count consecutive zeroes
				nzb = 0;
			}

			cb = b.charAt(++ib);
		}

		// process run of digits
		if (isDigitChar(ca) && isDigitChar(cb)) {
			if ((result = compareRight(a.substring(ia), b.substring(ib))) !== 0) {
				return result;
			}
		}

		if (ca === '0' && cb === '0') {
			// The strings compare the same.  Perhaps the caller
			// will want to call strcmp to break the tie.
			return nza - nzb;
		}

		if (ca < cb) {
			return -1;
		} else if (ca > cb) {
			return +1;
		}

		++ia;
		++ib;
	}
}

function ImmutableArray(mutableArr) {
	var _arr = mutableArr;
	var _this = this;

	Object.defineProperty(this,"length",{
		get: function() {
			return _arr.length;
		}
	});

	this.at = function(i) {
		return _arr[i];
	};
	this.clone = function() {
		return _arr.slice(0);
	};
	this.concat = function() {
		var res = this.clone();
		for (var i = 0; i < arguments.length; i++) {
			res = res.concat(arguments[i]);
		}
		return res;
	};
	this.every = function(callback) {
		var res = true;
		for (var i = 0; res && i < _arr.length; i++) {
			res = callback(_arr[i],i,this);
		}
		return res;
	};
	this.filter = function(callback) {
		var res = [];
		for (var i = 0; i < _arr.length; i++) {
			if (callback(_arr[i],i,this)) {
				res.push(_arr[i]);
			}
		}
		return res;
	};
	this.find = function(callback) {
		var index = this.findIndex(callback);
		return index !== -1 ? _arr[index] : undefined;
	};
	this.findIndex = function(callback) {
		var res = -1;
		for (var i = 0; i < _arr.length; i++) {
			if (callback(_arr[i],i,this)) {
				res = i;
				break;
			}
		}
		return res;
	};
	this.forEach = function(callback) {
		for (var i = 0; i < _arr.length; i++) {
			callback(_arr[i],i,this);
		}
	};
	this.indexOf = function(searchElement,fromIndex) {
		return _arr.indexOf(searchElement,fromIndex);
	};
	this.join = function(joiner) {
		return _arr.join(joiner);
	};
	this.lastIndexOf = function(searchElement,fromIndex) {
		return _arr.lastIndexOf(searchElement,fromIndex);
	};
	this.map = function(callback) {
		var res = [];
		this.forEach(function(currentValue,index,array) {
			res.push(callback(currentValue,index,array));
		});
		return res;
	};
	this.reduce = function(callback,initialValue) {
		var res;
		if (_arr.length !== 0) {
			var hasInitVal = typeof initialValue !== "undefined";
			res = hasInitVal ? initialValue : _arr[0];
			for (var i = hasInitVal ? 0 : 1; i < _arr.length; i++) {
				res = callback(res,_arr[i],i,this);
			}
		}
		return res;
	};
	this.reduceRight = function(callback,initialValue) {
		var res;
		if (_arr.length !== 0) {
			var hasInitVal = typeof initialValue !== "undefined";
			res = hasInitVal ? initialValue : _arr[_arr.length - 1];
			for (var i = _arr.length - (hasInitVal ? 1 : 2); i >= 0; i--) {
				res = callback(res,_arr[i],i,this);
			}
		}
		return res;
	};
	this.slice = function(begin,end) {
		return _arr.slice(begin,end);
	};
	this.some = function(callback) {
		var res = false;
		for (var i = 0; !res && i < _arr.length; i++) {
			res = callback(_arr[i],i,this);
		}
		return res;
	};
	this.toString = function() {
		return _arr.toString();
	};
	this.toLocaleString = function() {
		return _arr.toLocaleString();
	};
}

function ImmutableObject(obj) {
	var _obj = obj;

	this.clone = function() {
		var res = {};
		for (var key in _obj) {
			if (_obj.hasOwnProperty(key)) {
				res[key] = _obj[key];
			}
		}
		return res;
	};
	this.get = function(key) {
		return _obj[key];
	};
	this.hasOwnProperty = function(prop) {
		return _obj.hasOwnProperty(prop);
	};
	this.isProtoypeOf = function(obj) {
		return _obj.isPrototypeOf(obj);
	};
	this.propertyIsEnumerable = function(prop) {
		return _obj.propertyIsEnumerable(prop);
	};
	this.toString = function() {
		return _obj.toString();
	};
	this.toLocaleString = function() {
		return _obj.toLocaleString();
	};
	this.valueOf = function() {
		return _obj.valueOf();
	};
}

var COM = new (function() {
	// vars
	Object.defineProperty(this,"GLOBAL_BLOCK_NAME",{
		value: "global",
		enumerable: true,
		writable: false
	});
	var WHITESPACE_CIPHER = [
		" ",
		"\t",
		"\r",
		"\n",
		"\0",
		"\v",
		"\f"
	];
	var _this = this;
	var _applyDefault = function(value,df) {
		return typeof value !== "undefined" ? value : df;
	};

	var ConfigParser = new (function() {
		var _blockComment = /#~[\s\S]*?~#/g;
		var _inlineComment = /[\s]*##[\s\S]*$/;
		var _specialChars = [
			"\\",
			"#",
			"~",
			"{",
			"}",
			"=",
			"\n"
		];

		var _escapeCommon = function(str,prepend) {
			var res = [];
			var escapeNext = false;
			for (var i = 0; i < str.rawString.length; i++) {
				if (escapeNext) {
					res.push(prepend+str[i]);
					escapeNext = false;
				} else if (str[i] === "\\") {
					escapeNext = true;
				} else {
					res.push(str[i]);
				}
			}
			return res;
		};
		var _replaceBlockComments = function(str) {
			return str.replace(_blockComment,"");
		};
		var _replaceInlineComments = function(str,newLine) {
			var res = newLine !== false;
			if (res) {
				str = str.split(newLine);
				for (var i = 0; i < str.length; i++) {
					str[i] = str[i].replace(_inlineComment,"");
				}
				res = str.join(newLine);
			}
			return res;
		};

		this.getNewLineChars = function(str) {
			str = str.replace(/.*/g,"").split("");
			var res = str.length !== 0;
			if (res) {
				var seen = [];
				do {
					if (seen.indexOf(str[0]) === -1) {
						seen.push(str.shift());
					} else {
						break;
					}
				} while (str.length !== 0);
				res = seen.join("");
			}
			return res;
		};
		this.escape = function(str) {
			var res = "";
			var c;
			for (var i = 0; i < str.length; i++) {
				if (_specialChars.indexOf(c) !== -1) {
					res += "\\";
				}
				res += c;
			}
			return new _this.String(res);
		};
		this.unescape = function(str) {
			// Legacy
			return str.unescaped;
		};
		this.prepareContents = function(str,encapsulatorName) {
			var newLine = this.getNewLineChars(str);
			str = _replaceBlockComments(str);
			str = _replaceInlineComments(str,newLine);
			if (typeof encapsulatorName !== "undefined") {
				str = encapsulatorName+" {"+newLine+str+"}";
			}
			str = this.escape(str);
			return {
				str: str,
				newLine: newLine
			};
		};
		this.prepareOuterContents = function(str) {
			var name = "";
			str = this.escape(str);
			while (str.length !== 0 && str[0] !== "}") {
				name += str.shift();
			}
			str.shift();
			while (str.length !== 0 && str[str.length - 1] !== "}") {
				str.pop();
			}
			return this.prepareContents(str,name.trim());
		};
	})();

	// Private methods
	var _arraySplit = function(arr,delim,limit,concat) {
		if (typeof limit !== "undefined") {
			if (limit < 2) {
				throw new Error("limit must be 2 or more, was "+linit+".");
			} else {
				limit = Math.floor(limit);
			}
		} else {
			limit = Number.MAX_SAFE_INTEGER;
		}
		concat = _applyDefault(concat,false);
		var chunks = 0;
		var res = [];
		var cnt = false;
		var index;
		do {
			index = arr.indexOf(delim);
			cnt = index !== -1;
			if (cnt) {
				res.push(arr.slice(0,index));
				arr = arr.slice(index + 1);
				chunks++;
			}
		} while (cnt && chunks < limit && arr.length > 0);
		if (!cnt && arr.length > 0) {
			if (chunks < limit) {
				res.push(arr);
			} else {
				res.push(res[res.length - 1].concat(arr));
			}
		}
		if (concat) {
			for (var i = 0; i < res.length; i++) {
				res[i] = res[i].join("");
			}
		}
		return res;
	};
	var _arraySame = function(arr1,arr2) {
		var res = arr1.length === arr2.length;
		if (res) {
			for (var i = 0; res && i < arr1.length; i++) {
				res = arr1[i] === arr2[i];
			}
		}
		return res;
	};
	var _stringRemoveLastChars = function(str,n) {
		return str.substr(0,str.length - n);
	};
	var _defineObject = function(name,func) {
		Object.defineProperty(_this,name,{
			value: func,
			writable: false,
			enumerable: false
		});
	};
	var _arrayClone = function(arr) {
		return arr.slice(0);
	};
	var _objectForEach = function(obj,body) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				body(key,obj[key]);
			}
		}
	};
	var _objectClone = function(obj) {
		var res = {};
		_objectForEach(obj,function(key,value) {
			res[key] = value;
		});
		return res;
	};
	var _list = function(value,keys) {
		keys = _applyDefault(keys,["key","value"]);
		var res = {};
		for (var i = 0; i < keys.length && i < value.length; i++) {
			res[keys[i]] = value[i];
		}
		return res;
	};
	var _isString = function(obj) {
		return typeof obj === "string" || obj instanceof String;
	};
	var _isInt = function(obj) {
		var res = !isNaN(obj);
		if (res) {
			res = typeof obj === "number" || obj instanceof Number;
			if (res) {
				res = obj === parseInt(obj);
			}
		}
		return res;
	};
	var _select = function(arr,where,after) {
		after = _applyDefault(after,function() {
			return [];
		});
		var res = [];
		for (var i = 0; i < arr.length; i++) {
			if (where(arr[i])) {
				res.push(arr[i]);
			}
			res = res.concat(after(arr[i]));
		}
		return res;
	};
	var _buildString = function(raw,callback,startIndex) {
		startIndex = _applyDefault(startIndex,0);
		var res = {
			str: new _this.String(),
			iterated: 0
		};
		for (var i = startIndex; i < raw.length; i++) {
			if (callback(res.str,
		}
		return res;
	};

	// Objects
	_defineObject("String",function(raw) {
		raw = _applyDefault(raw,"");
		// blah
		var _this2 = this;
		var _contents = [];
		var _valid;
		var _raw;
		var _unescaped;
		var StringComponent = function(c,escaped) {
			this.char = c;
			this.escaped = escaped;
			this.isNewLine = c === "n" && escaped;
		};

		var _generateStrings = function() {
			_raw = "";
			_unescaped = "";
			var c;
			for (var i = 0; i < _contents.length; i++) {
				c = _contents[i];
				if (c.escaped) {
					_raw += "\\";
				}
				_raw += c.char;
				if (c.isNewLine) {
					_unescaped += "\n";
				} else {
					_unescaped += c.char;
				}
			}
		};
		var _resolveEscaped = function(c) {
			var escaped;
			switch (c.length) {
				case 2:
					if (c[0] === "\\") {
						c = c[1];
						escaped = true;
					} else {
						throw new TypeError("Argument c must be a character, or an escaped character.");
					}
					break;
				case 1:
					escaped = false;
					break;
				default:
					throw new TypeError("Argument c must be a character, or an escaped character.");
			}
			return new StringComponent(c,escaped);
		};
		var _parseString = function(str) {
			var res = [];
			var escapeNext = false;
			var c;
			for (var i = 0; i < str.length; i++) {
				c = str[i];
				if (escapeNext) {
					res.push(new StringComponent(c,true));
					escapeNext = false;
				} else if (c === "\\") {
					escapeNext = true;
				} else {
					res.push(new StringComponent(c,false));
				}
			}
			return res;
		};
		var _internalIndexOf = function(c) {
			var res = -1;
			var c2;
			for (var i = 0; i < _contents.length; i++) {
				c2 = _contents[i];
				if (c2.char === c.char && c2.escaped === c.escaped) {
					res = i;
					break;
				}
			}
			return res;
		};
		var _indexInRange = function(index) {
			return index >= 0 && index < _contents.length;
		};
		var _arraySplice = function(arr,start,index,newItems) {
			// Credit to http://stackoverflow.com/a/1348196
			Array.prototype.splice.apply(arr,[start,index].concat(newItems));
		};
		var _defineProperty = function(name,getter,setter) {
			Object.defineProperty(_this2,name,{
				get: getter,
				set: setter,
				enumerable: true
			});
		};
		var _defineMethod = function(name,func) {
			Object.defineProperty(_this2,name,{
				value: func,
				writable: false,
				enumerable: false
			});
		};
		_defineProperty("rawString",function() {
			if (!_valid) {
				_generateStrings();
			}
			return _raw;
		},function(value) {
			_contents = [];
			_this2.appendString(value);
		});
		_defineProperty("unescapedString",function() {
			if (!_valid) {
				_generateStrings();
			}
			return _unescaped;
		});
		_defineProperty("isEmpty",function() {
			return _contents.length !== 0;
		});
		_defineMethod("characterAt",function(index) {
			return _contents[index];
		});
		_defineMethod("indexOfCharacter",function(c) {
			return _internalIndexOf(_resolveEscaped(c));
		});
		_defineMethod("indexOfString",function(str) {
			return _this2.rawString.indexOf(str);
		});
		_defineMethod("appendCharacter",function(c) {
			_valid = false;
			_contents.push(_resolveEscaped(c));
		});
		_defineMethod("appendString",function(str) {
			_valid = false;
			_contents = _contents.concat(_parseString(str));
		});
		_defineMethod("prependCharacter",function(c) {
			_valid = false;
			_contents.unshift(_resolveEscaped(c));
		});
		_defineMethod("prependString",function(str) {
			_valid = false;
			_contents = _parseString(str).concat(_contents);
		});
		_defineMethod("insertCharacterAfter",function(reference,c) {
			return _this2.insertCharacterAfterIndex(_internalIndexOf(reference),c);
		});
		_defineMethod("insertCharacterAfterIndex",function(index,c) {
			var res = _indexInRange(index);
			if (res) {
				_valid = false;
				c = _resolveEscaped(c);
				if (index === _contents.length - 1) {
					_contents.push(c);
				} else {
					_contents.splice(index,0,c);
				}
			}
			return res;
		});
		_defineMethod("insertStringAfter",function(reference,str) {
			return _this2.insertStringAfterIndex(_internalIndexOf(reference),str);
		});
		_defineMethod("insertStringAfterIndex",function(index,str) {
			var res = _indexInRange(index);
			if (res) {
				_valid = false;
				str = _parseString(str);
				if (index === _contents.length - 1) {
					_contents = _contents.concat(str);
				} else {
					_arraySplice(_contents,index,0,str);
				}
			}
			return res;
		});
		_defineMethod("insertCharacterBefore",function(reference,c) {
			return _this2.insertCharacterBeforeIndex(_internalIndexOf(reference),c);
		});
		_defineMethod("insertCharacterBeforeIndex",function(index,c) {
			var res = _indexInRange(index);
			if (res) {
				_valid = false;
				c = _resolveEscaped(c);
				if (index === 0) {
					_contents.unshift(c);
				} else {
					_contents.splice(index - 1,0,c);
				}
			}
			return res;
		});
		_defineMethod("insertStringBefore",function(reference,str) {
			return _this2.insertStringBeforeIndex(_internalIndexOf(reference),str);
		});
		_defineMethod("insertStringBeforeIndex",function(index,str) {
			var res = _indexInRange(index);
			if (res) {
				_valid = false;
				str = _parseString(str);
				if (index === 0) {
					_contents = str.concat(_contents);
				} else {
					_arraySplice(_contents,index - 1,0,str);
				}
			}
			return res;
		});
		_defineMethod("removeCharacter",function(reference) {
			return _this2.removeCharacterAt(_internalIndexOf(reference));
		});
		_defineMethod("removeCharacterAt",function(index) {
			var res = _indexInRange(index);
			if (res) {
				_contents.splice(index,1);
			}
			return res;
		});
		_defineMethod("removeString",function(str) {
			var index = _this2.indexOfString(str);
			var res = index !== -1;
			if (res) {
				res = _this2.removeStringAt(,str.length);
			}
			return res;
		});
		_defineMethod("removeStringAt",function(index,length) {
			var res = _indexInRange(index) && _indexInRange(index + length);
			if (res) {
				_contents.splice(index,length);
			}
			return res;
		});
		_defineMethod("replaceString",function(oldStr,newStr) {
			var index = _this2.indexOfString(oldStr);
			var res = _indexInRange(index) && _indexInRange(index + oldStr.length);
			if (res) {
				_arraySplice(_contents,index,oldStr.length,_parseString(newStr));
			}
			return res;
		});

		_this2.rawString = raw;
	});

	_defineObject("Node",function(str,newLine,owner,parent) {
		var _owner = _applyDefault(owner,this);
		var _parent = _applyDefault(parent,null);
		var _name;
		var _entries = [];
		var _associations = {};
		var _children = [];
		var _newLine = newLine;
		var _associationsLength = 0; // Object.keys(obj).length is O(n)
		var _success;
		var _entriesImmutable = new ImmutableArray(_entries);
		var _associationsImmutable = new ImmutableObject(_associations);
		var _childrenImmutable = new ImmutableArray(_children);
		var _this2 = this;

		var _defineProperty = function(name,getter) {
			Object.defineProperty(_this2,name,{
				get: getter,
				enumerable: true
			});
		};
		var _defineMethod = function(name,func) {
			Object.defineProperty(_this2,name,{
				value: func,
				writable: false,
				enumerable: false
			});
		};

		_defineProperty("owner",function() {
			return _owner;
		});
		_defineProperty("parent",function() {
			return _parent;
		});
		_defineProperty("name",function() {
			return _name;
		});
		_defineProperty("entries",function() {
			return _entriesImmutable;
		});
		_defineProperty("associations",function() {
			return _associationsImmutable;
		});
		_defineProperty("children",function() {
			return _childrenImmutable;
		});
		_defineProperty("newLine",function() {
			return _newLine;
		});
		_defineProperty("entriesLength",function() {
			return _entries.length;
		});
		_defineProperty("associationsLength",function() {
			return _associationsLength;
		});
		_defineProperty("childrenLength",function() {
			return _children.length;
		});
		_defineProperty("hasEntries",function() {
			return _entries.length !== 0;
		});
		_defineProperty("hasAssociations",function() {
			return _associationsLength !== 0;
		});
		_defineProperty("hasChildren",function() {
			return _children.length !== 0;
		});
		_defineProperty("success",function() {
			return _success;
		});

		_defineMethod("_igcRecursion",function(tab) {
			return _internalGetContents(tab);
		});
		_defineMethod("_scp",function(parent,owner) {
			_parent = parent;
			_owner = owner;
		});

		var _listable = function(node) {
			var res = new _this.Node();
			res.copyFrom(node);
			return res;
		};
		var _updateAssociations = function(key,value) {
			key = new _this.String(key).rawString;
			if (!_associations.hasOwnProperty(key)) {
				_associationsCount++;
			}
			_associations[key] = new _this.String(value);
		};
		var _getTabbing = function(tab) {
			var res = "";
			if (tab) {
				for (var i = 0; i < tab; i++) {
					res += "\t";
				}
			}
			return res;
		};
		var _internalGetContents = function(tab) {
			tab = _getTabbing(tab);
			var res = tab+"## Entries"+_newLine;
			for (var i = 0; i < _entries.length; i++) {
				res += tab+_entries[i].rawString+_newLine;
			}
			res += _newLine+tab+"## Associations"+_newLine;
			_objectForEach(_associations,function(key,value) {
				res += tab+key+" = "+value.rawString+_newLine;
			});
			res += _newLine+tab+"## Children"+_newLine;
			var tabCount = tab.length + 1;
			for (i = 0; i < _children.length; i++) {
				res += _children[i]._igcRecursion(tabCount)+_newLine;
			}
			return _stringRemoveLastChars(res,_newLine.length);
		};
		var _internalGetOuterContents = function(tab) {
			tab = _getTabbing(_applyDefault(tab,0));
			var res = tab+_name.rawString+" {"+_newLine;
			res += _internalGetContents(tab.length + 1);
			res += _newLine+tab+"}";
			return res;
		};
		var _shiftSequence = function(arr,n) {
			var res = _arrayClone(arr);
			for (var i = 0; i < n; i++) {
				res.shift();
			}
			return res;
		};
		var _parseAssociation = function(line) {
			var index = line.indexOfCharacter("=");
			var l = _list([
				line.rawString.substring(0,index).trim(),
				new _this.String(line.rawString.substring(index + 1).trim());
			]);
			_this2.setAssociation(l.key,l.value);
		};
		var _parseContents = function(contents) {
			contents = contents.rawString.split(_newLine);
			var unescaped;
			var line;
			for (var i = 0; i < contents.length; i++) {
				line = contents[i].trim();
				if (line !== "") {
					unescaped = line;
					line = ConfigParser.escape(line);
					if (line.indexOf("=") === -1) {
						_this2.appendEntry(ConfigParser.unescape(unescaped));
					} else {
						_parseAssociation(line);
					}
				}
			}
		};
		var _complexIndexOf = function(arr,element) {
			return arr.join("").indexOf(element);
		};
		var _extractBlock = function(str,owner,parent) {
			var deadzone = true;
			var res = str.length !== 0;
			if (res) {
				var blockName = "";
				var shift;
				while (str.length !== 0 && str[0] !== "{") {
					shift = str.shift();
					if (_complexIndexOf(str,_newLine) === 0) {
						// No "{", not a block name
						blockName = "";
						_shiftSequence(str,_newLine.length);
					} else {
						blockName += shift;
					}
				}
				res = str.length !== 0;
				if (res) {
					str.shift();
					while (str.length !== 0 && WHITESPACE_CIPHER.indexOf(str[0]) !== -1) {
						str.shift();
					}
					blockName = blockName.trim();
					_name = ConfigParser.unescape(blockName);
					var blockContents = "";
					var fullContents = "";
					var depth = 1;
					var maxDepthGtOne = false;
					var justLeft;
					var index;
					var c;
					while (str.length !== 0 && depth !== 0) {
						justLeft = false;
						c = str[0];
						switch (c) {
							case "{":
								if (depth === 1) {
									index = blockContents.lastIndexOf(_newLine);
									if (index === -1) {
										blockContents = "";
									} else {
										blockContents = blockContents.substring(0,index + _newLine.length);
									}
								}
								depth++;
								maxDepthGtOne = true;
								break;
							case "}":
								depth--;
								justLeft = true;
								break;
						}
						shift = str.shift();
						if (depth !== 0) {
							if (depth === 1 && !justLeft) {
								blockContents += shift;
							}
							fullContents += shift;
						}
					}
					var blockNested = [];
					if (maxDepthGtOne) {
						var nestedWork = ConfigParser.prepareContents(fullContents);
						var tracker = [];
						var regexBase = [
							"/",
							"\\s*?}/"
						];
						var attempt;
						var key;
						do {
							attempt = new _this.Node(nestedWork.str,nestedWork.newLine,owner,_this2);
							if (attempt.success) {
								_this2.appendChild(attempt);
								blockContents = blockContents.replace(new RegExp(regexBase.join(attempt.name)),"");
							}
						} while (attempt.success);
					}
					_parseContents(blockContents);
				}
			}
			return res;
		};
		var _append = function(arr,value) {
			var res = arr.indexOf(value) === -1;
			if (res) {
				arr.push(value);
			}
			return res;
		};
		var _prepend = function(arr,value) {
			var res = arr.indexOf(value) === -1;
			if (res) {
				arr.unshift(value);
			}
			return res;
		};
		var _insertAfter = function(arr,reference,value) {
			if (_isString(reference)) {
				reference = arr.indexOf(reference);
			}
			var res = _isInt(reference) && reference >= 0 && arr.indexOf(value) === -1;
			if (res) {
				if (reference < arr.length - 1) {
					arr.splice(reference + 1,0,value);
				} else {
					_append(arr,value);
				}
			}
			return res;
		};
		var _insertBefore = function(arr,reference,value) {
			if (_isString(reference)) {
				reference = arr.indexOf(reference);
			}
			var res = _isInt(reference) && arr.indexOf(value) === -1;
			if (res) {
				if (reference > 0) {
					res = _insertAfter(arr,reference - 1,value);
				} else {
					_prepend(arr,value);
				}
			}
			return res;
		};
		var _remove = function(arr,value) {
			var index = arr.indexOf(value);
			var res = index !== -1;
			if (res) {
				arr.splice(index,1);
			}
			return res;
		};
		var _replace = function(arr,oldValue,newValue) {
			var res = arr.indexOf(oldValue) !== -1;
			if (res) {
				_insertAfter(arr,oldValue,newValue);
				_remove(arr,oldValue);
			}
			return res;
		};
		var _noCircularReference = function(child) {
			return !child.hasChild(_this2,true) && !_this2.hasChild(child,true);
		};
		var _setChildParent = function(child,parent) {
			parent = _applyDefault(parent,_this2);
			child._scp(parent,_owner);
		};
		var _sort = function(arr,comparer) {
			comparer = _applyDefault(comparer,strnatcasecmp);
			arr.sort(comparer);
		};
		var _childMod = function(child,body,parent,checker) {
			checker = _applyDefault(checker,_noCircularReference);
			var res = checker(child);
			if (res) {
				res = body();
				if (res) {
					_setChildParent(child,parent);
				}
			}
			return res;
		};
		var _childGroupGet = function(deep,pureArray,selector) {
			deep = _applyDefault(deep,false);
			pureArray = _applyDefault(pureArray,false);
			var res = _select(_children,function(child) {
				return selector(child);
			},function(child) {
				return deep ? _childGroupGet(deep,true,selector) : [];
			});
			if (!pureArray) {
				res = _this2.childArrayToNode(res);
			}
			return res;
		};
		var _wipeAssocs = function() {
			for (var key in _associations) {
				if (_associations.hasOwnProperty(key)) {
					_this2.removeAssociation(key);
				}
			}
			_associationsLength = 0;
		};
		var _wipeChildren = function() {
			for (var i = 0; i < _children.length; i++) {
				_children[i]._scp(null,_children[i].owner);
			}
			_children.length = 0;
		};
		var _wipe = function() {
			_name = undefined;
			_entries.length = 0;
			_wipeAssocs();
			_wipeChildren();
		};

		_defineMethod("childArrayToNode",function(arr) {
			var res = new _this.Node(undefined,_newLine);
			res._scp(null,res);
			for (var i = 0; i < arr.length; i++) {
				res.appendChild(_listable(arr[i]));
			}
			return res;
		});
		_defineMethod("copyFrom",function(node) {
			// WARNING: Calling this method will break .entries, .associations, and
			// 	.children references
			_owner = node.owner;
			_parent = node.parent;
			_name = node.name;
			_entries = _arrayClone(node.entries);
			_associations = _objectClone(node.associations);
			_childen = _arrayClone(node.children);
			_newLine = node.newLine;
			_associationsLength = node.associationsLength;
			_success = node.success;
			_entriesImmutable = new ImmutableArray(_entries);
			_associationsImmutable = new ImmutableObject(_associations);
			_childrenImmutable = new ImmutableArray(_children);
		});
		_defineMethod("hasEntry",function(value) {
			return _entries.indexOf(value) !== -1;
		});
		_defineMethod("entryPosition",function(value) {
			return _entries.indexOf(value);
		});
		_defineMethod("getEntry",function(position) {
			var res;
			if (position >= 0 && position < _entries.length) {
				res = _entries[position];
			}
			return res;
		});
		_defineMethod("appendEntry",function(value) {
			return _append(_entries,value);
		});
		_defineMethod("prependEntry",function(value) {
			return _prepend(_entries,value);
		});
		_defineMethod("insertEntryBefore",function(reference,value) {
			return _insertBefore(_entries,reference,value);
		});
		_defineMethod("insertEntryAfter",function(reference,value) {
			return _insertAfter(_entries,reference,value);
		});
		_defineMethod("removeEntry",function(value) {
			return _remove(_entries,value);
		});
		_defineMethod("replaceEntry",function(value) {
			return _replace(_entries,value);
		});
		_defineMethod("sortEntries",function(comparer) {
			_sort(_entries,comparer);
		});
		_defineMethod("clearEntries",function() {
			_entries.length = 0;
		});
		_defineMethod("hasAssociation",function(key,value) {
			var res = _associations.hasOwnProperty(key);
			if (res && typeof value !== "undefined") {
				res = _associations[key] === value;
			}
			return res;
		});
		_defineMethod("getAssociation",function(key) {
			return _this2.hasAssociation(key) ? _associations[key] : undefined;
		});
		_defineMethod("setAssociation",function(key,value) {
			if (typeof value === "undefined") {
				_this2.removeAssociation(key);
			} else {
				if (!_this2.hasAssociation(key)) {
					_associationsLength++;
				}
				_associations[key] = value;
			}
		});
		_defineMethod("removeAssociation",function(key) {
			var res = _this2.hasAssociation(key);
			if (res) {
				delete _associations[key];
				_associationsLength--;
			}
			return res;
		});
		_defineMethod("clearAssociations",function() {
			_wipeAssocs();
		});
		_defineMethod("hasChild",function(child,deep) {
			deep = _applyDefault(deep,false);
			var res = _children.indexOf(child) !== -1;
			if (!res && deep) {
				for (var i = 0; !res && i < _children.length; i++) {
					res = _children[i].hasChild(child,deep);
				}
			}
			return res;
		});
		_defineMethod("hasChildNamed",function(name,deep) {
			deep = _applyDefault(deep,false);
			var res = false;
			for (var i = 0; i < _children.length; i++) {
				res = _children[i].name === name;
				if (res) {
					break;
				} else if (deep) {
					res = _children[i].hasChildNamed(name,deep);
					if (res) {
						break;
					}
				}
			}
			return res;
		});
		_defineMethod("getChildrenNamed",function(name,deep,pureArray) {
			return _childGroupGet(deep,pureArray,function(child) {
				return child.name === name;
			});
		});
		_defineMethod("getChildNamed",function(name,deep,position) {
			deep = _applyDefault(deep,false);
			position = _applyDefault(position,1);
			var res = undefined;
			if (_isInt(position) && position !== 0) {
				var children = _this2.getChildrenNamed(name,deep,true);
				position = position > 0 ? position - 1 : children.length - position;
				if (position >= 0 && position < children.length) {
					res = children[position];
				}
			}
			return res;
		});
		_defineMethod("childPosition",function(value) {
			return _children.indexOf(value);
		});
		_defineMethod("childPositionByName",function(name,position) {
			position = _applyDefault(position,1);
			var res = -1;
			if (_isInt(position) && position !== 0) {
				var child = _this2.getChildNamed(name,false,position);
				if (typeof child !== "undefined") {
					res = _this2.childPosition(child);
				}
			}
			return res;
		});
		_defineMethod("getChildByPosition",function(position) {
			var res;
			if (position >= 0 && position < _children.length) {
				res = _children[position];
			}
			return res;
		});
		_defineMethod("appendChild",function(child) {
			return _childMod(child,function() {
				return _append(_children,child);
			});
		});
		_defineMethod("prependChild",function(child) {
			return _childMod(child,function() {
				return _prepend(_children,child);
			});
		});
		_defineMethod("insertChildBefore",function(reference,child) {
			return _childMod(child,function() {
				return _insertBefore(_children,reference,child);
			});
		});
		_defineMethod("insertChildAfter",function(reference,child) {
			return _childMod(child,function() {
				return _insertAfter(_children,reference,child);
			});
		});
		_defineMethod("removeChild",function(child) {
			return _childMod(child,function() {
				return _remove(_children,child);
			},null,_this2.hasChild);
		});
		_defineMethod("removeChildByName",function(name) {
			var child = _this2.getChildNamed(name);
			var res = typeof child !== "undefined";
			if (res) {
				res = _this2.removeChild(child);
			}
			return res;
		});
		_defineMethod("replaceChild",function(oldChild,newChild) {
			return _childMod(newChild,function() {
				var res = _replace(_children,oldChild,newChild);
				if (res) {
					_setChildParent(oldChild,null);
				}
				return res;
			});
		});
		_defineMethod("replaceChildByName",function(oldName,newChild) {
			var oldChild = _this2.getChildNamed(oldName);
			var res = typeof oldChild !== "undefined";
			if (res) {
				res = _this2.replaceChild(oldChild,newChild);
			}
			return res;
		});
		_defineMethod("clearChildren",function() {
			_wipeChildren();
		});
		_defineMethod("getChildrenWithEntry",function(entry,deep,pureArray) {
			return _childGroupGet(deep,pureArray,function(child) {
				return child.hasEntry(entry);
			});
		});
		_defineMethod("getChildrenWithAssociation",function(key,value,deep,pureArray) {
			return _childGroupGet(deep,pureArray,function(child) {
				return child.hasAssociation(key,value);
			});
		});
		_defineMethod("containedBy",function(node) {
			var res = _parent !== null;
			if (res) {
				if (_parent === node) {
					res = 1;
				} else {
					res = _parent.containedBy(node);
					if (res) {
						res++;
					}
				}
			}
			return res;
		});
		_defineMethod("contains",function(node) {
			return node.containedBy(_this2);
		});
		_defineMethod("compareDepth",function(node) {
			var res = undefined;
			if (_owner === node.owner) {
				res = _this2.containedBy(node);
				if (res) {
					res = -res;
				} else {
					res = _this2.contains(node);
					if (!res) {
						res = _parent !== null ? _parent.compareDepth(node) - 1 : undefined;
					}
				}
			}
			return res;
		});
		_defineMethod("getContents",function() {
			return _internalGetContents(0);
		});
		_defineMethod("getOuterContents",function() {
			return _internalGetOuterContents(0);
		});
		_defineMethod("getAllChildren",function(pureArray) {
			return _childGroupGet(true,pureArray,function() {
				return true;
			});
		});
		_defineMethod("setParent",function(value) {
			var oldParent = _parent;
			var res = value.appendChild(_this2);
			if (res) {
				oldParent.removeChild(_this2);
			}
			return res;
		});
		_defineMethod("setContents",function(value) {
			_wipe();
			value = ConfigParser.prepareContents(value,_name);
			_newLine = value.newLine;
			_success = _extractBlock(value.str,_owner,_parent);
		});
		_defineMethod("setOuterContents",function(value) {
			_wipe();
			value = ConfigParser.prepareOuterContents(value);
			_newLine = value.newLine;
			_success = _extractBlock(value.str,_owner,_parent);
		});

		if (typeof str !== "undefined") {
			_success = _extractBlock(str,owner,parent);
		}
	});

	_defineObject("Map",function(str) {
		var _this2 = this;
		var _globalNode;

		Object.defineProperty(this,"globalNode",{
			get: function() {
				return _globalNode;
			}
		});

		var _defineMethod = function(name,func) {
			Object.defineProperty(_this2,name,{
				value: func,
				writable: false,
				enumerable: false
			});
		};

		_defineMethod("getAllNodes",function(pureArray) {
			var res = [_globalNode].concat(_globalNode.getAllChildren(true));
			if (!pureArray) {
				res = _globalNode.childArrayToNode(res);
			}
			return res;
		});
		_defineMethod("createNode",function(name) {
			return new _this.Node(name+"{}",_globalNode.newLine,_this2);
		});
		_defineMethod("nodeIsPresent",function(node) {
			return _globalNode === node || _globalNode.hasChild(node,true);
		});
		_defineMethod("allNodesWithEntry",function(entry,pureArray) {
			var res = [];
			if (_globalNode.hasEntry(entry)) {
				res.push(_globalNode);
			}
			res = res.concat(_globalNode.getChildrenWithEntry(entry,true,true));
			if (!pureArray) {
				res = _globalNode.childArrayToNode(res);
			}
			return res;
		});
		_defineMethod("allNodesWithAssociation",function(key,value,pureArray) {
			var res = [];
			if (_globalNode.hasAssociation(key,value)) {
				res.push(_globalNode);
			}
			res = res.concat(_globalNode.getChildrenWithAssociation(key,value,true,true));
			if (!pureArray) {
				res = _globalNode.childArrayToNode(res);
			}
			return res;
		});
		_defineMethod("allNodesNamed",function(name,pureArray) {
			var res = [];
			if (_globalNode.name === name) {
				res.push(_globalNode);
			}
			res = res.concat(_globalNode.getChildrenNamed(name,true,true));
			if (!pureArray) {
				res = _globalNode.childArrayToNode(res);
			}	
			return res;
		});

		var contents = ConfigParser.prepareContents(str,_this.GLOBAL_BLOCK_NAME);
		_globalNode = new _this.Node(contents.str,contents.newLine,this);
	});
})();

