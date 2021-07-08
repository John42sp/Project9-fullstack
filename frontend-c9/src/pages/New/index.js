import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import camera from '../../assets/camera.png';

import './styles.css';

export default function New({ history }) {
    const [ thumbnail, setThumbnail ] = useState(null);
    const [ company, setCompany ] = useState('');
    const [ techs, setTechs ] = useState('');
    const [ price, setPrice ] = useState('');
    

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;

    }, [thumbnail]);

    async function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData();  //por estarmos utilizando 'multipart form' no insomnia, aqui usamos este metodo
        const user_id = localStorage.getItem('user');  //cada vez que um spot é criado, precisamos informar quem criou,
                                                        //informar qual usuário esta loggado na app
        data.append('thumbnail', thumbnail);  //estamos informando todos estes valores no 'data'
        data.append('company', company);
        data.append('techs', techs);
        data.append('price', price);
                                                             //assim, apenas colocamos o data como 2º parametro
         await api.post('/spots', data, {                   //3º parametro, headers e user_id
            headers: { user_id }
        })  

        history.push('/dashboard');   // assim que spot criado, instruindo para pag. voltar pro dashboard

    }

    // function logout() {
    //     cookies.remove("token")
    //   setAuthTokens();
    //   window.location.reload()
    // }

    return (
        <>
        <form onSubmit={handleSubmit} >
            <label 
            id="thumbnail" 
            style={{backgroundImage: `url(${preview})` }}
            className={thumbnail ? 'has-thumbnail' : ''}
            >
            <input type="file" onChange={e => setThumbnail(e.target.files[0])}/>
            <img src={camera} alt="Select img"/>

            </label>
            
            
            <label htmlFor="company">EMPRESA *</label>
            <input
            id="company"
            placeholder="Sua empresa incrível"
            value={company}
            onChange={e => setCompany(e.target.value)}
            />

            <label htmlFor="techs">TECNOLOGIAS *<span> (separadas por vírgula)</span></label>
            <input
            id="techs"
            placeholder="Quais tecnologias usam?"
            value={techs}
            onChange={e => setTechs(e.target.value)}
            />

            <label htmlFor="price">VALOR DA DIÁRIA *<span> (em branco para GRATUITO)</span></label>
            <input
            id="price"
            placeholder="Valor cobrado por dia"
            value={price}
            onChange={e => setPrice(e.target.value)}
            />

            <button type="submit" className="btn">Cadastrar</button>

        </form>     

          <Link to="/dashboard">
            <button className="btn-logout">Cancelar</button>
        </Link>

        <Link to="/">
            <button className="btn-logout">Logout</button>
        </Link>
        </>
    
    )
}