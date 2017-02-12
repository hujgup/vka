Object.defineProperty(this,"E",{
	value: new (function() {
		var _this = this;
		var close = function(f) {
			return Object.freeze(new f());
		};
		this.default = close(function() {
			var _this2 = this;
			var _typeOfCache = {};
			var _getTypeOfFunc = function(type) {
				if (!_typeOfCache.hasOwnProperty(type)) {
					_typeOfCache[type] = function(obj) {
						return typeof obj === type;
					};
				}
				return _typeOfCache[type];
			};
			var _undefCnd = function(obj) {
				return typeof obj !== "undefined";
			};
			var _nullCnd = function(obj) {
				return obj !== null;
			};
			var _undefOrNullCnd = function(obj) {
				return _undefCnd(obj) && _nullCnd(obj);
			};
			var _funcs = {
				isTypeOf: function(obj,fallback,type) {
					return this.freeform(obj,fallback,_getTypeOfFunc(type));
				},
				isNotUndefined: function(obj,fallback) {
					return this.freeform(obj,fallback,_undefCnd);
				},
				isNotNull: function(obj,fallback) {
					return this.freeform(obj,fallback,_nullCnd);
				},
				isNotNullOrUndefined: function(obj,fallback) {
					return this.freeform(obj,fallback,_undefOrNullCnd);
				},
				isInstanceOf: function(obj,fallback,ctor) {
					return this.freeform(obj,fallback,function(o) {
						return o instanceof ctor;
					});
				}
			};
			var _setFunc = function(obj,func) {
				return function() {
					func.apply(obj,arguments);
				};
			};
			var _applyFuncs = function(obj) {
				for (var key in _funcs) {
					if (_funcs.hasOwnProperty(key)) {
						obj[key] = _setFunc(_funcs[key]);
					}
				}
			};
			this.premade = close(function() {
				var _this3 = this;
				this.freeform = function(obj,fallback,condition) {
					return condition(obj) ? obj : fallback;
				};
				_applyFuncs(this);
			});
			this.build = close(function() {
				var _this3 = this;
				this.freeform = function(obj,fallback,condition) {
					return condition(obj) ? obj : fallback();
				};
				_applyFuncs(this);
			});
		});
		var _iterationCallback = function(callback,thisArg,value,key,instance) {
			return typeof thisArg !== "undefined" ? callback.call(thisArg,value,key,instance) : callback(value,key,instance);
		};
		var _everyOrSome = function(obj,callback,thisArg,iterator) {
			return !iterator(obj,function(value,key) {
				return !_iterationCallback(callback,thisArg,value,key,obj);
			});
		};
		var _forEach = function(obj,callback,thisArg,iterator,returnValue) {
			iterator(obj,function(value,key) {
				_iterationCallback(callback,thisArg,value,key,obj);
				return returnValue;
			});
		};
		var _map = function(obj,callback,thisArg,iterator,mapObj,assigner) {
			return _filter(obj,function(value,key) {
				return true;
			},undefined,iterator,mapObj,function(mo,value,key) {
				assigner(mapObj,_iterationCalback(callback,thisArg,value,key,obj),key,obj);
			});
		};
		var _filter = function(obj,callback,thisArg,iterator,mapObj,assigner) {
			iterator(obj,function(value,key) {
				if (_iterationCallback(callback,thisArg,value,key,obj)) {
					assigner(mapObj,value,key,obj);
				}
			});
			return mapObj;
		};
		var _reduce = function(obj,callback,initialValue,iterator) {
			var firstPass = true;
			var hasInitialValue;
			var accumulator;
			iterator(obj,function(value,key) {
				if (firstPass) {
					hasInitialValue = typeof initialValue !== "undefined";
					if (hasInitialValue) {
						accumulator = callback(initialValue,value,key,obj);
					} else {
						accumulator = value;
					}
				} else {
					accumulator = callback(accumulator,value,key,obj);
				}
			});
			return accumulator;
		};
		var _reverseIterator = function(obj,callback) {
			for (var i = obj.length - 1; i >= 0; i--) {
				if (obj.hasOwnProperty(i)) {
					callback(obj[i],i,obj);
				}
			}
		};
		var _findIndex = function(obj,callback,thisArg,iterator,defaultValue,flipBreaker) {
			var brk;
			var res = defaultValue;
			iterator(obj,function(value,key) {
				brk = _iterationCallback(callback,thisArg,value,key,obj);
				if (brk) {
					res = key;
				}
				if (flipBreaker) {
					brk = !brk;
				}
				return brk;
			});
			return res;
		};
		var _find = function(obj,callback,thisArg,findIndex,defaultValue) {
			var res = findIndex(obj,callback,thisArg);
			if (res !== defaultValue) {
				res = obj[res];
			} else {
				res = undefined;
			}
			return res;
		};
		this.jsonObject = close(function() {
			var _this2 = this;
			this.some = function(obj,callback,thisArg) {
				var res = false;
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						res = _iterationCallback(callback,thisArg,obj[key],key,obj);
						if (res) {
							break;
						}
					}
				}
				return res;
			};
			this.every = function(obj,callback,thisArg) {
				return _everyOrSome(obj,callback,thisArg,this.some);
			};
			this.forEach = function(obj,callback,thisArg) {
				_forEach(obj,callback,thisArg,this.some,false);
			};
			this.map = function(obj,callback,thisArg) {
				return _map(obj,callback,thisArg,this.forEach,{},function(mapObj,item) {
					mapObj[item.key] = item.value;
				});
			};
			this.filter = function(obj,callback,thisArg) {
				return _filter(obj,callback,thisArg,this.forEach,{},function(mapObj,value,key) {
					mapObj[key] = value;
				});
			};
			this.reduce = function(obj,callback,initialValue) {
				return _reduce(obj,callback,initialValue,this.forEach);
			};
			this.findKey = function(obj,callback,thisArg) {
				return _findIndex(obj,callback,thisArg,this.some,undefined,false);
			};
			this.find = function(obj,callback,thisArg) {
				return _find(obj,callback,thisArg,this.findKey,undefined);
			};
			this.shallowClone = function(obj) {
				return _this2.map(obj,function(value,key) {
					return {
						key: key,
						value: value
					};
				});
			};
			this.deepClone = function(obj) {
				return JSON.parse(JSON.stringify(obj));
			};
		});
		this.number = close(function() {
			var _this2 = this;
			this.compare = function(a,b) {
				var res = 0;
				if (a < b) {
					res = -1;
				} else if (a > b) {
					res = 1;
				}
				return res;
			};
		});
		this.boolean = close(function() {
			var _this2 = this;
			this.compare = function(a,b) {
				return _this.number.compare(a,b);
			};
		});
		this.string = close(function() {
			var _this2 = this;
			this.toXml = function(str) {
				return (new DOMParser()).parseFromString(str,"text/xml");
			};
			this.toHtml = function(str) {
				return (new DOMParser()).parseFromString(str,"text/html");
			};
			this.getRenderedTextDimensions = function(str,cssFont,asHtml) {
				asHtml = typeof asHtml === "boolean" ? asHtml : false;
				var div = document.createElement("div");
					div.style.width = "auto";
					div.style.height = "auto";
					div.style.position = "absolute";
					div.style.visibility = "hidden";
					div.style.whiteSpace = "nowrap";
					div.style.font = cssFont;
					if (asHtml) {
						div.innerHTML = str;
					} else {
						div.textContent = str;
					}
				document.body.appendChild(div);
				var res = {
					width: div.clientWidth + 1,
					height: div.clientHeight + 1
				};
				document.body.removeChild(div);
				return res;
			};
			this.every = function(str,callback,thisArg) {
				return _this.array.every(str,callback,thisArg);
			};
			this.some = function(str,callback,thisArg) {
				return _this.array.some(str,callback,thisArg);
			};
			this.forEach = function(str,callback,thisArg) {
				_this.array.forEach(str,callback,thisArg);
			};
			this.map = function(str,callback,thisArg) {
				return _this.array.map(str,callback,thisArg).join("");
			};
			this.filter = function(str,callback,thisArg) {
				return _this.array.filter(str,callback,thisArg).join("");
			};
			this.reduce = function(str,callback,initialValue) {
				return _this.array.reduce(str,callback,initialValue);
			};
			this.reduceRight = function(str,callback,initialValue) {
				return _this.array.reduceRight(str,callback,initialValue);
			};
			this.findIndex = function(str,callback,thisArg) {
				return _this.array.findIndex(str,callback,thisArg);
			};
			this.find = function(str,callback,thisArg) {
				return _this.array.findIndex(str,callback,thisArg);
			};
			this.xmlEncode = function(str) {
				var specialChars = {
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					"'": "&apos;",
					"\"": "&quot;"
				};
				var code;
				return _this2.map(str,function(char,index) {
					code = str.charCodeAt(index);
					if (code >= 127 || code < 32) {
						// ASCII control characters or non-ASCII characters
						return "&#x"+code.toString(16)+";";
					} else if (specialChars.hasOwnProperty(char)) {
						// XML special characters
						return specialChars[char];
					} else {
						// Renderable ASCII characters
						return char;
					}
				});
			};
			this.xmlDecode = function(str) {
				var textarea = document.createElement("textarea");
				textarea.innerHTML = str;
				return textarea.value;
			};
			this.localeCompareCaseInsensitive = function(a,b) {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			};
		});
		this.array = close(function() {
			var _this2 = this;

			if (!Array.isArray) {
				Array.isArray = function(arr) {
					return Object.prototype.toString.call(arr) === "[object Array]";
				};
			}
			if (!Array.prototype.every) {
				Array.prototype.every = function(callback,thisArg) {
					var res = true;
					for (var i = 0; res && i < this.length; i++) {
						res = _iterationCallback(callback,thisArg,this[i],i,this);
					}
					return res;
				};
			}
			if (!Array.prototype.some) {
				Array.prototype.some = function(callback,thisArg) {
					return _everyOrSome(this,callback,thisArg,Array.prototype.every.call);
				};
			}
			if (!Array.prototype.forEach) {
				Array.prototype.forEach = function(callback,thisArg) {
					return _forEach(this,callback,thisArg,Array.prototype.every.call,true);
				};
			}
			if (!Array.prototype.map) {
				Array.prototype.map = function(callback,thisArg) {
					return _map(this,callback,thisArg,Array.prototype.forEach.call,[],function(mapObj,value) {
						mapObj.push(value);
					});
				};
			}
			if (!Array.prototype.filter) {
				Array.prototype.filter = function(callback,thisArh) {
					return _filter(this,callback,thisArg,Array.prototype.forEach.call,[],function(mapObj,value) {
						mapObj.push(value);
					});
				};
			}
			if (!Array.prototype.reduce) {
				Array.prototype.reduce = function(callback,initialValue) {
					return _reduce(this,callback,thisArg,Array.prototype.forEach.call);
				};
			}
			if (!Array.prototype.reduceRight) {
				Array.prototype.reduceRight = function(callback,initialValue) {
					return _reduce(this,callback,thisArg,_reverseIterator);
				};
			}
			if (!Array.prototype.findIndex) {
				Array.prototype.findIndex = function(callback,thisArg) {
					return _findIndex(this,callback,thisArg,Array.prototype.every.call,-1,true);
				};
			}
			if (!Array.prototype.find) {
				Array.prototype.find = function(callback,thisArg) {
					return _find(this,callback,thisArg,Array.prototype.findIndex.call,-1);
				};
			}

			this.isArrayPrototype = function(arr) {
				return Array.isArray(arr) || arr instanceof Array;
			};
			this.shallowClone = function(arr) {
				return Array.prototype.slice.call(arr);
			};
			this.deepClone = function(arr,cloner) {
				return _this.array.map(arr,cloner);
			};
			this.getArithmeticMean = function(arr) {
				return _this.array.reduce(arr,function(mean,value) {
					mean += value/arr.length;
					return mean;
				},0);
			};
			this.getGeometricMean = function(arr) {
				return _thus.array.reduce(arr,function(mean,value) {
					mean *= sqrt(value);
					return mean;
				},1);
			};
			this.getHarmonicMean = function(arr) {
				return arr.length/_this.array.reduce(arr,function(mean,value) {
					mean += 1/value;
					return mean;
				},0);
			};
			this.getMedian = function(arr) {
				var res;
				if (arr.length > 1) {
					arr = this.shallowClone(arr).sort(_this.number.compare);
					var l2 = arr.length/2;
					if (arr.length%2 === 0) {
						res = arr[l2];
					} else {
						res = arr[Math.floor(l2)]/2 + arr[Math.ceil(l2)]/2;
					}
				} else if (arr.length === 1) {
					res = arr[0];
				}
				return res;
			};
			this.remove = function(arr,item) {
				return this.removeByIndex(arr,arr.indexOf(item));
			};
			this.removeByIndex = function(arr,index) {
				var res = index >= 0 && index < arr.length;
				if (res) {
					arr.splice(index,1);
				}
				return res;
			};
			this.every = function(arr,callback,thisArg) {
				return Array.prototype.every.call(arr,callback,thisArg);
			};
			this.some = function(arr,callback,thisArg) {
				return Array.prototype.some.call(arr,callback,thisArg);
			};
			this.forEach = function(arr,callback,thisArg) {
				Array.prototype.forEach.call(arr,callback,thisArg);
			};
			this.map = function(arr,callback,thisArg) {
				return Array.prototype.map.call(arr,callback,thisArg);
			};
			this.filter = function(arr,callback,thisArg) {
				return Array.prototype.filter.call(arr,callback,thisArg);
			};
			this.reduce = function(arr,callback,initialValue) {
				return Array.prototype.reduce.call(arr,callback,initialValue);
			};
			this.reduceRight = function(arr,callback,initialValue) {
				return Array.prototype.reduceRight.call(arr,callback,initialValue);
			};
			this.findIndex = function(arr,callback,thisArg) {
				return Array.prototype.findIndex.call(arr,callback,thisArg);
			};
			this.find = function(arr,callback,thisArg) {
				return Array.prototype.find.call(arr,callback,thisArg);
			};
			this.inlineMap = function(arr,callback,thisArg) {
				_this.array.forEach(arr,function(value,index) {
					arr[index] = _iterationCallback(callback,thisArg,arr[index],index,arr);
				});
			};
			this.inlineFilter = function(arr,callback,thisArg) {
				this.inlineFilterRetainKeys(arr,callback,thisArg);
				// Compress elements
				var i = 0;
				_this.array.forEach(arr,function(value,index) {
					arr[i] = arr[index];
					i++;
				});
				// Remove excess elements
				arr.length = i;
			};
			this.inlineFilterRetainKeys = function(arr,callback,thisArg) {
				_this.array.forEach(arr,function(value,index) {
					if (!_iterationCallback(callback,thisArg,value,index,arr)) {
						delete arr[index];
					}
				});
			};
			this.trimAll = function(arr) {
				this.inlineMap(arr,function(value) {
					return value.trim();
				});
			};
			this.insertArray = function(arr,toInsert,start,deleteCount) {
				deleteCount = _this.default.premade.isTypeOf(deleteCount,0,"number");
				arr.splice.apply(arr,[start,deleteCount].concat(toInsert));
			};
		});
		this.arrayLike = close(function() {
			var _this2 = this;
			var _eq = function(a,b,cmp) {
				var res = a.length === b.length;
				if (res) {
					var value2;
					res = _this2.every(a,function(value,index) {
						value2 = b[index];
						if (_this2.isArrayLike(value)) {
							return _this2.isArrayLike(value2) ? _eq(value,value2,cmp) : false;
						} else {
							return _this2.isArrayLike(value2) ? false : cmp(value,b[index]);
						}
					});
				}
				return res;
			};
			var _hardEq = function(a,b) {
				return a === b;
			};
			var _softEq = function(a,b) {
				return a == b;
			};
			this.isArrayLike = function(arr) {
				var res = _this.array.isArrayPrototype(arr);
				if (!res) {
					var str = Object.prototype.toString.call(arr);
					// "arr instanceof X fails" for older browsers where X does not exist
					// Still fails in IE < 9
					res = str === "[object HTMLCollection]" || str === "[object NodeList]";
				}
				return res;
			};
			this.toArray = function(arr) {
				var res;
				if (_this.array.isArrayPrototype(arr)) {
					res = arr;
				} else {
					res = Array.prototype.slice.call(arr);
				}
				return res;
			};
			this.equals = function(a,b) {
				return _eq(a,b,_hardEq);
			};
			this.softEquals = function(a,b) {
				return _eq(a,b,_softEq);
			};
			this.every = function(arr,callback,thisArg) {
				return _this.array.every(arr,callback,thisArg);
			};
			this.some = function(arr,callback,thisArg) {
				return _this.array.some(arr,callback,thisArg);
			};
			this.forEach = function(arr,callback,thisArg) {
				_this.array.forEach(arr,callback,thisArg);
			};
			this.map = function(arr,callback,thisArg) {
				return _this.array.map(arr,callback,thisArg);
			};
			this.filter = function(arr,callback,thisArg) {
				return _this.array.filter(arr,callback,thisArg);
			};
			this.reduce = function(arr,callback,initialValue) {
				return _this.array.reduce(arr,callback,initialValue);
			};
			this.reduceRight = function(arr,callback,initialValue) {
				return _this.array.reduceRight(arr,callback,initialValue);
			};
			this.findIndex = function(arr,callback,thisArg) {
				return _this.array.findIndex(arr,callback,thisArg);
			};
			this.find = function(arr,callback,thisArg) {
				return _this.array.find(arr,callback,thisArg);
			};
			this.extract = function(arr,key) {
				return this.map(arr,function(value) {
					return value[key];
				});
			};
			this.shuffle = function(arr,randomizer) {
				randomizer = _this.default.premade.isTypeOf(randomzier,Math.random,"function");
				// Fisher-Yates shuffle
				var length = arr.length;
				var index;
				var temp;
				while (length !== 0) {
					index = Math.floor(randomizer()*length--);
					temp = arr[length];
					arr[length] = arr[index];
					arr[index] = temp;
				}
			};
			this.getMode = function(arr,equalityChecker) {
				equalityChecker = _this.default.premade.isTypeOf(equalityChecker,function(a,b) {
					return a === b;
				},"function");
				// {} limited to string keys, Map has limited support
				var modes = [];
				var values = [];
				var occurances = [];
				var modeNumber = 0;
				var index;
				this.forEach(arr,function(value) {
					index = this.indexOf(values,value,equalityChecker);
					if (index !== -1) {
						occurances[index]++;
					} else {
						index = values.length;
						values.push(value);
						occurances.push(1);
					}
					if (occurances[index] > modeNumber) {
						modes = [values[index]];
						modeNumber = occurances[index];
					} else if (occurances[index] === modeNumber) {
						modes.push(values[index]);
					}
				},this);
				return {
					modeNumber: modeNumber,
					values: modes
				};
			};
			this.unique = function(arr) {
				var seen = [];
				var push;
				return _this2.filter(arr,function(value) {
					push = seen.indexOf(value) === -1;
					if (push) {
						seen.push(value);
					}
					return push;
				});
			};
			this.indexOf = function(arr,item) {
				return Array.prototype.indexOf.call(arr,item);
			};
			this.lastIndexOf = function(arr,item) {
				return Array.prototype.lastIndexOf.call(arr,item);
			};
			this.contains = function(arr,item) {
				return this.indexOf(arr,item) !== -1;
			};
			this.slice = function(arr,begin,end) {
				return Array.prototype.slice.call(arr,begin,end);
			};
			this.splice = function(arr,start,deleteCount) {
				return Array.prototype.splice.apply(arr,this.slice(arguments,1));
			};
		});
		this.iteratable = close(function() {
			var _this2 = this;
			var _assigner = function(mapObj,value) {
				mapObj.push(value);
			};
			this.toArray = function(iteratable) {
				return this.map(iteratable,function(value) {
					return value;
				});
			};
			this.equals = function() {

			};
			this.softEquals = function() {

			};
			this.forEach = function(iteratable,callback,thisArg) {
				var v = iteratable.next();
				while (!v.done) {
					_iterationCallback(callback,thisArg,v.value,iteratable);
				}
			};
			this.every = function(iteratable,callback,thisArg) {
				var res = true;
				this.forEach(iteratable,function(value) {
					if (res) {
						res = _iterationCallback(callback,thisArg,valuemiteratable);
					}
				});
			};
			this.some = function(iteratable,callback,thisArg) {
				return _everyOrSome(iteratable,callback,thisArg,this.every);
			};
			this.map = function(iteratable,callback,thisArg) {
				return _map(iteratable,callback,thisArg,this.forEach,[],_assigner);
			};
			this.filter = function(iteratable,callback,thisArg) {
				return _filter(iteratable,callback,thisArg,this.forEach,[],_assigner);
			};
			this.reduce = function(iteratable,callback,initialValue) {
				return _reduce(iteratable,callback,initialValue,this.forEach);
			};
			this.find = function(iteratable,callback,thisArg) {
				var res;
				var brk;
				this.some(iteratable,function(value) {
					brk = _iterationCallback(callback,thisArg,value,iteratable);
					if (brk) {
						res = value;
					}
					return brk;
				});
				return res;
			};
		});
		this.node = close(function() {
			var _this2 = this;
			this.shallowClone = function(node) {
				return node.cloneNode(false);
			};
			this.deepClone = function(node) {
				return node.cloneNode(true);
			};
			this.prependChild = function(node,child) {
				if (node.hasChildNodes()) {
					node.insertBefore(child,node.firstChild);
				} else {
					node.appendChild(child);
				}
			};
			this.insertAfter = function(node,newNode,referenceNode) {
				if (referenceNode === null) {
					this.prependChild(node,newNode);
				} else {
					var index = _this.arrayLike.indexOf(node.childNodes,referenceNode);
					if (index !== -1) {
						node.insertBefore(newNode,node.childNodes[index]);
					}
				}
				return newNode;
			};
		});
		this.mouse = close(function() {
			var _this2 = this;
			this.x = -1;
			this.y = -1;
			window.addEventListener("mousemove",function(event) {
				_this2.x = event.pageX;
				_this2.y = event.pageY;
			});
		});
		this.function = close(function() {
			var _this2 = this;
			this.constructorApply = function(ctor) {
				return new (Function.prototype.bind.apply(ctor,_this.arrayLike.splice(arguments,1)));
			};
		});
	})(),
	enumerable: false,
	writable: false
});

