const express = require('express');
const router = express.Router();
const User = require('../data/model/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

/**
 * @route:  POST users/register
 * @desc:   register a new user
 */
router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email})
        .then(user => {
            if (user)
                return res.status(400).json({msg: 'Email already exists'});
            else {
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
                            .catch(err => res.json({msg: err}));
                    });
                });
            }
        });
});

/**
 * @route:  POST users/login
 * @desc:   login user
 */
router.post('/login', (req, res) => {
    const {email, password} = req.body;

    User.findOne({email})
        .then(user => {
            if (!user)
                return res.status(404).json({msg: 'Email not found'});

            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch)
                        res.json({msg: 'Login success'});
                    else
                        return res.status(400).json({msg: 'Password incorrect'});
                });
        });
});

module.exports = router;
