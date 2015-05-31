$(document).ready(function() {
	var ui   = {}

	var events = {
		ui: function() {
			var nav = $('div.navbar');
			var tbl = $('table.table');

			ui = {
				form: false,
				nav: {
					title          : $(nav).find('a.brand'),
					button         : $(nav).find('a.btn-navbar'),
					li: {
						score      : $(nav).find('a.change.score'),
						positive   : $(nav).find('a.change.positive'),
						print      : $(nav).find('a.print')
					}
				},
				table: {
					head: {
						grade      : $(tbl).find('th').eq(0),
						percentage : $(tbl).find('th').eq(1),
						score      : $(tbl).find('th').eq(2),
					},
					body: []
				}
			}

			ui.form = $('<form />')
				.attr('action', 'pdf')
				.attr('method', 'post')
				.attr('target', '_blank')
				.css('display', 'none')
				.appendTo('body');
			$('<input />')
				.attr('type', 'text')
				.attr('name', 'title')
				.attr('class', 'lang')
				.attr('value', lang.title)
				.appendTo(ui.form);
			$('<input />')
				.attr('type', 'text')
				.attr('name', 'grade')
				.attr('class', 'lang')
				.attr('value', lang.table.grade)
				.appendTo(ui.form);
			$('<input />')
				.attr('type', 'text')
				.attr('name', 'percentage')
				.attr('class', 'lang')
				.attr('value', lang.table.percentage)
				.appendTo(ui.form);
			$('<input />')
				.attr('type', 'text')
				.attr('name', 'score')
				.attr('class', 'lang')
				.attr('value', lang.table.score)
				.appendTo(ui.form);

			for(var i = 1; i <= 5; i++) {
				ui.table.body[i]          = {}
				ui.table.body[i].parent   = $(tbl).find('tr.grade' + i);
				ui.table.body[i].children = {
					percent: {
						from : $(ui.table.body[i].parent).find('td.percent_from'),
						to   : $(ui.table.body[i].parent).find('td.percent_to')
					},
					score: {
						from : $(ui.table.body[i].parent).find('td.score_from'),
						num  : $(ui.table.body[i].parent).find('td.score_num'),
						to   : $(ui.table.body[i].parent).find('td.score_to')
					}
				}
			}

			return events;
		},
		lang: function() {
			$('head').find('title').html(lang.title);

			$(ui.nav.title).html(lang.nav.title);
			$(ui.nav.li.score).html(lang.nav.score);
			$(ui.nav.li.positive).html(lang.nav.positive);
			$(ui.nav.li.print).html(lang.nav.print);
			$(ui.table.head.grade).html(lang.table.grade);
			$(ui.table.head.percentage).html(lang.table.percentage);
			$(ui.table.head.score).html(lang.table.score);

			return events;
		},
		refresh: function() {
			calc.refresh(function(table) {
				$(ui.form).find('input.value').remove();

				$.each(table, function(key, value) {
					if(value !== false) {
						$('<input />')
							.attr('type', 'text')
							.attr('name', 'grade' + key + '_' + 'from')
							.attr('class', 'value')
							.attr('value', value.from)
							.appendTo(ui.form);
						$('<input />')
							.attr('type', 'text')
							.attr('name', 'grade' + key + '_' + 'to')
							.attr('class', 'value')
							.attr('value', value.to)
							.appendTo(ui.form);
					}
				});

				for(var i = 1; i <= 5; i++) {
					var pf = '-', pt = '-', sf = '-', st = '-', sn = '-';
					if(table[i] !== false) {
						sf = table[i].from;
						st = table[i].to;
						sn = '+' + (st - sf);
						pf = ((sf / calc.score()) * 100).toFixed(2);
						pt = ((st / calc.score()) * 100).toFixed(2);
					}

					$(ui.table.body[i].children.percent.from).html(pf);
					$(ui.table.body[i].children.percent.to).html(pt);
					$(ui.table.body[i].children.score.from).html(sf);
					$(ui.table.body[i].children.score.num).html(sn);
					$(ui.table.body[i].children.score.to).html(st);
				}
			});

			return events;
		},
		nav: function() {
			$(ui.nav.title).click(function() {
				$(this).blur();
				$(ui.nav.button).click();

				return false;
			});

			return events;
		},
		dialog: function() {
			$('div.navbar').find('a.change').click(function() {
				var anchor  = this;
				$(anchor).blur();
				$(ui.nav.button).click();

				var title   = lang.dialog.title;
				var message = lang.dialog.text.score;
				var decs    = 0;
				var value   = calc.score().toFixed(decs);

				if($(anchor).hasClass('positive')) {
					message = lang.dialog.text.positive;
					decs    = 2;
					value   = calc.positive().toFixed(decs);
				}

				var html = '';
				html += '<form class="bootbox-form">';
				html += '<label for="bootbox-form-label">' + message + '</label>';
				html += '<input id="bootbox-form-label" class="bootbox-input form-control" type="text" value="' + value + '" maxlength="5" autocapitalize="off" autocorrect="off" />';
				html += '</form>';

				var dialog = bootbox.dialog({
					title: title,
					message: html,
					buttons: {
						ok: {
							label: '<small>' + lang.dialog.button.ok + '</small>',
							className: 'btn-ok btn-primary',
							callback: function() {
								var value = $(dialog).find('.bootbox-input').val();
								if(!((!isNaN(parseFloat(value))) && (isFinite(value)))) {
									if($(dialog).find('.alert-error').length == 0) {
										var err = '';
										err += '<div class="alert alert-error fade in">';
										err += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
										err += lang.dialog.text.error;
										err += '</div>';
										err  = $(err).css('display','none');

										$(dialog).find('.alert-error').remove();
										$(dialog).find('.bootbox-body').prepend(err);
										$(err).fadeIn(100);
									}

									$(dialog).find('.bootbox-input')
										.select()
										.focus()

									return false;
								}

								if($(anchor).hasClass('score'))    calc.score(value);
								if($(anchor).hasClass('positive')) calc.positive(value);

								events.refresh();
							}
						},
						cancel: {
							label: '<small>' + lang.dialog.button.cancel + '</small>',
							className: 'btn-cancel btn-default'
						}
					},
					onEscape: function() {
						this.close();
					}
				});

				setTimeout(function() {
					$(dialog).find('.bootbox-input')
						.select()
						.focus()
						.keypress(function(event) {
							if(event.which == 13) {
								$(dialog).find('.btn-ok').click();
								return false;
							} else {
								//$(dialog).find('.alert-error').find('button').click;
							}
						});
				}, 500);

				return false;
			});

			return events;
		},
		print: function() {
			$(ui.nav.li.print).click(function() {
				$(ui.nav.button).click();

				$(ui.form).submit();

				return false;
			});

			return events;
		}
	}

	var calc = new Calculator();
	calc.refresh();

	events
		.ui()
		.lang()
		.nav()
		.dialog()
		.print()
		.refresh();
});
