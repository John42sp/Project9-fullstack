const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');

        booking.approved = false;

        await booking.save();
         //CODIGO PARA ENVIO DE MENSSAGEM /RESPOSTA DO USER NO WEB PRO MOBILE, DE ACEITE OU RECUSA DE RESERVA
         const bookingUserSocket = req.connectedUsers[booking.user];//procurar conexao de user no mobile fazendo reserva
         if(bookingUserSocket) {                                          
             req.io.to(bookingUserSocket).emit('booking_response', booking);//enviando mensg. pro mobile c/ dados do spot
         } 

        return res.json(booking);

    }
};