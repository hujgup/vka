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
	this.setupArgs = function(element,args) {
		return args;
	};
	this.onBegin = function(element,args) {
	};
	this.onUpdate = function(element,fracTime,args) {
	};
	this.onEnd = function(element,args) {
	};

	this.apply = function(element) {
		var args = arguments;
		return new Promise(function(resolve,reject) {
			try {
				args = _this.setupArgs(element,E.arrayLike.toArray(args).slice(1));
				_this.onBegin(element,args);
				_emitter.dispatchEvent(_evtBegin,{
					element: element,
					args: args
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
						_this.onUpdate(element,fracTime,args);
						_emitter.dispatchEvent(_evtUpdate,{
							element: element,
							fracTime: fracTime,
							args: args
						});
					} else {
						clearInterval(timer);
						_this.onEnd(element,args);
						_emitter.dispatchEvent(_evtEnd,{
							element: element,
							args: args
						});
						resolve();
					}
				},_this.tickRate);
			} catch (e) {
				reject(e);
			}
		},function(e) {
			console.error(e);
		});
	};
}

function FadeInTransition(time,tickRate) {
	Transition.call(this,time,tickRate);

	this.onBegin = function(element) {
		element.style.opacity = 0;
	};
	this.onUpdate = this.notImplemented;
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
	this.onUpdate = this.notImplemented;
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

function SmoothScroll(time,tickRate) {
	Transition.call(this,time,tickRate);

	this.setupArgs = function(element,args) {
		args =  {
			endX: args[0],
			endY: args[1],
			isDelta: args[2]
		};
		if (args.isDelta) {
			args.endX += element.scrollLeft;
			args.endY += element.scrollTop;
		}
		args.xM = args.endX - element.scrollLeft;
		args.xC = element.scrollLeft;
		args.yM = args.endY - element.scrollTop;
		args.yC = element.scrollTop;
		return args;
	};
	this.smoothingModifier = this.notImplemented;
	this.onUpdate = function(element,fracTime,args) {
		fracTime = this.smoothingModifier(fracTime);
		element.scrollLeft = args.xM*fracTime + args.xC;
		element.scrollTop = args.yM*fracTime + args.yC;
	};
	this.onEnd = function(element,args) {
		element.scrollLeft = args.endX;
		element.scrollTop = args.endY;
	};
}
SmoothScroll.prototype = Object.create(Transition.prototype);
SmoothScroll.prototype.constructor = SmoothScroll;
function LinearSmoothScroll(time,tickRate) {
	SmoothScroll.call(this,time,tickRate);

	this.smoothingModifier = function(fracTime) {
		return fracTime;
	};
}
LinearSmoothScroll.prototype = Object.create(SmoothScroll.prototype);
LinearSmoothScroll.prototype.constructor = LinearSmoothScroll;
function SrqtSmoothScroll(time,tickRate) {
	SmoothScroll.call(this,time,tickRate);

	this.smoothingModifier = function(fracTime) {
		return Math.sqrt(fracTime);
	};
}
SrqtSmoothScroll.prototype = Object.create(SmoothScroll.prototype);
SrqtSmoothScroll.prototype.constructor = SrqtSmoothScroll;

