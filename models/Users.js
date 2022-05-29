const {Schema, model} = require('mongoose')

const userSchema = new Schema (
    {
        username: {
            type: String, 
            unique: true,
            required: true, 
            trim: true,
            
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validateEmail, 'Please enter a valid email address.']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thoughts'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
)

userSchema.
    virtual('friendCount').
        get(function(v) {
        return this.friends.length;
        });

const Users = model('users', userSchema);

module.exports = Users;