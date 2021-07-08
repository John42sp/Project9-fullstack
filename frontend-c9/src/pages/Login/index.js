import React, { useState } from 'react';
import api from '../../services/api';

export default function Login({ history }) {      // history: propriedade parametro da função para fazer navegação
    const [ email, setEmail ] = useState('');
    
    async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/sessions', { email })    //fazer chamada na api    
    const { _id } = response.data;
    
    localStorage.setItem('user', _id);   // para salvar id do usuário no navegador 

    history.push('/dashboard')        //executa a propriedade levando para a rota/pag. dashboard    
     
    
  }

    return (
        <>      
        <p>Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-MAIL *</label>
          <input
          id="email"
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          />
  
          <button className="btn" type="submit">Entrar</button>
        </form>
       
        </>
    )
}