/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('lodash');

/**
 * Set language
 * refer: https://stackoverflow.com/questions/28165007/keystone-js-i18n-get-current-locale-before-rendering-view
 * 		  https://gist.github.com/JedWatson/9191081
 */

exports.detectLang = function(req, res, next) {
    var match = req.url.match(/^\/(vi|en)([\/\?].*)?$/i);

    if (match) {
        req.setLocale(match[1]);
        // Make locale available in template
        // (necessary until i18n 0.6.x)
        res.locals.locale = '/' + req.getLocale();
        // reset the URL for routing
        req.url = match[2] || '/';
    } else {
        // Here you can redirect to default locale if you want
		// req.setLocale('en');
    }

    next();
}

/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.

	Configure the navigation bar in Keystone's User UI
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: req.__('routes.middleware.label_01'), key: 'boards', href: locals.locale+'/boards'},
        { label: req.__('routes.middleware.label_02'), key: 'newboard', href: locals.locale+'/myboards'},
        //{ label: 'PRICING', key: 'pricing', href: '/pricing' },
        //{ label: 'SUPPORT', key: 'support', href: '' },
	];
	
	locals.user = req.user;
	
	next();
};

/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

	var locals = res.locals;

	if (!req.user) {
		req.flash('error', req.__('routes.middleware.err_auth'));
		res.redirect(locals.locale+'/login');
	} else {
		next();
	}
	
};