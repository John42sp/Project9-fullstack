const Spot = require('../models/Spot')

module.exports = {
    async show(req, res) {

        const { user_id } = req.headers;

        const spots = await Spot.find({ user: user_id });

        return res.json(spots);
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
}