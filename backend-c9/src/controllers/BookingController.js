const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { user_id } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;

        const booking = await Booking.create({
            user: user_id,  //id usuario logado, querendo fazer booking
            spot: spot_id,  //id criador spot
            date,           
        });

        await booking.populate('spot').populate('user').execPopulate();
        //CODIGO PARA ENVIO DE MENSSAGEM DO USER MOBILE PRO WEB, TENTANDO FAZER RESERVA
        const ownerSocket = req.connectedUsers[booking.spot.user];//localizando entre todos users logados, criador do spot
        if(ownerSocket) {                                           //se houver um usuario logado criador do spot (d7ko@.)
            req.io.to(ownerSocket).emit('booking_request', booking); //enviar menssagem pra ele (nome e o objeto booking)
        }                                                           //agora fazer ele receber a menssagem no frontend
        return res.json(booking);
    }
};