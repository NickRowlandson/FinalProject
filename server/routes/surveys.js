/* process the submission of a new user */
router.post('/add', requireAuth, function (req, res, next) {
    var user = new User(req.body);
    var hashedPassword = user.generateHash(user.password);
    User.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        displayName: req.body.displayName,
        provider: 'local',
        created: Date.now(),
        updated: Date.now()
    }, function (err, User) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/users');
        }
    });
});