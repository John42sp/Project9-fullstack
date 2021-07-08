import React, { useState, useEffect  } from 'react';
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [ email, setEmail ] = useState('');   //pag login p/ salvar email e techs como strings em AsyncStorage
    const [ techs, setTechs ] = useState('');   //e direcionado para pag List, onde techs serão array

    useEffect(() => {                           //verificação de user logado, pra mantê-lo na pagina mesmo com reload
        AsyncStorage.getItem('user').then(user => {
            if(user) {
                navigation.navigate('List');
            }
        })
    })



    async function handleSubmit() {
        //email, techs
        // console.log(email);
        // console.log(techs);

        const response = await api.post('/sessions', {
            email
        })
        const { _id } = response.data;
        // console.log(_id);
        await AsyncStorage.setItem('user', _id);  //user: nome da info que queremos salvar
        await AsyncStorage.setItem('techs', techs);  // techs; idem

        navigation.navigate('List');  //assim que logar, navegar usuario pra rota/ pag List
    }

    return (
        <KeyboardAvoidingView behavior="padding" enabled={Platform.OS==='ios'} style={styles.container}>   

            <Image source={logo}/>

            <View style={styles.form}>   
                <Text style={styles.label}>SEU EMAIL *</Text> 
                
                <TextInput
                    style={styles.input}       //usar KeyboardAvoidingView ao invez do View, para teclado não ir                                  cima dos elementos em display na pagina (ocorre só no IOS)
                    placeholder='Seu e=mail'
                    placeholderTextColor='#999'
                    keyboardType='email-address' // para ativar caractere @ no teclado virtual acessado pelo Ctrl K
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                    // ou tbm  onChangeText={text => setEmail(text)}
                />

                <Text style={styles.label}>TECNOLOGIAS *</Text> 
                <TextInput
                    style={styles.input}
                    placeholder='Techs de interesse'
                    placeholderTextColor='#999'                    
                    autoCapitalize='words'   //'words' coloca a 1ª palavra em caixa alta
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Encontrar spots</Text>
                </TouchableOpacity>
            </View>    
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,                    //pra ocupar todo tamanho da tela
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  form: {
      alignSelf: 'stretch',   //pra ocupar toda largura da tela
      paddingHorizontal: 30,
      marginTop: 30

  },

  label: {                      //tag Text substitui tag label do web
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8
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
  buttonText: {
      color: '#fff',
      fontWeight:'bold',
      fontSize:16
    
  }
});