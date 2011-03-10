(function(ns, w, d) {


ns.Brickmaker = initialize;
ns.Brickmaker.prototype = {
	container    : null,
	positionsTop : null,
	positionsLeft: null,
	columnCount  : 1,
	columnWidth  : 320,
	columnMargin : 10,
	position     : position,
	update       : update,
	add          : add,
	updateHeight : updateHeight,
	updateOption : updateOption,
	addPosition  : addPosition
};

function initialize(container, options) {
	this.container = container;

	this.update(options);
}

function position(height) {
	var positions_top = this.positionsTop, positions_left = this.positionsLeft;
	var top = positions_top[0] || 0, left = 0;
	var column = 0;
	for (var i = positions_top.length - 1; i >= 0; --i) {
		var position_top = positions_top[i] || 0;
		if (position_top <= top) {
			top = position_top;
			left = positions_left[i];
			column = i;
		}
	}
	this.positionsTop[column] = top + this.columnMargin + height;

	return {top: top, left: left};
}

function update(options) {
	if (options) {
		this.updateOption(options);
	}
	this.positionsTop = new Array(this.columnCount);

	var items = this.container.childNodes;
	for (var i = 0, item; item = items[i]; ++i) {
		if (item.nodeType == 1) {
			this.addPosition(item);
		}
	}
	this.updateHeight();
}

function add(items) {
	var fragment = d.createDocumentFragment();
	for (var i = 0, item; item = items[i]; ++i) {
		this.addPosition(item);		
		fragment.appendChild(item);
	}
	this.updateHeight();
	this.container.appendChild(fragment);
}

function updateHeight() {
	var height = Math.max.apply(Math, this.positionsTop);
	height && (this.container.style.height = height + 'px');
}

function updateOption(options) {
	var width = this.columnWidth = options.columnWidth || this.columnWidth;
	var margin = this.columnMargin = options.columnMargin || this.columnMargin;
	var count = this.columnCount = Math.max(options.columnCount || this.columnCount, 1);
	var positions_left = [0];
	for (var i = 1; i < count; ++i) {
		positions_left[i] = width * i + margin * i;
	}
	this.positionsLeft = positions_left;
}

function addPosition(item) {
	var style = item.style;
	var position = this.position(parseInt(style.height, 10));
	style.top  = position.top + 'px';
	style.left = position.left + 'px';
}


})(this, this, document);
