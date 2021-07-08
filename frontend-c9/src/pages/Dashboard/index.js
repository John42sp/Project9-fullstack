import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';
import './styles.css';

export default function Dashboard({ match }) {

    const [ spots, setSpots ] = useState([ ]);
    const [ requests, setRequests ] = useState([ ]); //armazenar solicitações de reserva no estado
//mudei o codigo abaixo pra fora do useEffect, adicionei 'useMemo' na variavel socket, para fazer a conexão com o
//socket somente quando mudar o id do usuário
    const user_id = localStorage.getItem('user');  //capturar id user logado no socket
        const socket = useMemo(() => socketio('http://localhost:4444', {          
            query: { user_id },    //na hora da conexão com socket, enviando o id do usuario
        }), [user_id]); //parâmetro pra fazer conexão somente quando mudar id do usuário

    useEffect(() => {
               //o codigo acima estava aqui
        socket.on('hello', data => {
            //console.log(data);    //teste (vindo do socket.emit() do servidor backend)
            
        })
       // socket.emit('omni', 'Stack'); //teste para enviar menssagem dp frontendp servidor ('titulo mens.','conteudo')

       socket.on('booking_request', data => {  //fazer o dono do spot ouvir a menssagem de solicitação reserva tempo real
           //console.log(data);                 //ver BookingController.js
            setRequests([...requests, data]);  //quero reproduzir todas reservas (requests) e adicionar nova no final(data)
        })
    }, [requests, socket]);
    
    useEffect(() => {                    //executar uma função assim que usuário acessar a pagina, p/ carregar spots
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });
            // console.log(response.data);
            setSpots(response.data);
        }
        loadSpots();
    }, [match.params.id]);

    async function deleteSpot(id, pos) {    
        await api.delete(`/dashboard/${id}`)
        setSpots([
            ...spots.slice(0, pos),
            ...spots.slice(pos+1)
        ])
    }

    function zeroSpot() {
        return (
            spots.length === 0 ?
            <Link to="/new">
                <button className="btn">Cadastre seu 1º spot</button>   
            </Link> :
            <Link to="/new">
                <button className="btn">Cadastrar novos spots</button>   
            </Link>

        )        

    }

    // function zeroSpot() {
    //     if (spots.length === 0) {
    //         return (
    //             <Link to="/new">
    //                 <button className="btn">Cadastre seu 1º spot</button>   
    //             </Link>
    //         )

    //     } else {
    //         return (
    //             <Link to="/new">
    //                 <button className="btn">Cadastrar novos spots</button>   
    //             </Link>
    //         )
    //     }
    // }

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);               //procedimento de aprovar
                                                                //depois preciso remover este accept da minha lista
        setRequests(requests.filter(request => request._id !== id))//deixando na lista apenas ids diferentes do acima
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`);           //procedimento de aprovar
                                                                //depois preciso remover este accept da minha lista
        setRequests(requests.filter(request => request._id !== id))//deixando na lista apenas ids diferentes do acima

    }

    return (
        <>
        <ul className="notifications">     
            {requests.map(request => (  //percorrer todas minhas requests, pra cada uma vou retornar um codigo JSX '()'
            <li key={request._id}>
                <p>
                    <strong>{request.user.email}</strong> está solicitando reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>.
                    <button className="accept" onClick={() => handleAccept(request._id)}>ACEITAR</button>
                    <button className="reject" onClick={() => handleReject(request._id)}>REJEITAR</button>
                </p>
            </li>

            ) )}

        </ul>

        <ul className="spot-list">        
            {spots.map((spot, pos) => (
                <li key={spot._id} className="li-main">
                    <header style={{ backgroundImage: `url(${spot.thumbnail_url})`}}/> 
                    <strong>{spot.company}</strong>
                    <span>TECHS: </span>
                    <span><ul>{(spot.techs).map((spt, i) => <li key={i}> {spt}</li>)}</ul></span>
                    {/* techs.split(',').map(tech => tech.trim()), */}
                    <span>{spot.price ? `Preço: R$${spot.price},00/dia` : 'GRATUITO'}</span>

                    <button className="btn-del" outline onClick={(e) => deleteSpot(spot._id, pos)} >Apagar</button>
                    
                </li>

            ))}

        </ul>
        <div>
            {zeroSpot()} 
        </div>
        

        <Link to="/">
            <button className="btn-logout">Sair</button>   
        </Link>
       
        </>

    )
}