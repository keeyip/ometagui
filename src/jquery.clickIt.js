$.fn.clickIt = function() {
	var TIMER_DATA_PROP = '--click-it-timer--'

	_.each(this, function(el) {
		var $el = $(el)
		clearTimeout($el.data(TIMER_DATA_PROP))
		$el
			.addClass('active')
			.data(TIMER_DATA_PROP, setTimeout(function(){
				$el
					.removeClass('active')
					.click()
			}, 300))
	})

	return this
};

