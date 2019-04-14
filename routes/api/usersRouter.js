const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const registerValidator = require('../../validators/registerValidator');
const loginValidator = require('../../validators/loginValidator');

const {SECRET} = process.env;


/**
 * @route:  POST api/users/register
 * @desc:   register a new user
 */
router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const {errors, isValid} = registerValidator(req.body);
    if (!isValid)
        res.status(400).json(errors);

    User.findOne({email})
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                res.status(400).json(errors);
            } else {
                const avatarUrl = gravatar.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err)
                            throw err;

                        const newUser = new User({
                            name,
                            email,
                            password: hash,
                            avatarUrl
                        });

                        //Save this user
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => {
                                console.log(err);
                                res.json(err);
                            });
                    });
                });
            }
        });
});

/**
 * @route:  POST api/users/login
 * @desc:   login user
 */
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const {errors, isValid} = loginValidator(req.body);
    if (!isValid)
        res.status(400).json(errors);

    User.findOne({email})
        .then(user => {
            if (!user) {
                errors.email = 'Authentication failed. User not found.';
                res.status(401).json(errors);
            }

            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {

                        //Create the payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        };
                        jwt.sign(payload, SECRET, {expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'BEARER ' + token
                            });
                        });
                    } else {
                        errors.password = 'Authentication failed. Wrong password.';
                        res.status(401).json(errors);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(401).json(err);
                });
        });
});

/**
 * @route:  GET api/users/current
 * @desc:   get current user
 */
router.get('/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const {id, email} = req.user;
        res.json({
            id,
            email
        });
    });

module.exports = router;
