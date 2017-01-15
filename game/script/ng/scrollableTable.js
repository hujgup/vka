function ScrollableTable(element) {
	if (element.nodeType !== Node.ELEMENT_NODE) {
		throw new TypeError("Invalid node type.");
	} else if (element.tagName.toLowerCase() !== ScrollableTable.TAG_NAME) {
		throw new TypeError("Element not a table.");
	}

	var _this = this;
	var _element = element;
	var _head = _element.getElementsByTagName("thead")[0];
	var _body = _element.getElementsByTagName("tbody")[0];
	var _rendered = false;
	var _frozen = false;
	var _needThawRender = false;

	var _unrender = function() {
		ScrollableTable.getCells(_head).forEach(function(cell) {
			cell.style.width = "";
		});
		ScrollableTable.getCells(_body).forEach(function(cell) {
			cell.style.width = "";
		});
	};

	this.onRender = function() {
	};
	this.freeze = function() {
		_frozen = true;
		_needThawRender = false;
	};
	this.thaw = function() {
		_frozen = false;
		if (_needThawRender) {
			_needThawRender = false;
			this.render();
		}
	};
	this.render = function() {
		if (_frozen) {
			_needThawRender = true;
		} else {
			_observer.disconnect();
			if (_rendered) {
				_unrender();
				this.onRender();
				var h = _element.offsetHeight; // Force a markup re-render
			} else {
				this.onRender();
			}
			var widths = [];
			ScrollableTable.getCells(_head).forEach(function(cell,i) {
				widths[i] = {
					head: cell.offsetWidth + ScrollableTable.WIDTH_ERROR_MARGIN,
					headCell: cell,
					body: 0,
					bodyCell: null
				};
			});
			ScrollableTable.getCells(_body).forEach(function(cell,i) {
				widths[i].body = cell.offsetWidth + ScrollableTable.WIDTH_ERROR_MARGIN;
				widths[i].bodyCell = cell;
			});
			widths.forEach(function(data) {
				var max = Math.max(data.head,data.body)+"px";
				data.headCell.style.width = max;
				if (data.bodyCell !== null) {
					data.bodyCell.style.width = max;
				}
			});
			_rendered = true;
			_setupObserver();
		}
	};
	this.dispose = function() {
		_observer.disconnect();
		_unrender();
		window.removeEventListener("resize",function() {
			_this.render();
		});
		ScrollableTable.memory.splice(ScrollableTable.memory.indexOf(this),1);
	};

	var _setupObserver = function() {
		_observer.observe(_element,{
			childList: true,
			attributes: true,
			characterData: true,
			subtree: true
		});
	};

	var _observer = new MutationObserver(function(records) {
		_this.render();
	});

	window.addEventListener("resize",function() {
		_this.render();
	});

	element.className = element.className.split(" ").concat([ScrollableTable.CLASS_NAME]).join(" ");
	_element.setAttribute(ScrollableTable.FLAG_ATTR,"");
	ScrollableTable.memory.push(this);
	this.render();
}
ScrollableTable.CLASS_NAME = "scrollable-table";
ScrollableTable.TAG_NAME = "table";
ScrollableTable.FLAG_ATTR = "data-st-seen";
ScrollableTable.WIDTH_ERROR_MARGIN = 10;
ScrollableTable.memory = [];
ScrollableTable.isValidNode = function(node) {
	return node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === ScrollableTable.TAG_NAME && node.className.split(" ").indexOf(ScrollableTable.CLASS_NAME) !== -1 && !node.hasAttribute(ScrollableTable.FLAG_ATTR);
};
ScrollableTable.getCells = function(container) {
	var firstRow = container.firstElementChild;
	return firstRow !== null ? firstRow.querySelectorAll("th, td") : [];
};
