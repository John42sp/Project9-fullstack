const User = require('../models/User');
const Spot = require('../models/Spot');

module.exports = {
    async index(req, res) {
        const { tech } = req.query;

        const spots = await Spot.find({ techs: tech });      //find() p/ vários. techs é propriedade do model spot
                                                            //cujo valor é um vetor. mongo retorna somente spots
                                                            //com aquela tecnologia
        return res.json(spots);
    },

    async store(req, res) {
        const { filename } = req.file;
        const { company, price, techs }  = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);  //o user precisa existir pra ser criado novo spot
        if (!user) {
            return res.status(400).json({ error:"User does not exist." })
        }

        const spot = await Spot.create({
            user: user_id,
            thumbnail: filename,
            company,
            techs: techs.split(',').map(tech => tech.trim()),
            price
        })
        
        return res.json(spot);
    },
    async delete(req, res) {
        try {
          await Spot.findOneAndRemove({ _id: req.params.id }, function(
            err,
            offer
          ) {
            res.status(200).send({
              message: "Spot removido com sucesso!"
            });
          });
        } catch (e) {
          res.status(500).send({ message: "Falha ao remover spot." });
        }
      }
};