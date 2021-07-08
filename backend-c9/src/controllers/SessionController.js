const User = require('../models/User');             //SessionController como se fosse UserController (sessao user logado)
                                                    //crriar usuários / e-mails cadastrados no Banco de dados
                                                    //a partir de agora surgem registros com ids (do MongoDB)

module.exports = {
    async store(req, res) {
        const { email } = req.body;     
        
        let user = await User.findOne({ email });  //vai procurar se usuário ja existe

        if (!user){                                //se não existe, vai criar novo usuário
          user = await User.create({ email });      // aqui o user vai sobescrever o user da variável let user
        }   
        return res.json(user);
    }
};