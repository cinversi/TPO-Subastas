import React from 'react'
import { StyleSheet, Text, ScrollView, Image } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
export default function UserGuest() {
    const navigation = useNavigation()
    
    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/subastas-logo.png")}
                resizeMove="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil en SubastAR</Text>
            <Text style={styles.description}>Compra bienes al mejor precio! Busca y visualiza las mejores subastas de una forma
                sencilla, participa en la que te haya gustado mas y llevate todo!
            </Text>
            <Button
                buttonStyle={styles.button}
                title="Ver tu perfil"
                onPress={() => navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30
    },
    image:{
        height: 300,
        width:"100%",
        marginBottom:10
    },
    title:{
        fontWeight:"bold",
        fontSize:19,
        marginVertical:10,
        textAlign:"center"
    },
    description:{
        textAlign:"justify",
        marginBottom:20,
        color:"#a65273"        
    },
    button:{
        backgroundColor:"#442484"
    }
})
