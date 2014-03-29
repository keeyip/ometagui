
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






	window.friendGraph = new Model()
	friendGraph.add('person.Bob.knows', 'Alice')
	friendGraph.add('person.Alice.knows', 'Bob')
	friendGraph.add('person.Jerry.knows', 'Alice')
	friendGraph.add('person.Jerry.knows', 'Bob')
	friendGraph.add('person.Alice.knows', 'Jerry')
	friendGraph.add('person.Alice.likes', 'Jerry')
	friendGraph.add('person.Jerry.likes', 'Bob')
	friendGraph.add('person.Bob.knows', 'Jerry')
	friendGraph.set('person.Bob.sex', 'male')
	friendGraph.set('person.Alice.sex', 'female')
	friendGraph.set('person.Jerry.sex', 'male')
	window.friendGraphPresentation = new Model()
	friendGraphPresentation.set('people', _.sortBy(_.map(friendGraph.get('person'), function(person, name) {
		return _.extend({
			id: name,
			name: name,
		}, person)
	}), function(name) { return name }))

	$('<div class="friendgraph position-relative inline-block">')
		.append($('<div class="small column-bg pivot"></div>'))
		/*
		.append($('<div class="row">')
			.append($('<div class="column header small">Person</div>'))
			.append($('<div class="column header small">Knows</div>'))
			.append($('<div class="column header small">Likes</div>')))
		*/
		.append(_.map(friendGraphPresentation.get('people'), function(person) {
			return $()
				.add($('<div class="row">')
					.append($('<div class="column small pivot" data-property="name">')
						.attr('data-record', person.id)
						.append($('<img class="sex">').attr('src', 'src/' + person.sex + '.png'))
						.append($('<span>').text(person.name)))
					.append($('<div class="column small" data-property="knows">')
						.append('<div class="header">Knows:</div>')
						.append(_.map(person.knows, function(other) {
							return $('<button type="button">').text(other)
								.attr('data-reference', other)
						})))
					.append($('<div class="column small" data-property="likes">')
						.append('<div class="header">Likes:</div>')
						.append(_.map(person.likes, function(other) {
							return $('<button type="button">').text(other)
								.attr('data-reference', other)
						}))))
		}))
		.appendTo('body')

	var $highlightRecord = $('<div class="highlight-ring">')
				.hide()
				.appendTo('body')
	$('body').on('click', '[data-reference]', function(event) {
		var $el = $(this)
		var ref = $el.attr('data-reference')
		$('[data-record="'+ref+'"').each(function() {
			var $ref = $(this)
			var height = $ref.outerHeight()
			if ($ref.is('.column')) {
				var $row = $ref.closest('.row')
				if ($row[0]) {
					height = $row.outerHeight()
				}
			}
			$highlightRecord
				.offset($ref.offset())
				.outerWidth($ref.outerWidth())
				.outerHeight(height)
				.show()
		})
	})


	//=================================
	window.prisonersDilemma = new Model()
	prisonersDilemma.set('player.Rose.choice.confess.Bob.confess', 10)
	prisonersDilemma.set('player.Rose.choice.confess.Bob.deny', 10)
	prisonersDilemma.set('player.Rose.choice.deny.Bob.confess', 5)
	prisonersDilemma.set('player.Rose.choice.deny.Bob.deny', 5)
	prisonersDilemma.set('player.Rose.sex', 'female')
	prisonersDilemma.set('player.Colin.choice.confess.Rose.confess', 10)
	prisonersDilemma.set('player.Colin.choice.confess.Rose.deny', 10)
	prisonersDilemma.set('player.Colin.choice.deny.Rose.confess', 5)
	prisonersDilemma.set('player.Colin.choice.deny.Rose.deny', 5)
	prisonersDilemma.set('player.Colin.sex', 'male')
	window.prisonersDilemmaPresentation = new Model()
	prisonersDilemmaPresentation.set('players', _.sortBy(_.map(prisonersDilemma.get('player'), function(player, name) {
		return _.extend({
			id: name,
			name: name,
		}, player)
	}), function(name) { return name }))
	$('<div class="gametheory position-relative inline-block">')
		.append($('<div class="small column-bg pivot"></div>'))
		.append(_.map(prisonersDilemmaPresentation.get('players'), function(player) {
			return $()
				.add($('<div class="row">')
					.append($('<div class="column small pivot" data-property="name">')
						.attr('data-record', player.id)
						.append($('<img class="sex">').attr('src', 'src/' + player.sex + '.png'))
						.append($('<span>').text(player.name)))
					.append($('<div class="column" data-property="choice">')
						.append($('<ul>').append(_.map(player.choice, function(payoffs, choice) {
							var $choice = $('<li>').text(choice)
							var $others = $('<ul>').appendTo($choice)
							_.each(payoffs, function(otherChoices, other) {
								var $other = $('<li>').text(other)
								var $otherChoices = $('<ul>').appendTo($other)
								_.each(otherChoices, function(payoff, otherChoice) {
									$otherChoices.append($('<li>')
										.append($('<span class="choice inline-block">').text(otherChoice))
										.append($('<span class="payoff inline-block">').text(payoff)))
								})
								$other.appendTo($others)
							})
							return $choice
						}))))
				)
		}))
		.appendTo('body')
});
