/**
 * Created by sushantkumar on 02/10/15.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});

var phoneSchema = new mongoose.Schema({
    brand: String,
    model: String,
    color: String,
    price: Number
});

//declare a model called User which has schema userSchema
mongoose.model('User', userSchema);
mongoose.model('Phone', phoneSchema);