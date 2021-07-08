import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function Book({ navigation }) {
    const [ date, setDate ] = useState('');   // data
    const id  = navigation.getParam('id');  //id do spot que quero reservar

    async function handleSubmit() {
        const user_id = await AsyncStorage.getItem('user');  //id do usuário logado
                                //id - parametro na rota
        await api.post(`/spots/${id}/bookings`, { //fazer a chamada na api (insomnia) - rota booking com id do spot, e 
            date //corpo                                  //enviar 2 configurações: data e id do usuario logado
        }, {
            headers: { user_id } //cabeçalho
        })   
        Alert.alert('Solicitação de reserva enviada!');

        navigation.navigate('List');
    }

    function handleCancel() {
        navigation.navigate('List');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>{id}</Text>

            <Text style={styles.label}>DATA DE INTERESSE *</Text> 
                <TextInput
                    style={styles.input}
                    placeholder='Qual data você quer reservar?'
                    placeholderTextColor='#999'                    
                    autoCapitalize='words'   //'words' coloca a 1ª palavra em caixa alta
                    autoCorrect={false}
                    value={date}
                    onChangeText={setDate}
                />

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Solicitar reserva</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        margin: 30
    },
    label: {                      
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
        marginTop: 20
      },
      input: {
          borderWidth: 1,
          borderColor: '#ddd',
          paddingHorizontal: 20,
          fontSize: 16,
          color: '#444',
          height: 44,
          marginBottom: 20,
          borderRadius: 2
      },
      button: {
          height: 42,
          backgroundColor: '#f05a5b',
          justifyContent: 'center',
          alignItems:'center',
          borderRadius: 2
      },
      cancelButton: {
        backgroundColor: '#ccc',    
        marginTop: 10   
    },
      buttonText: {
          color: '#fff',
          fontWeight:'bold',
          fontSize:16
        
      }

})