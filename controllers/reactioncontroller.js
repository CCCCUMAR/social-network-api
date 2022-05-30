const {reactionSchema} = require('../models')

module.exports = {
    createReaction(req,res) {
        reactionSchema.create(req.body)
            .then((dbReactionData) => res.status(200).json('yes'))
            .catch((err)=>res.status(400).json(err))
    }
}