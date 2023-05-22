const express = require('express');
const _ = require('lodash');
const Songs = require('../models/songModel');

const router = express.Router();

router.get('/', (req, res) => {
    if (_.isEmpty(req.query)) {
        Songs.find()
            .then(result => res.status(200).json(result))
            .catch(err => res.status(400).json(err.message));
    } else {
        const filter = {};
        if (req.query.by === "song") {
            filter["name"] = { "$regex": req.query.search, "$options": "i" };
        } else if (req.query.by === "artist") {
            filter["artist"] = { "$regex": req.query.search, "$options": "i" };
        } else {
            res.status(400).json("invalid search parameters");
            return
        }

        Songs.find(filter)
            .then(result => res.status(200).json(result))
            .catch(err => res.status(400).json(err.message));
    }
});

router.post('/', (req, res) => {
    const song = req.body;

    Songs.create(song)
        .then(result => res.status(200).json('created successfully!'))
        .catch(err => res.status(400).json(err.message));

});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Songs.findById(id)
        .then(result => {res.status(200).json(result)})
        .catch(err => {res.status(400).json(err.message)});
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Songs.findByIdAndDelete(id)
        .then(result => {res.status(200).json(result)})
        .catch(err => {res.status(400).json(err.message)});
})

router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const song = req.body;
    Songs.findByIdAndUpdate(id, song)
        .then(result => {res.status(200).json(result)})
        .catch(err => {res.status(400).json(err.message)});
})

module.exports = router;