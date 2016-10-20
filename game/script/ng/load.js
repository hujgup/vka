/*
TODO:
Load all .css files in style/app
Load all .js files in script/app
	Look up load order in loadOrder.json, and put them in that order
*/

const Engine = new (function() {
	var _container;
	var _containerContent;

	const LoadCounter = function(max,container) {
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

	window.addEventListener("DOMContentLoaded",function() {
		_container = document.getElementById("container");
		_containerContent = container.innerHTML;
		const manager = new LoadCounter(1,_container);
		manager.onLoad = function() {
			_container.innerHTML = _containerContent;
		};
		var req = new AJAXRequest(HTTPMethods.POST,"script/ng/io/loadStyling.php");
		req.execute(function(res) {
			if (res.error) {
				manager.error(res.text);
			} else {
				manager.increment();
			}
		});
	});
})();

