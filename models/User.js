const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    sub_plano: {
         type: String,
         ref : 'Plano'
    },
    sub_validade: {
        type: Date,
   }
});


module.exports = mongoose.model('User', UserSchema);
