Object.defineProperty(this,"Emitter",{
	value: function(bindTo) {
		var _events = {};

		var _defineMethod = function(target,id,func) {
			Object.defineProperty(target,id,{
				value: func,
				enumerable: false,
				writable: false
			});
		};

		_defineMethod(this,"registerEvent",function(name) {
			_events[name] = [];
		});
		_defineMethod(this,"dispatchEvent",function(name,args) {
			args.sender = bindTo;
			_events[name].forEach(function(callback) {
				callback(args);
			});
		});

		_defineMethod(bindTo,"addEventListener",function(name,callback) {
			_events[name].push(callback);
		});
		_defineMethod(bindTo,"removeEventListener",function(name,callback) {
			var index = _events[name].indexOf(callback);
			if (index !== -1) {
				_events[name].splice(index,1);
			}
		});
	},
	enumerable: false,
	writable: false
});

