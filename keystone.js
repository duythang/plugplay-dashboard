// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone and i18n
var keystone = require('keystone'),
	i18n = require('i18n');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
keystone.init({

	'name': 'plugplay-web',
	'brand': 'Admin-UI',

	'favicon': 'public/images/ico.png',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'pug',
	'port' : process.env.PORT || 3000,
	
	//'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/admin',
	'mongo': 'mongodb://pdthang:Thangphan90@mongo.plugplay.co:27017/admin', 
	'cloudinary config': 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo',

	// ssl solution 1
	'ssl port' : process.env.SSLPORT || 3001,
	'ssl' : 'force',
	'ssl key':  __dirname + 'web-key.pem',
	'ssl cert': __dirname + 'web-cert.pem',
	/*/ ssl solution 2 issue
	'letsencrypt': (process.env.NODE_ENV === 'production') && {
		email: 'pdthang59@gmail.com',
		domains: ['plugplay.co', 'www.plugplay.co'],
		register: true,
		tos: true,
		duplicate: true,
	},*/

	'auto update': true,
	'auth': true,
	'user model': 'User',
			
	'session': true,
	'session store': 'mongo',
	'cookie secret': process.env.COOKIE_SECRET,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN

});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'), // Can use "underscore"
	env: keystone.get('env'),
	utils: keystone.utils, // utils tool
	editable: keystone.content.editable,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

// Configure i18n
	i18n.configure({
		locales:['en', 'vi'],
		directory: __dirname + '/locales',
		autoReload: true, 
		syncFiles: true, 
		objectNotation: true 
	});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'USER': 'users',
	'BOARD': 'boards',
	'MQTT DATA': 'mqtts',
	'REST DATA': 'rests'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
