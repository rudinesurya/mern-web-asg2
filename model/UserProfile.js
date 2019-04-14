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
        min: 3,
        max: 50
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('user profiles', UserProfileSchema);