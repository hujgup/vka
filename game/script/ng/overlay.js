var OverlayUI = function(allowClickOff) {
	var _this = this;
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
	this.internalDispose = function(state,container) {
		// Things that should be done before the overlay is discarded
	};

	this.create = function() {
		_maxContainer = document.createElement("div");
			_maxContainer.className = "overlay-container-fixed";
			var relContainer = document.createElement("div");
				relContainer.className = "overlay-container-relative";
				if (allowClickOff) {
					relContainer.addEventListener("click",function() {
						_this.dispose();
					});
				}
				_container = document.createElement("div");
					_container.className = "overlay-container-absolute";
					if (allowClickOff) {
						_container.addEventListener("click",function(event) {
							// Don't destroy the overlay if the suer clicked somewhere on it
							event.stopPropagation();
						});
					}
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
	this.dispose = function() {
		this.clear();
		this.internalDispose(_state,_container);
		document.body.removeChild(_maxContainer);
		_maxContainer = null;
		_container = null;
		_state = null;
	};
};

