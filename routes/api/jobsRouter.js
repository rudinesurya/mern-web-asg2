const express = require('express');
const router = express.Router();
const Job = require('../../model/Job');


/**
 * @route   GET api/jobs/
 * @desc    Get all the jobs
 */
router.get('/', (req, res, next) => {
    Job.find().exec()
        .then(docs => res.json({jobs: docs}))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

/**
 * @route   GET api/jobs/:id
 * @desc    Get a job by id
 */
router.get('/:id', (req, res, next) => {
    const errors = {};
    const id = req.params.id;
    Job.findById(id).exec()
        .then(doc => {
            if (doc) {
                res.json({job: doc});
            } else {
                errors.job = 'No valid entry found for provided id';
                res.status(404).json(errors);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

/**
 * @route   POST api/jobs/
 * @desc    Create a new job
 */
router.post('/', (req, res) => {
    const newJob = new Job({
        title: req.body.title,
        venue: req.body.venue,
        date: req.body.date
    });

    newJob.save()
        .then(result => res.json(result))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

/**
 * @route   PUT api/jobs/:id
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
        .then(result => res.json(result))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

/**
 * @route   DELETE api/jobs/:id
 * @desc    Delete an existing job
 */
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Job.remove({_id: id}).exec()
        .then(result => res.json(result))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;
