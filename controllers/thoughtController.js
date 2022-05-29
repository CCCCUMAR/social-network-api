const {Thoughts, Users} = require('../models');
const  {ObjectId}=  require('mongoose').Types

module.exports = {
    getThoughts(req,res) {
        Thoughts.find()
            .then((thought) => res.status(200).json(thought))
            .catch((err) => res.status(500).json(err))
    },
    getOneThought(req,res) {
        Thoughts.findOne({_id:req.params._id})
            .then((thought) =>
                !thought
                    ? res.status(500).json({message: 'no thoughts found matching id'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err))
    },
    createThought(req,res) {
        Thoughts.create(req.body)
            .then((thought) => {
                return Users.findOneAndUpdate(
                    {username: req.body.username},
                    {$addToSet: {thoughts: thought._id}},
                    {new:true}
                )
            })
            .then((thought) => 
                !thought
                    ? res.status(400).json({message: `thought created but no user found with that id`})
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });            
    },
    updateThought(req,res) {
        return Thoughts.findOneAndUpdate(
            {_id:req.params._id}, 
            {$set: req.body}, 
            {runValidators: true, new: true}, (err,result) => {
            if(result) {
                res.status(200).json(result)
            } else {
                console.log(err)
                res.status(400).json(err)
            }
        })
    },
    deleteThought(req,res) {
        Thoughts.findOneAndDelete({_id:req.params._id}, (err,results) => {
            if(results) {
                res.status(200).json('Thought has been deleted');
            } else {
                res.status(500).json(err)
            }
        })
    },
    addReaction(req,res) {        
        Thoughts.findOneAndUpdate(
            {_id: ObjectId(req.params.thoughtId)},
            {$addToSet: {reactions: req.body}},
            {runValidators:true, new: true},            
        )
        .then((thought) =>
            
            !thought
                ? res.status(400).json({message: 'No thought with that id'})
                : res.json(thought)    
        )
        .catch((err) => res.status(500).json(err))
        
    },
    deleteReaction(req,res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
        .then((thought) =>
            !thought
                ? res.status(400).json({message: 'No thought with id'})
                : res.json(thought)
        )
        .catch((err)=> res.status(500).json(err))    
    }
}