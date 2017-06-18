var keystone = require('keystone'),
    User = keystone.list('User');
var Email = require('keystone-email');


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    view.on('post', function (next) {

        if (!req.body.email) {
            req.flash('error', req.__('routes.forgotpwd.err_fill'));
            return next();
        }

        User.model.findOne().where('email', req.body.email).exec(function (err, user) {
            if (err) return next(err);
            if (!user) {
                req.flash('error', req.__('routes.forgotpwd.err_email'));
                return next();
            }

            user.resetPasswordKey = keystone.utils.randomString([16, 24]);
            
            user.save(function (err) {
                if (err) return next(err);

                new Email('./templates/emails/forgotpassword/email.pug', {
                    transport: 'mailgun',
                    engine: 'pug',
                }).send({
                    user: user,
                    link: locals.locale + '/resetpassword/' + user.resetPasswordKey,
                },{
                    subject: req.__('routes.forgotpwd.email_subject'),
                    apiKey: process.env.MAILGUN_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN || 'sandbox84623256e49a4acc9dd342407889713b.mailgun.org',
                    to: user.email,
                    from: {
                        name: 'plugplay.co',
                        email: 'contact@plugplay.co',
                    },
                }, function (err, result) {
                    if (err) {
                        console.error(err);
                        req.flash('error', req.__('routes.forgotpwd.err_sendEmail'));
                        next();
                    } else {
                        req.flash('success', req.__('routes.forgotpwd.suc_sendEmail'));
                        res.redirect(locals.locale+'/login');
                    }
                });
            });
        });

    });

    view.render('auth/forgotpassword');

}