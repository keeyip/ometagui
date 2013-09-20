$(function() {
	var $in = $('<textarea class="app-in">')
	var $out = $('<pre class="app-out">')
	var $ometa =
		$('<div class="ometa bg-1 padding-small">')
			.append($('<div class="row">')
				.append('<input class="full-width" type="text" value="Lisp"/>'))
			.append($('<div class="row">')
				.append($('<div class="row ometa-non-terminal margin-vertical-large margin-left-large">')
					.append($('<div class="column width-gutter">')
						.append($('<button class="hover-visible">').html('+')))
					.append($('<div class="column ometa-def">')
						.append($('<input class="full-width" type="text"/>').val('ev'))
						.append($('<table class="full-width">')
							.append($('<tbody>')
								.append($('<tr>')
									.append($('<td colspan=3>')
								.append($('<tr>')
									.append($('<td>')
										.append($('<div class="row">')
											.append($('<button class="hover-visible">').html('+'))
											.append('Pattern'))
										.append($('<textarea>').val('string:a')))
									.append($('<td>')
										.append('<div class="row">Callback</div>')
										.append($('<textarea>').val('self.env[a]')))
									.append($('<td>')
										.append('<div class="row"></div>')
										.append($('<button>').html('-'))))
								.append($('<tr>')
									.append($('<td colspan=3>')
										.append($('<button class="hover-visible">').html('+')))))))))
				.append($('<div class="row">')
					.append($('<button class="hover-visible">').html('+')))))
	
	var $message = $('<div class="message">')
	var messageTimer
	function showError(err) {
		clearTimeout(messageTimer)
		$message.addClass('error').html(err)
		messageTimer = setTimeout(hideError, 2000)
	}
	function hideError() {
		clearTimeout(messageTimer)
		$message.html('').removeClass('error')
	}

	$('body')
		.append($('<div class="row">')
				.append($('<div class="column">').append($ometa))
				.append($('<div class="column">')
					.append($('<div>').append($in))
					.append($message))
				.append($('<div class="column">')
					.append($('<div>').append($out))))

	window.inModel = new Model()
	inModel.addValidator('value', function(data) {
		return _.isString(data.value) && !/\bbadword\b/.test(data.value)
	})
	inModel.set('value', '')

	var updateTimer
	var updateInModel = function() {
		if (!inModel.update('value', $in.val(), {target:$in})) {
			$in.val(inModel.get('value'))
			showError('Reverted')
		}
	};
	$in.val(inModel.get('value'))
	$in.on('keyup update', function(event) {
		hideError()
		clearTimeout(updateTimer)
		updateTimer = setTimeout(updateInModel, 300)
	})
	inModel.on('updated', function(event) {
		if (event.data.pathstr === 'value') {
			if (event.meta.target !== $in)
				$in.val(event.data.newValue)
		}
	})
});
