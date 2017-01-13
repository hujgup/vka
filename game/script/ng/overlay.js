var OverlayUI = function(allowClickOff) {
	var _this = this;
	var _mask = null;
	var _maxContainer = null;
	var _container = null;
	var _state = null;

	var _notImplemented = function() {
		throw new Error("Abstract method not implemented.");
	};

	// Override by subclassing
	this.internalCreate = function() {
		// Creates the markup structure of the overlay
		_notImplemented();
	};
	this.internalClear = function(state,container) {
		// Resets the state of the overlay to a known default state
		_notImplemented();
	};
	this.getPopulationData = function() {
		// Gets the data to populate the overlay with
		_notImplemented();
	};
	this.internalPopulate = function(state,data,container) {
		// Converts data to a populated overlay
		_notImplemented();
	};
	this.internalDestroy = function(state,container) {
		// Things that should be done before the overlay is discarded
	};

	this.create = function() {
		_mask = document.createElement("div");
			_mask.className = "overlay-mask";
			if (allowClickOff) {
				_mask.addEventListener("click",function() {
					_this.destroy();
				});
			}
		document.body.appendChild(_mask);
		_maxContainer = document.createElement("div");
			_maxContainer.className = "overlay-container-fixed";
			var relContainer = document.createElement("div");
				relContainer.className = "overlay-container-relative";
				_container = document.createElement("div");
					_container.className = "overlay-container-absolute";
				relContainer.appendChild(_container);
			_maxContainer.appendChild(relContainer);
		document.body.appendChild(_maxContainer);
		_state = this.internalCreate(_container);
		this.populate();
	};
	this.clear = function() {
		this.internalClear(_state,_container);
	};
	this.populate = function() {
		this.clear();
		this.internalPopulate(_state,this.getPopulationData(),_container);
	};
	this.destroy = function() {
		this.clear();
		this.internalDestroy(_state,_container);
		document.body.removeChild(_maxContainer);
		document.body.removeChild(_mask);
		_maxContainer = null;
		_container = null;
		_mask = null;
		_state = null;
	};
};

var TestUI = function(allowClickOff) {
	OverlayUI.call(this,allowClickOff);
	var i = 0;
	this.internalCreate = function(container) {
		var div = document.createElement("div");
			div.style.left = "0";
			div.style.top = "0";
			div.style.width = "100%";
			div.style.height = "100%";
			div.style.backgroundColor = "blue";
		container.appendChild(div);
		return div;
	};
	this.internalClear = function(div) {
		div.textContent = "";
	};
	this.getPopulationData = function() {
		return i++;
	};
	this.internalPopulate = function(div,data) {
		div.textContent = data;
	};
};
TestUI.prototype = Object.create(OverlayUI.prototype);
TestUI.prototype.constructor = TestUI;


