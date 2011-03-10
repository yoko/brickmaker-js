(function($, w, d) {


w = $(w);
d = $(d);

$.autoPagerEvent = autoPagerEvent;
autoPagerEvent.remainHeight = 1200;
autoPagerEvent.every = 250;
autoPagerEvent.trigger = trigger;
autoPagerEvent.clear = clear;
autoPagerEvent.stop = stop;
autoPagerEvent.restart = restart;
autoPagerEvent.rarely = rarely;

var on = false;
var stack = 0;

function autoPagerEvent() {
	if (!on) {
		on = true;
		w.bind('scroll.autoPager', scroll);
	}
}

function scroll() {
	rarely(process, autoPagerEvent.every);
}

function process() {
	if (stack == 0 && d.height() - (w.scrollTop() + w.height()) < autoPagerEvent.remainHeight) {
		trigger();
	}
}

function trigger() {
	d.trigger('autoPager');
}

function clear() {
	w.unbind('scroll.autoPager');
	on = false;
	stack = 0;
}

function stop() {
	++stack;
}

function restart() {
	stack && --stack;
}


var timer = null;

function rarely(f, every) {
	if (every === null) {
		f();
	}
	else {
		every = every || 250;
		if (!timer) {
			f();
			timer = setTimeout(function() {
				f();
				timer = null;
			}, every);
		}
	}
}


})(jQuery, this, document);
