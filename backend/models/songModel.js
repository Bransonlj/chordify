const mongoose = require('mongoose');

const Schema = mongoose.Schema;

songSchema = new Schema({
    name: {
        $type: String,
        required: true,
    },
    artist: {
        $type: String,
        required: true,
    },
    capo: Number,
    sections: [{
        name: String,
        key: {
            note: String,
            accidental: String,
            type: String,
        },
        chords: [{
            note: String,
            accidental: String,
            type: String,
            lyric: String,
        }]
    }],

}, {timestamps: true, typeKey: '$type'});

const Songs = mongoose.model('Songs', songSchema);

module.exports = Songs;

