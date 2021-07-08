import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { Alert, StyleSheet, Image, ScrollView, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/logo.png';
import SpotList from '../components/SpotList';

export default function List({ navigation }) {
    const [ techs, setTechs ] = useState([ ]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.1.4:4444', {
                query: { user_id }
            });
            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`)
            })
        })

    }, []);

    useEffect(() => {                           //para executar um método assim q logado, uma unica vez,  vetor vazio
                                                //tornar varias strings em uma array
        AsyncStorage.getItem('techs').then(storagedTechs => {

            const techsArray = storagedTechs.split(',').map(tech => tech.trim()); 
            setTechs(techsArray);           //split= separar com virgula, map percorrer cada do array e tirar espaço 
        })                                  //antes e depois com metodo trim:  [react, native, etc]
    }, [])                                  // variavel com array de techs, salvada em setTechs, as quais o usuário 
                                            //descreveu no seu login
   
    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }
                                        
        return (
                                // SafeAreaViem invez de View:  fique visível apenas na area de display
            <SafeAreaView style={styles.container}>  
                <Image style={styles.logo} source={logo}/>         
                <Text>{techs}</Text>

                            {/* passar ou 'criar propriedades (ex.:tech) para listas mostrarem conforme um tipo info */}
                             {/* para listar apenas spots c/ tecnol. ReactJS */}
               <ScrollView>  
                    {techs.map(tech =>  <SpotList key={tech} tech={tech}/> )}   
                </ScrollView>              
                                                                    {/* key vai em todo map(), para organizar index */}

              
                <TouchableOpacity onPress={handleLogout} style={styles.buttonLogout} >                    
                    <Text style={styles.buttonLogoutText}>Logout</Text>
                </TouchableOpacity>

            </SafeAreaView>
        )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,

    },
    logo: {
        height: 32,
        resizeMode:'contain',   //acomodar a dimenssão original na altura acima, sem cortar
        alignSelf: 'center',
        marginTop: 60
    },
    buttonLogout: {
        height: 32,
        backgroundColor: '#bbb',
        borderRadius: 2,
        width: 100,
        marginTop: 35,
        alignSelf:'center',
        marginBottom:5
    },
    buttonLogoutText: {
        color: '#fff',
        fontWeight:'bold',
        fontSize:16,     
        alignItems:'center', 
        justifyContent:'center',
        alignSelf:'center'
    }
})

