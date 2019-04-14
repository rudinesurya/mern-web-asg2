const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },


    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('user profiles', UserProfileSchema);