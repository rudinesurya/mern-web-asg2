const express = require('express');
const cuid = require('cuid');
const router = express.Router();
let jobs = require('../data/dummyJobs');


//GET jobs listing
router.get('/', (req, res, next) => {
    res.json(jobs);
});

//GET job by id
router.get('/:id', (req, res, next) => {
    const job = jobs.find(it => it.id === req.params.id);
    if (job)
        res.json(job);
    else
        res.status(400).json({msg: `No job with the id of ${req.params.id}`});
});

//Create new job
router.post('/', (req, res) => {
    const newJob = {
        id: cuid(),
        title: req.body.title,
        venue: req.body.venue,
        date: req.body.date
    };

    if (!newJob.title || !newJob.venue || !newJob.date)
        return res.status(400).json({msg: 'Please complete missing input'});

    jobs.push(newJob);
    res.json(jobs);
});

//Update job
router.put('/:id', (req, res) => {
    const job = jobs.find(it => it.id === req.params.id);
    if (job) {
        const updatedField = req.body;

        if (updatedField.title)
            job.title = updatedField.title;
        if (updatedField.venue)
            job.venue = updatedField.venue;
        if (updatedField.date)
            job.date = updatedField.date;

        res.json({msg: 'Job updated', job});
    } else
        res.status(400).json({msg: `No job with the id of ${req.params.id}`});
});

//Delete Job
router.delete('/:id', (req, res, next) => {
    const job = jobs.find(it => it.id === req.params.id);
    if (job) {
        jobs = jobs.filter(it => it.id !== req.params.id);
        res.json({msg: 'Job deleted', jobs});
    } else
        res.status(400).json({msg: `No job with the id of ${req.params.id}`});
});

module.exports = router;
