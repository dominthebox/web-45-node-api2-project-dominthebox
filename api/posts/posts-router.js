// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        {post ? res.status(200).json(post) 
            : res.status(404).json({ 
                message: "The post with the specified ID does not exist" })}
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    }
})

router.post('/', (req, res) => {
   const { title, contents } = req.body
   if (!title || !contents) {
       res.status(400).json({
           message: "Please provide title and contents for the post"
       })
   } else {
       Posts.insert({ title, contents })
            .then(({ id }) => {
                return Posts.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message
                })
            })
   }
})

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Posts.findById(req.params.id)
            .then(post => {
                if (!post) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Posts.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Posts.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    err: err.message
                })
            })
    }
})

router.delete('/:id', (req, res) => {

})

router.get('/:id/comments', (req, res) => {

})

module.exports = router