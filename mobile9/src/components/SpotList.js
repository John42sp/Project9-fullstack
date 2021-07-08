import React, { useState, useEffect } from 'react';
import {withNavigation } from 'react-navigation';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

import api from '../services/api';

function SpotList({ tech, navigation }) {      // propriedade tech // ou export default function SpotList(props) {

    const [ spots, setSpots ] = useState([]);  //useState p salvar techs buscadas na api do backend


    useEffect(() => {                   //useEffect para buscar techs na api no backend
        async function loadSpots() {
            const response = await api.get('/spots', {
                params: { tech }
            })
            setSpots(response.data);   //p/ salvar array spots // console.log(response.data) p/visualisar spots no backend
        }
        loadSpots();
    }, [])
    function handleNavigate(id) {
        navigation.navigate('Book', { id })
    }

    //Return <Text>{tech}</Text>     // tech é lista de techs do map()// ou return <Text>{props.tech}</Text> 

    

    return (
            <View style={styles.container }>
                <Text style={styles.title}>Empresas que usam <Text style={styles.bold}>{tech}</Text> </Text>

                <FlatList
                style={styles.list}
                data={spots}
                keyExtractor={spot => spot._id}            // ao invez de key, listar devolver qual informação é unica
                horizontal
                showsHorizontalScrollIndicator={false}      //tirar a barrinha de scroll
                renderItem={({ item }) => (                 //item é o spot(todas infors do spot no item)
                                                        //item poderia ser outros infos da lista(par, impar, ultimo..)
                    <View style={styles.listItem}>          
                        <Image style={styles.thumbnail} source={{ uri: item.thumbnail_url }} />
                        <Text style={styles.company}>{item.company}</Text>
                        <Text style={styles.price}>{item.price ? `R$${item.price}/dia` : 'GRATUITO'}</Text>
                        <TouchableOpacity onPress={() => handleNavigate(item._id)} style={styles.button}>
                            <Text style={styles.buttonText}>Solicitar reserva</Text>
                        </TouchableOpacity>
                    </View>
                )}
                />               

            </View>
        )       
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
    },
    title: {
        fontSize: 20,
        color:'#444',
        paddingHorizontal: 20,
        marginBottom: 15
    },    
    bold:{
        fontWeight: 'bold'
    },
    list: {
        paddingHorizontal: 20
    },
    listItem: {
        marginRight: 15
    },
    thumbnail: {
        width: 200,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 2
    },
    company: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    price: {
        fontSize: 15,
        color: '#999',
        marginTop: 5
    },
    button: {
        height: 32,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginTop: 15
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    }

})

export default withNavigation(SpotList);