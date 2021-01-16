const mongoose = require('mongoose');

const TourSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter tour name'],
        maxlength:[40, 'tour max length have less then 40'],
        minlength: [10, 'tour min length grater then 10'],
        unique: true
    },
    slug: String,
    duration:{
        type: Number,
        required: [true, 'Please enter tour Duration']
    },
    difficulty:{
        type: String,
        required: [true, 'Plase enter the difficulty'],
        enum:{
            values: ['easy','meduim','dificult'],
            message: 'Difficulty must be easy, meduim and dificult'
        }
    },
    ratingsAverage:{
        type: Number,
        required: [true, 'a tour must have ratingsAverage']
    },
    ratingsQuantity:{
        type: Number,
        required: [true, 'a tour must have ratingsQuantity' ]
    },
    maxGroupSize : {
        type: Number,
        required: [true, 'a tour must have maxGroup size']
    },
    price:{
        type: Number,
        required: [true, ' a tour must have price']
    },
    summary:{
        type: String,
        required: [true, 'a tour must have summary']
    },
    priceDiscount:{
        type: Number
    }
});

const Tours =  mongoose.model('tours',TourSchema);

module.exports = Tours;
