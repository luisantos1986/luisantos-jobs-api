const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {

    console.log("get all jobs")
    let jobs = await Job.find({
        createdBy: req.user.userId
    }).sort('createdAt')

    res.status(StatusCodes.OK).json({jobs, count:jobs.length})


    
}

const getJob = async (req, res) => {
    const {user:{userId}, params:{id: jobId}} = req
    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    })
    if (!job) {
        new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
}

const createJob = async (req, res) => {

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
    // const user = req.user
    // const body = req.body
    // const finalJson = { user, body}
    // res.json(finalJson)
    
}

const updateJob = async (req, res) => {

    const {
        body: {company, position},
        user:{userId}, 
        params:{id: jobId}
    } = req
    if (company === '' || position === '') {
        new BadRequestError('Company or Position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({
        _id:jobId, createdBy:userId
    }, req.body, {new:true, runValidators:true})

    if (!job) {
        new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
}

const deleteJob = async (req, res) => {
    const {user:{userId}, params:{id: jobId}} = req
    const job = await Job.findOneAndDelete({
        _id:jobId, createdBy:userId
    })
    if (!job) {
        new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}