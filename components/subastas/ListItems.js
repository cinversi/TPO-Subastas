import React, { useState, useCallback } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import {size} from 'lodash'


export default function ListItems({ catItems, id, navigation, handleLoadMore }) {

    return (
        <View>
            <FlatList
                data={catItems}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(catItem) => (
                    <CatItem 
                        catItem={catItem} 
                        id={id}
                        navigation={navigation}/>
                )}
            />
        </View>
    )
}

function CatItem({ catItem,id, navigation }) {
    const [userLogged, setUserLogged] = useState(false)
    const { itemUuid, nombreItem, descripcion, cantidad } = catItem.item
    const [listadoPujas, setListadoPujas] = catItem.item.listadoPujas
    //console.log("adentor de la funcion:",listadoPujas)


    // for (let key in listadoPujas) {
    //     console.log(key,listadoPujas["horarioPuja"]);
    //     //console.log(listadoPujas[0])
    //   }

    
    const goCatItem = () => {
        navigation.navigate("catItem", { nombreItem,descripcion,itemUuid })
    } 

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    return (
        <TouchableOpacity onPress={goCatItem}>
            <View style={styles.viewCatitem}>
                <View>
                    <Text style={styles.catitemTitle}>Producto: {nombreItem}</Text>
                    <Text style={styles.catitemInformation}>Descripción: {descripcion}</Text>
                    <Text style={styles.catitemInformation}>Cantidad: {cantidad}</Text>
                    {
                        userLogged ? (
                            <Button
                                buttonStyle={styles.btnAddPayment}
                                title="Ver precio"
                                onPress={() => navigation.navigate("add-pujas-subasta", { id,catItem  })}
                            />
                        ) : (
                            <Text 
                                style={styles.mustLoginText}
                                onPress={() => navigation.navigate("login")}
                            >
                                Para visualizar el precio del producto o participar en la subasta es necesario iniciar sesión.{"\n"}
                                <Text style={styles.loginText}>
                                    Pulsa AQUÍ para hacerlo!
                                </Text>
                            </Text>
                        )
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewCatitem: {
        flexDirection: "row",
        margin: 10
    },
    viewCatitemImage: {
        marginRight: 15
    },
    imageCatitem: {
        width: 90,
        height: 90
    },
    catitemTitle: {
        fontWeight: "bold"
    },
    catitemInformation: {
        paddingTop: 2,
        color: "grey"
    },
    btnAddPayment: {
        backgroundColor: "#442484",
        padding: 5
    },
    mustLoginText: {
        textAlign: "center",
        color: "#a376c7",
        padding: 20,
    },
    loginText: {
        fontWeight: "bold"
    }
})