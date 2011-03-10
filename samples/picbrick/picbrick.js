(function(w, d, b) {


var picbrick = w.picbrick = {
	container       : null,
	moreContainer   : null,
	loadingContainer: null,
	template        : null,
	brickmaker      : null,
	columnWidth     : 320,
	maxColumnCount  : 6,
	picFile         : '320rh',
	lastPicId       : null,
	setup           : setup,
	clear           : clear,
	append          : append,
	makeData        : makeData
};

function setup() {
	b = $('body');
	if (location.hash == '#tile-view') {
		picbrick.columnWidth    = 100;
		picbrick.maxColumnCount = 18;
		picbrick.picFile        = '100sh';
		b.addClass('tile-view');
	}

	this.container = $('#pics ul');
	this.moreContainer = $('#more');
	this.loadingContainer = $('#loading');
	this.template = $('#template-pic');
	this.brickmaker = new Brickmaker(this.container[0], {
		columnWidth: this.columnWidth
	});

	$.autoPagerEvent();
	$(d)
		.bind('autoPager', $.proxy(this.append, this))
		.trigger('autoPager');

	$(w).resize(resize).resize();
}

function clear() {
	$.autoPagerEvent.clear();
	$(d).unbind('autoPager');
	this.moreContainer.fadeOut();
}

function resize() {
	$.autoPagerEvent.rarely(resizeProcess);
}

function resizeProcess() {
	var column_count = Math.min(Math.floor((b.width() - 10) / (picbrick.columnWidth + 10)), picbrick.maxColumnCount);
	if (picbrick.brickmaker.columnCount != column_count) {
		picbrick.brickmaker.update({columnCount: column_count});
	}
}

function append() {
	var self = this;

	$.autoPagerEvent.stop();
	this.loadingContainer.stop(true, true).show();

	$.picplz.interesting(function(data) {
		self.loadingContainer.fadeOut();
		if (data.pics.length) {
			self.brickmaker.add(
				self.template.tmpl(self.makeData(data.pics))
			);
			self.lastPicId = data.last_pic_id;
		}
		data.more_pics ?
			$.autoPagerEvent.restart() :
			self.clear();
	}, this.lastPicId);
}

function makeData(pics) {
	var data = [];
	for (var i = 0, pic; pic = pics[i]; ++i) {
		// console.log(pic);
		var pic_file = pic.pic_files[this.picFile];
		data[i] = {
			url    : pic.url,
			img_url: pic_file.img_url,
			width  : this.columnWidth,
			height : Math.round(pic_file.height * this.columnWidth / pic_file.width)
		};
	}
	return data;
}


$(function() {
	picbrick.setup();
});

	
})(this, document);
