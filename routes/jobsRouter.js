const express = require('express');
const router = express.Router();
const Job = require('../data/model/Job');


/**
 * @route   GET jobs/
 * @desc    Get all the jobs
 */
router.get('/', (req, res, next) => {
    Job.find().exec()
        .then(docs => {
            res.json({jobs: docs});
        })
        .catch(err => {
            res.status(400).json({msg: err});
        });
});

/**
 * @route   GET jobs/:id
 * @desc    Get a job by id
 */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Job.findById(id).exec()
        .then(doc => {
            if (doc) {
                res.json({job: doc});
            } else {
                res.status(404).json({msg: 'No valid entry found for provided id'});
            }
        })
        .catch(err => {
            res.status(400).json({msg: err});
        });
});

/**
 * @route   POST jobs/
 * @desc    Create a new job
 */
router.post('/', (req, res) => {
    const newJob = new Job({
        title: req.body.title,
        venue: req.body.venue,
        date: req.body.date
    });

    newJob.save()
        .then(result => {
            res.json({job: newJob});
        })
        .catch(err => {
            res.status(400).json({msg: err});
        });
});

/**
 * @route   PUT jobs/:id
 * @desc    Update an existing job
 */
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateField = {};

    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            updateField[key] = req.body[key];
        }
    }

    Job.update({_id: id}, {$set: updateField}).exec()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(400).json({msg: err});
        });
});

/**
 * @route   DELETE jobs/:id
 * @desc    Delete an existing job
 */
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Job.remove({_id: id}).exec()
        .then(result => {
            res.json({msg: result});
        })
        .catch(err => {
            res.status(400).json({msg: err});
        });
});

module.exports = router;
