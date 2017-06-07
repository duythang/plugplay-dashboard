/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);


// Common Middleware
keystone.pre('routes', function (req, res, next) { // Configure the navigation bar in Keystone's User UI
	res.locals.navLinks = [
        { label: 'BOARDS', key: 'boards', href: '/boards' },
        { label: 'NEW BOARD', key: 'newboard', href: '/myboards' },
        //{ label: 'PRICING', key: 'pricing', href: '/pricing' },
        //{ label: 'SUPPORT', key: 'support', href: '' },
	];
	res.locals.user = req.user;  // Init locals user variable
	next();
});

keystone.pre('render', middleware.flashMessages);

keystone.set('404', function (req, res, next) {
	res.status(404).render('errors/404');
});


// Import Route Controllers

var routes = {
	download: importRoutes('./download'),
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};


// Setup Route Bindings

exports = module.exports = function (app) {

	// Views 
	app.get('/', routes.views.index);
    app.all('/join', routes.views.auth.join);
    app.all('/signin', routes.views.auth.signin);
    app.get('/signout', routes.views.auth.signout);
    app.all('/forgotpassword', routes.views.auth.forgotpassword);
    app.post('/resetpassword', keystone.security.csrf.middleware.validate, routes.views.auth.resetpassword); 
    app.get('/resetpassword/:key', keystone.security.csrf.middleware.init, routes.views.auth.resetpassword);
    app.post('/editpassword', middleware.requireUser, routes.views.auth.editpassword);
    app.all('/profile', middleware.requireUser, routes.views.auth.profile);
    app.post('/delete', middleware.requireUser, routes.views.auth.deleteuser);

    app.get('/pricing', routes.views.others.pricing);
    app.get('/about', routes.views.others.about);

    
    // Boards
    app.all('/createboard', middleware.requireUser, routes.views.boards.newboard);
    app.all('/boards/edit/:boardslug', middleware.requireUser, routes.views.boards.editboard);
    app.post('/boards/delete/:boardslug', middleware.requireUser, routes.views.boards.deleteboard);

    app.get('/boards/:boardslug', routes.views.boards.singleboard);
    app.get('/myboards', middleware.requireUser, routes.views.boards.myboards);
    app.get('/boards', routes.views.boards.boardlist); 
    app.get('/search', routes.views.boards.search);

    
    // RESTful API
    app.get('/api/boards', keystone.middleware.api, routes.api.board.getBoards);
    app.get('/api/boards/:id', keystone.middleware.api, routes.api.board.getBoardById);
    app.post('/api/boards', keystone.middleware.api, routes.api.board.createBoard);
    app.put('/api/boards/:id', keystone.middleware.api, routes.api.board.updateBoardById);
    app.delete('/api/boards/:id', keystone.middleware.api, routes.api.board.deleteBoardById);


    app.get('/api/rest/:id', keystone.middleware.api, routes.api.rest.getRestData);
    app.put('/api/rest/:id', keystone.middleware.api, routes.api.rest.putRestData);

	// Downloads
	app.get('/download/users', routes.download.users);
    app.get('/download/mqtt/:id', routes.download.mqtt);
    app.get('/download/rest/:id', routes.download.rest);
    app.get('/download/data/:id', routes.download.data); 
}
