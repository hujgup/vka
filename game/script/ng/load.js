/*
TODO:
Load all .css files in style/app
*/

var Engine = new (function() {
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
		this.error = function(message) {
			_errors.push(" "+message);
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

	var _container;
	var _containerContent;
	var _localization;


	window.addEventListener("DOMContentLoaded",function() {
		_container = document.getElementById("container");
		_containerContent = container.innerHTML;
		var manager = new LoadCounter(4,_container);
		manager.onLoad = function() {
			_container.innerHTML = _containerContent;
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
		req.execute(function(res) {
			if (res.error) {
				manager.error(res.text);
			} else {
				manager.increment();
			}
		});
		var req2 = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadNg.php");
		req2.data = {
			file: "common/ng/objects.cfg"
		};
		req2.execute(function(res2) {
			if (res.error) {
				manager.error(res.text);
			} else {
				manager.increment();
			}
		});
		var req3 = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadNg.php");
		req3.data = {
			file: "common/ng/rooms.cfg"
		};
		req3.execute(function(res3) {
			if (res.error) {
				manager.error(res.text);
			} else {
				manager.increment();
			}
		});
		var req4 = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadLocalization.php");
		req4.data = {
			code: query.hasOwnProperty("lang") ? query.lang : "en";
		};
		req4.execute(function(res2) {
			if (res.error) {
				manager.error(res.text);
			} else {
				manager.increment();
			}
		});
	});
})();

