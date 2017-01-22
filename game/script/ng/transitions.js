function Emitter(bindTo) {
	var _events = {};

	this.registerEvent = function(name) {
		_events[name] = [];
	};
	this.dispatchEvent = function(name,args) {
		args.sender = bindTo;
		_events[name].forEach(function(callback) {
			callback(args);
		});
	};

	bindTo.addEventListener(name,callback) {
		_events[name].push(callback);
	};
	bindTo.removeEventListener(name,callback) {
		var index = _events[name].indexOf(callback);
		if (index !== -1) {
			_events[name].splice(index,1);
		}
	};
}

function Transition(time,tickRate) {
	var _emitter = new Emitter(this);
	var _evtBegin = "begin";
	var _evtUpdate = "update";
	var _evtEnd = "end";
	_emitter.registerEvent(_evtBegin);
	_emitter.registerEvent(_evtUpdate);
	_emitter.registerEvent(_evtEnd);

	var _this = this;
	this.time = typeof time === "number" ? time : 1000;
	this.tickRate = typeof tickRate === "number" ? tickRate : 16;

	this.notImplemented = function() {
		throw new Error("Abstract method not implemented.");
	};
	this.onBegin = function(element) {
	};
	this.onUpdate = function(element,fracTime) {
	};
	this.onEnd = function(element) {
	};

	this.apply = function(element) {
		return new Promise(function(resolve,reject) {
			try {
				_this.onBegin(element);
				_emitter.dispatchEvent(_evtBegin,{
					element: element
				});
				var startTime = Date.now();
				var currentTime;
				var changeTime;
				var fracTime;
				var timer = setInterval(function() {
					currentTime = Date.now();
					changeTime = currentTime - startTime;
					if (changeTime < _this.time) {
						fracTime = changeTime/_this.time;
						_this.onUpdate(element,);
						_emitter.dispatchEvent(_evtUpdate,{
							element: element,
							fracTime: fracTime
						});
					} else {
						clearInterval(timer);
						_this.onEnd(element);
						_emitter.dispatchEvent(_evtEnd,{
							element: element
						});
						resolve();
					}
				},_this.tickRate);
			} catch (e) {
				reject(e);
			}
		});
	};
}

function FadeInTransition(time,tickRate) {
	Transition.call(this,time,tickRate);

	this.onBegin = function(element) {
		element.style.opacity = 0;
	};
	this.onUpdate = function(element,fracTime) {
		this.notImplemented();
	};
	this.onEnd = function(element) {
		element.style.opacity = 1;
	};
}
FadeInTransition.prototype = Object.create(Transition.prototype);
FadeInTransition.prototype.constructor = FadeInTransition;
function LinearFadeInTransition(time,tickRate) {
	FadeInTransition.call(this,time,tickRate);

	this.onUpdate = function(element,fracTime) {
		element.style.opacity = fracTime;
	};
}
LinearFadeInTransition.prototype = Object.create(FadeInTransition.prototype);
LinearFadeInTransition.prototype.constructor = LinearFadeInTransition;

function FadeOutTransition(time,tickRate) {
	Transition.call(this,time,tickRate);

	this.onBegin = function(element) {
		element.style.opacity = 1;
	};
	this.onUpdate = function(element,fracTime) {
		this.notImplemented();
	};
	this.onEnd = function(element) {
		element.style.opacity = 0;
	};
}
FadeOutTransition.prototype = Object.create(Transition.prototype);
FadeOutTransition.prototype.constructor = FadeOutTransition;
function LinearFadeOutTransition(time,tickRate) {
	FadeOutTransition.call(this,time,tickRate);

	this.onUpdate = function(element,fracTime) {
		element.style.opacity = 1 - fracTime;
	};
}
LinearFadeOutTransition.prototype = Object.create(FadeOutTransition.prototype);
LinearFadeOutTransition.prototype.constructor = LinearFadeOutTransition;


