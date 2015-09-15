/*!
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2003 - 2015, EllisLab, Inc.
 * @license		https://ellislab.com/expressionengine/user-guide/license.html
 * @link		http://ellislab.com
 * @since		Version 3.0
 * @filesource
 */

"use strict";

(function ($) {
	$(document).ready(function () {
		// Single Relationship:
		//   When the radio button is clicked, copy the chosen data into the
		//   div.relate-wrap-chosen area
		$('div.publish').on('click', '.relate-wrap input:radio', function (e) {
			var relationship = $(this).closest('.relate-wrap');
			var label = $(this).closest('label');
			var chosen = $(this).closest('.scroll-wrap')
				.data('template')
				.replace(/{entry-id}/g, $(this).val())
				.replace(/{entry-title}/g, label.data('entry-title'))
				.replace(/{channel-title}/g, label.data('channel-title'));

			relationship.find('.relate-wrap-chosen .no-results')
				.closest('label')
				.hide()
				.removeClass('block');
			relationship.find('.relate-wrap-chosen .relate-manage').remove();
			relationship.find('.relate-wrap-chosen').first().append(chosen);
			relationship.removeClass('empty');
		});

		// Multiple Relationships
		//   When checkbox is clicked, copy the chosen data into the second
		//   div.relate-wrap div.scroll-wrap area
		$('div.publish').on('click', '.relate-wrap input:checkbox', function (e) {
			var relationship = $(this).closest('.relate-wrap')
				.siblings('.relate-wrap')
				.first();

			var label = $(this).closest('label');
			var chosen = $(this).closest('.scroll-wrap')
				.data('template')
			.replace(/{entry-id}/g, $(this).val())
			.replace(/{entry-title}/g, label.data('entry-title'))
			.replace(/{channel-title}/g, label.data('channel-title'));

			// If the checkbox was unchecked run the remove event
			if ($(this).prop('checked') == false) {
				relationship.find('.scroll-wrap a[data-entry-id=' + $(this).val() + ']').click();
				return;
			}

			relationship.find('.scroll-wrap .no-results').hide();
			relationship.removeClass('empty');
			relationship.find('.scroll-wrap').first().append(chosen);
			relationship.find('.scroll-wrap label')
				.last()
				.data('entry-title', label.data('entry-title'))
				.data('channel-id', label.data('channel-id'))
				.data('channel-title', label.data('channel-title'))
				.prepend('<span class="relate-reorder"></span>');

			$(this).siblings('input:hidden')
				.val(relationship.find('.scroll-wrap label').length);
		});

		// Removing Relationships
		$('div.publish').on('click', '.relate-wrap .relate-manage a', function (e) {
			var choices = $(this).closest('.relate-wrap');
			var chosen = $(this).closest('.relate-wrap');

			// Is this a multiple relationship?
			if (choices.hasClass('w-8')) {
				choices = choices.siblings('.relate-wrap').first();
			}
			else
			{
				choices.addClass('empty');
			}

			choices.find('.scroll-wrap :checked[value=' + $(this).data('entry-id') + ']')
				.attr('checked', false)
				.parents('.choice')
				.removeClass('chosen')
				.find('input:hidden')
				.val(0);

			$(this).closest('label').remove();

			if (chosen.find('.relate-manage').length == 0) {
				if (chosen.hasClass('w-8')) {
					chosen.addClass('empty')
						.find('.no-results')
						.show();
				} else {
					chosen.find('.relate-wrap-chosen .no-results')
						.closest('label')
						.show()
						.removeClass('hidden')
						.addClass('block');
				}
			}

			e.preventDefault();
		});

		// Filter by Channel
		$('div.publish').on('click', '.relate-wrap .relate-actions .filters a[data-channel-id]', function (e) {
			var field = $(this).closest('fieldset').find('div.col.last').eq(0);
			var channelId = $(this).data('channel-id');
			var data = $(this).closest('fieldset').serialize();

			if (channelId)
			{
				data += '&channel=' + channelId;
			}

			$.ajax({
				url: EE.publish.field.URL + '/' + $(field).find('.relate-wrap').data('field'),
				data: data,
				type: 'POST',
				dataType: 'json',
				success: function(ret) {
					$(field).html(ret.html);
				}
			});

			$(document).click(); // Trigger the code to close the menu
			e.preventDefault();
		});

		// Search Relationships
		$('div.publish').on('keyup', '.relate-wrap .relate-actions .relate-search', {delay: 10}, function (e) {
			var field = $(this).closest('fieldset').find('div.col.last').eq(0);
			var channelId = $(field).find('.filters .has-sub .faded').data('channel-id');
			var data = $(this).closest('fieldset').serialize();

			if (channelId)
			{
				data += '&channel=' + channelId;
			}

			$.ajax({
				url: EE.publish.field.URL + '/' + $(field).find('.relate-wrap').data('field'),
				data: data,
				type: 'POST',
				dataType: 'json',
				success: function(ret) {
					$(field).html(ret.html);
				}
			});
		});

		// Sortable!
		$('.w-8.relate-wrap .scroll-wrap').sortable({
			axis: 'y',
			cursor: 'move',
			handle: '.relate-reorder',
			items: 'label',
		});

		$('.publish form').on('submit', function (e) {
			$('.w-8.relate-wrap .scroll-wrap').each(function() {
				var label;
				var relationship = $(this).closest('.relate-wrap')
					.siblings('.relate-wrap').first();

				var i = 1;
				$(this).find('label.relate-manage').each(function () {
					label = relationship.find('input[name$="[data][]"][value=' + $(this).data('entry-id') + ']').closest('label');
					label.find('input:hidden[name$="[sort][]"]').first().val(i);
					i++;
				});
			});
		});
	});
})(jQuery);
