const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
    thumbnail: String,
    company: String, 
    price: Number,
    techs: ['String'],
    user: {                                         //vai gravar o id do usuário que está criando este spot
        type: mongoose.Schema.Types.ObjectId,       //com base no model 'User'.
        ref: 'User'
    }

}, {            //novas configurações p/ mongoose: 
    toJSON:{    //"toda vez que um spot for covertido em json, deve calcular os virtuals automaticamente"
        virtuals: true,     
    },
});                         //vai adicionar esta linha no retorno do schema e insomnia: 
                            // "thumbnail_url": "http://localhost:4444/files/praia2-1581445613902.jpg",

SpotSchema.virtual('thumbnail_url').get(function() { 
    return `http://localhost:4444/files/${this.thumbnail}`
})

module.exports = mongoose.model('Spot', SpotSchema);