if (typeof Number.isInteger === "undefined") {
	Number.isInteger = function(value) {
		return typeof value === "number" && !Number.isNaN(value) && isFinite(value) && value%0 === 0;
	};
}
function compareNumbers(a,b) {
	var res;
	var aIsNaN = Number.isNaN(a);
	var bIsNaN = Number.isNaN(b);
	// NaN's bubble to left
	if (aIsNaN) {
		if (bIsNaN) {
			res = 0;
		} else {
			res = -1;
		}
	} else if (bIsNaN) {
		res = 1;
	} else {
		// Everything else do as normal
		if (a < b) {
			res = -1;
		} else if (a > b) {
			res = 1;
		} else {
			res = 0;
		}
	}
	return res;
}
function decodeHtmlEntities(str) {
	var textarea = document.createElement("textarea");
	textarea.innerHTML = str;
	return textarea.value;
}
function cloneChildrenArray(arr,offset) {
	var res = [];
	for (var i = offset; i < arr.length; i++) {
		res.push(arr[i]);
	}
	return res;
}

function partition(arr,comparer,low,high) {
	var pivotIndex = Math.round((high - low)/2) + low;
	var pivot = arr[pivotIndex];
	var i = low - 1;
	var j = high + 1;
	var cnt = true;
	var res;
	while (cnt) {
		do {
			i++;
		} while (comparer(arr[i],pivot) < 0);
		do {
			j--;
		} while (comparer(arr[j],pivot) > 0);
		if (i >= j) {
			res = j;
			cnt = false;
		} else {
			var tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}
	}
}
function quickSortStep(arr,comparer,low,high) {
	if (low < high) {
		var p = partition(arr,comparer,low,high);
		quickSortStep(arr,comparer,low,p);
		quickSortStep(arr,comparer,p + 1,high);
	}
}
function quickSort(arr,comparer) {
	quickSortStep(arr,comparer,0,arr.length - 1);
}

var SortPresets = {
	getRetainOrder: function() {
		return function(a,b) {
			return 0;
		};
	},
	getInitialOrder: function(initialOrder) {
		return function(a,b) {
			a = initialOrder.indexOf(a.parentElement);
			b = initialOrder.indexOf(b.parentElement);
			return compareNumbers(a,b);
		};
	},
	getNumeric: function() {
		return function(a,b) {
			a = parseFloat(decodeHtmlEntities(a.textContent));
			b = parseFloat(decodeHtmlEntities(b.textContent));
			return compareNumbers(a,b);
		};
	},
	getAscii: function(trim,noCase) {
		return function(a,b) {
			a = decodeHtmlEntities(a.textContent);
			b = decodeHtmlEntities(b.textContent);
			if (trim) {
				a = a.trim();
				b = b.trim();
			}
			if (noCase) {
				a = a.toLowerCase();
				b = b.toLowerCase();
			}
			return a.localeCompare(b);
		};
	}
};

function SortColumn(table,heading,colIndex,rows,rowParent) {
	var preset = heading.getAttribute("data-sort-preset");
	var comparer = heading.getAttribute("data-sort-comparer");
	var hasPreset = preset !== null;
	var hasComparer = comparer !== null;

	if (hasPreset && hasComparer) {
		throw new Error(table,heading,"data-sort-preset and data-sort-comparer are mutually exclusive.");
	} else {
		this.isSortable = preset !== null || comparer !== null;

		var initialOrder = rows.slice(0);
		var comparerFunc;
		if (hasPreset) {
			switch (preset) {
				case "retain-order":
					comparerFunc = SortPresets.getRetainOrder();
					break;
				case "initial-order":
					comparerFunc = SortPresets.getInitialOrder(initialOrder);
					break;
				case "numeric":
					comparerFunc = SortPresets.getNumeric();
					break;
				case "ascii":
					comparerFunc = SortPresets.getAscii(false,false);
					break;
				case "ascii-trim":
					comparerFunc = SortPresets.getAscii(true,false);
					break;
				case "ascii-nocase":
					comparerFunc = SortPresets.getAscii(false,true);
					break;
				case "ascii-trim-nocase":
					comparerFunc = SortPresets.getAscii(true,true);
					break;
				default:
					throw new Error("Unknown sort preset "+preset+".");
			}
		} else if (hasComparer) {
			var path = comparer.split(".");
			var context = window;
			for (var i = 0; i < path.length; i++) {
				context = context[path[i]];
			}
			comparerFunc = context;
			if (typeof comparerFunc !== "function") {
				throw new Error(comparer+" is not a function.");
			}
		}

		this.sort = function(descending) {
			if (this.isSortable) {
				quickSort(rows,function(a,b) {
					a = a.children[colIndex];
					b = b.children[colIndex];
					var res = comparerFunc(a,b);
					if (descending) {
						res = -res;
					}
					return res;
				});
				while (rowParent.children.length > 1) {
					// Ignoring the heading row
					rowParent.removeChild(rowParent.children[1]);
				}
				for (var i = 0; i < rows.length; i++) {
					rowParent.appendChild(rows[i]);
				}
			}
		};
	}
}
function SortableTable(table) {
	var _this = this;

	this.error = true;
	var headings = [];
	var headingTr = table.querySelector("tr");

	if (headingTr !== null) {
		var child;
		for (var i = 0; i < headingTr.children.length; i++) {
			child = headingTr.children[i];
			if (child.tagName.toLowerCase() === "th" && child.getAttribute("scope") === "col") {
				headings.push(child);
			} else {
				console.error(table,"Heading tr child is not a th or does not have scope=\"col\" set.");
			}
		}
		if (headings.length === headingTr.children.length) {
			this.error = false;
		}
	} else {
		console.error(table,"No tr elements present.");
	}

	if (!this.error) {
		var rowParent = headingTr.parentElement;
		var rows = cloneChildrenArray(rowParent.children,1);
		this.id = table.id;
		this.columns = [];
		for (var i = 0; i < headings.length; i++) {
			this.columns.push(new SortColumn(table,headings[i],i,rows,rowParent));
		}

		var _userSortingEnabled = false;
		var _setupHeading = function(heading,data,index) {
			var a = document.createElement("a");
				a.href = "javascript:void(0);";
				a.style.display = "inline-block";
				a.style.width = "100%";
				a.style.height = "100%";
				a.addEventListener("click",function() {
					if (data.sortColumn === index) {
						data.sortDescending = !data.sortDescending;
					} else {
						data.sortColumn = index;
						data.sortDescending = false;
					}
					_this.columns[index].sort(data.sortDescending);
				});
				var toMove = [];
				for (var i = 0; i < heading.childNodes.length; i++) {
					toMove.push(heading.childNodes[i]);
				}
				for (var i = 0; i < toMove.length; i++) {
					heading.removeChild(toMove[i]);
					a.appendChild(toMove[i]);
				}
			heading.appendChild(a);
		};
		this.enableUserSorting = function() {
			if (!_userSortingEnabled) {
				var data = {
					sortColumn: 0,
					sortDescending: false
				};
				for (var i = 0; i < headings.length; i++) {
					_setupHeading(headings[i],data,i);
				}
			}
		};
	}
}

var sortTables = [];
function getSortTableById(id) {
	var res;
	for (var i = 0; i < sortTables.length; i++) {
		if (sortTables[i].id === id) {
			res = sortTables[i];
			i = sortTables.length;
		}
	}
	return res;
}
window.addEventListener("DOMContentLoaded",function() {
	var tables = document.querySelectorAll("table[data-sortable]");
	var attempt;
	for (var i = 0; i < tables.length; i++) {
		attempt = new SortableTable(tables[i]);
		if (!attempt.error) {
			sortTables.push(attempt);
		}
	}
});


