const  {Users}  = require('../models');
const  {ObjectId} =  require('mongoose').Types

module.exports = {
    getUsers(req, res) {
        Users.find()
            .then((users) => res.status(200).json(users))
            .catch((err) => res.status(500).json(err));
    },
    getOneUser(req,res) {
        Users.findOne({userId:req.params.userId})
            .then((user) => 
                !user
                    ? res.status(400).json({message: 'Could not find user'})
                    : res.json(user)
            )
            .catch((err)=> res.status(500).json(err))
    },
    createUser(req,res) {
        Users.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err))
    },
    updateUser(req,res) {
        Users.findOneAndUpdate(
            {_id: req.params.userId}, 
            {$set: req.body}, 
            {new: true}, (err,result) => {
            if(result) {
                res.status(200).json(result)
            } else {
                console.log(err)
                res.status(400).json(err)
            }
        })
    },
    deleteUser(req,res) {
        Users.findOneAndDelete({_id:req.params.userId}, (err, results) => {
            if(results) {
                res.status(200).json('User has been deleted');                
            } else {
                console.log(err);
                res.status(500).json(err)
            }
        })
    },
    addFriend(req,res) {
        Users.findOneAndUpdate(
            {_id: ObjectId(req.params.userId)},
            {$addToSet: {friends: req.body.friends}},
            {runValidators: true, new: true}
        )        
        .then((user) =>
            !user
                ? res.status(400).json({message: 'No user found matching that id'})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err))
    },
    deleteFriend(req,res) {
        //console.log(reactionId)
        Users.findOneAndUpdate(
            //console.log(thought),
            {_id: req.params.userId},
            {$pull: {friends: {friendId: req.params.friendId}}},
            {runValidators: true, new: true}
        )
        .then((user) =>
            !user
                ? res.status(404).json({message: 'No user with id'})
                : res.json(user)
        )
        .catch((err)=> res.status(500).json(err))    
    }
}