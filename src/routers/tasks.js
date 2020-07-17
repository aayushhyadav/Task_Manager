const express = require('express')
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')
const { populate } = require('../models/tasks')

const router = new express.Router()
router.post('/tasks', auth, async(req, res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try{
        const tasks = await task.save()
        res.status(201).send(tasks)
    }catch(error){
        res.status(400).send(error)
    }
})

//for filtering the data
//GET /tasks?completed=true/false

//for pagination
//GET /tasks?limit=10&skip=10

//for sorting
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            } 
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    try{
        const task = await Tasks.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.send(error)
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const keys = ['description', 'completed']
    const isValidOp = updates.every((update) => keys.includes(update))

    if(!isValidOp){
        return res.status(400).send({error: 'Invalid update!'})
    }

    try{
        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router