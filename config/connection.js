const {connect, connection} = require('mongoose');


connect('mongodb://localhost:27017/socialNetwork_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = connection