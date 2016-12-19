function parseQueryString() {
	var res = {};
	if (location.search.length > 0) {
		var pairs = location.search.substr(1).split("&");
		var pair;
		for (var i = 0; i < pairs.length; i++) {
			pair = pairs[i].split("=");
			res[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}
	}
	return res;
}
function getTextColor(r,g,b) {
	var res;
	if (typeof r === "string") {
		var hex = r.substr(1);
		r = parseInt(hex.substr(0,2),16);
		g = parseInt(hex.substr(2,2),16);
		b = parseInt(hex.substr(4,2),16);
	}
	return Math.sqrt(0.241*r*r + 0.691*g*g + 0.068*b*b) < 130 ? "white" : "black";
}

function TagNode(contentNode,parentNode) {
	this.isRoot = !parentNode.hasOwnProperty("isRoot");
	this.parentNode = parentNode;
	this.contentNode = contentNode;

	if (this.isRoot) {
		this.depth = 0;
		this.navigationNode = document.createElement("div");
		this.title = "Root";
		this.tags = [];
	} else {
		this.depth = parentNode.depth + 1;
		this.navigationNode = document.createElement("li");
		this.title = contentNode.querySelector("[data-title]").textContent;
		this.tags = parentNode.tags.concat(TagNode.extractTags(contentNode));
	}

	this.childrenElement = document.createElement("ol");
	this.childrenElement.className = "nav-list nav-list-"+this.depth;

	var _contentInitDisplay = getComputedStyle(contentNode).display;
	var _navigationInitDisplay = "list-item";
	var _tagsInitDisplay = "inline";
	var _hideDisplay = "none";
	this.show = function(suppressCascade) {
		suppressCascade = typeof suppressCascade !== "undefined" ? suppressCascade : false;
		this.contentNode.style.display = _contentInitDisplay;
		if (!this.isRoot) {
			this.navigationNode.style.display = _navigationInitDisplay;
			if (!suppressCascade) {
				this.parentNode.show(true);
			}
		}
	};
	this.showChildren = function() {
		this.forEach(function(child) {
			child.show(true);
			child.showChildren();
		});
	};
	this.hide = function() {
		this.contentNode.style.display = _hideDisplay;
		if (!this.isRoot) {
			this.navigationNode.style.display = _hideDisplay;
		}
	};
	this.showTags = function() {
		if (!this.isRoot) {
			this.tagsElement.style.display = _tagsInitDisplay;
		}
	};
	this.hideTags = function() {
		if (!this.isRoot) {
			this.tagsElement.style.display = _hideDisplay;
		}
	};
	this.forEach = function(callback,includeSelf) {
		includeSelf = typeof includeSelf !== "undefined" ? includeSelf : false;
		var skipChildren = false;
		if (includeSelf) {
			skipChildren = callback(this);
			skipChildren = typeof skipChildren !== "undefined" ? skipChildren : false;
		}
		if (!skipChildren) {
			for (var i = 0; i < this.childNodes.length; i++) {
				this.childNodes[i].forEach(callback,true);
			}
		}
	};

	this.childNodes = TagNode.getChildNodes(contentNode,this);
	this.tagsElement = null;

	if (!this.isRoot) {
		var a = document.createElement("a");
			a.href = "#"+contentNode.id;
			a.textContent = this.title;
		this.navigationNode.appendChild(a);
		var tagsText = this.tags.join(" ");
		this.navigationNode.setAttribute("data-nav-tags",tagsText);
		this.tagsElement = document.createElement("span");
			this.tagsElement.className = "nav-tags mono";
			this.tagsElement.textContent = " {"+tagsText+"}";
		this.navigationNode.appendChild(this.tagsElement);
	}

	if (this.childNodes.length > 0) {
		this.navigationNode.appendChild(this.childrenElement);
	}

	if (this.isRoot) {
		parentNode.appendChild(this.navigationNode);
	} else {
		parentNode.childrenElement.appendChild(this.navigationNode);
	}

	this.hideTags();
}
TagNode.extractTags = function(element) {
	return element.getAttribute("data-tags").split(" ");
};
TagNode.getFirstTaggedParent = function(element) {
	var res;
	var pe = element.parentElement;
	if (pe === null || pe.hasAttribute("data-tags")) {
		res = pe;
	} else {
		res = TagNode.getFirstTaggedParent(pe);
	}
	return res;
};
TagNode.getChildNodes = function(element,context) {
	var childContainer;
	var potentialChildContainers = element.querySelectorAll("[data-children]");
	if (potentialChildContainers.length > 0) {
		for (var i = 0; i < potentialChildContainers.length; i++) {
			if (TagNode.getFirstTaggedParent(potentialChildContainers[i]) === element) {
				childContainer = potentialChildContainers[i];
				i = potentialChildContainers.length;
			}
		}
		if (typeof childContainer === "undefined") {
			childContainer = element;
		}
	} else {
		childContainer = element;
	}
	var res = [];
	var child;
	for (var i = 0; i < childContainer.children.length; i++) {
		child = childContainer.children[i];
		if (child.hasAttribute("data-tags")) {
			res.push(new TagNode(child,context));
		}
	}
	return res;
};

function createFilter(text) {
	var filter;
	var err;
	if (text.length > 0) {
		var compiler = new LogicCompiler();
		try {
			filter = compiler.compile(text);
		} catch (e) {
			err = e;
		}
	} else {
		filter = new LogicBoolNode(true);
	}
	return {
		filter: filter,
		success: typeof err === "undefined",
		error: err
	};
}
function applyFilter(filter,root) {
	console.log("APPLY FILTER ON '"+root.title+"', filter =",filter);
	root.forEach(function(node) {
		var skipChildren = false;
		if (!node.isRoot) {
			if (filter.resolve(node.tags)) {
				node.show();
				node.showChildren();
				skipChildren = true;
			} else {
				node.hide();
			}
		}
		return skipChildren;
	});
}

function attemptApplyFilter(input,root) {
	var details = createFilter(input.value.trim());
	if (details.success) {
		applyFilter(details.filter,root);
	} else {
		alert(details.error.message);
	}
}
function setupTagShow(root) {
	var tagShowBtn = document.getElementById("tagShow");
	tagShowBtn.addEventListener("click",function() {
		root.forEach(function(node) {
			if (tagShowBtn.checked) {
				node.showTags();
			} else {
				node.hideTags();
			}
		});
	});
}
function setupTagLogic(root,tagLogicInput) {
	var tagFilterBtn = document.getElementById("tagFilter");
	tagFilterBtn.addEventListener("click",function() {
		attemptApplyFilter(tagLogicInput,root);
	});
}
function setupInitialFilter(root,tagLogicInput,query) {
	if (query.hasOwnProperty("filter")) {
		tagLogicInput.value = query.filter;
		attemptApplyFilter(tagLogicInput,root);
	}
}
function setupMakeLink(tagLogicInput) {
	var makeLinkBtn = document.getElementById("makeLink");
	makeLinkBtn.addEventListener("click",function() {
		var value = tagLogicInput.value.trim();
		var details = createFilter(value);
		if (details.success) {
			var text = location.origin+location.pathname;
			if (value !== "") {
				text += "?filter="+encodeURIComponent(value);
			}
			tagLogicInput.value = text;
		} else {
			alert(details.error.message);
		}
	});
}
function setupColorCells() {
	var cells = document.querySelectorAll("[data-show-color]");
	var cell;
	for (var i = 0; i < cells.length; i++) {
		cell = cells[i];
		cell.className = "mono color-cell";
		cell.style.backgroundColor = cell.textContent;
		cell.style.color = getTextColor(cell.textContent);
	}
}
function wrapElementInLink(ele,href) {
	var a = document.createElement("a");
		a.target = "_blank";
		a.href = href;
	ele.parentElement.replaceChild(a,ele);
	a.appendChild(ele);
}
function setupThumbnailLinks() {
	var thumbs = document.getElementsByClassName("thumb-img");
	for (var i = 0; i < thumbs.length; i++) {
		wrapElementInLink(thumbs[i],thumbs[i].src);
	}
}

window.addEventListener("DOMContentLoaded",function() {
	var rootEle = document.getElementById("root");
	var navEle = document.getElementById("navContainer");
	var root = new TagNode(rootEle,navEle);
	var query = parseQueryString();
	var tagLogicInput = document.getElementById("tagInput");

	setupTagShow(root);
	setupTagLogic(root,tagLogicInput);
	setupInitialFilter(root,tagLogicInput,query);
	setupMakeLink(tagLogicInput);
	setupColorCells();
	setupThumbnailLinks();
	//getSortTableById("charDataTable").enableUserSorting();
});


