const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    date: String,
    approved: Boolean,
                                                    //armazenar relacionamento com user e spot:   
    user: {                                         //reserva deste usuário
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'User'
    },
    spot: {                                         //pra gravar este spot
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'Spot'
    }

});

module.exports = mongoose.model('Booking', BookingSchema);