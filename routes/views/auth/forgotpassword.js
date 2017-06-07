var keystone = require('keystone'),
    User = keystone.list('User');
var Email = require('keystone-email');


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);

    view.on('post', function (next) {

        if (!req.body.email) {
            req.flash('error', "Enter the email address.");
            return next();
        }

        User.model.findOne().where('email', req.body.email).exec(function (err, user) {
            if (err) return next(err);
            if (!user) {
                req.flash('error', "Sorry, That email address is not registered.");
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
                    link: '/resetpassword/' + user.resetPasswordKey,
                },{
                    subject: 'Reset your password',
                    apiKey: process.env.MAILGUN_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN,
                    to: user.email,
                    from: {
                        name: 'plugplay.co',
                        email: 'info@plugplay.co',
                    },
                }, function (err, result) {
                    if (err) {
                        console.error(err);
                        req.flash('error', 'Error, Cannot send a reset email');
                        next();
                    } else {
                        req.flash('success', 'We have emailed you a link to reset your password');
                        res.redirect('/signin');
                    }
                });
            });
        });

    });

    view.render('auth/forgotpassword');

}