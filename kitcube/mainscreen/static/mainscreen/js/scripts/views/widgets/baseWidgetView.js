/**
 * Created by aw3s0_000 on 22.01.2015.
 */

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var BaseWidgetView = Backbone.View.extend({
        widgetController: undefined,
        container: undefined,
		grid: undefined,
		model: undefined
    });

    return BaseWidgetView;
});