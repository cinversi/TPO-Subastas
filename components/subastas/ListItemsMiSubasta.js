import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import firebase from 'firebase/app'
import {size} from 'lodash'
export default function ListItemsMiSubasta({ catItems, id, navigation, handleLoadMore, subasta}) {

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
                        navigation={navigation}
                        subasta={subasta}/>
                )}
            />
        </View>
    )
}

function CatItem({ catItem, navigation, subasta}) {
    const [userLogged, setUserLogged] = useState(false)
    const { itemUuid, nombreItem, descripcion, cantidad } = catItem.item
    const [precioBaseItem,setPrecioBaseItem] = useState()
    const [comisionBaseItem,setComisionBaseItem] = useState()

    const goCatItem = () => {
        navigation.navigate("catItem", { itemUuid, nombreItem })
    } 
    
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useEffect(() => {
        setPrecioBaseItem(ObtenerPrecioBaseItem(subasta,itemUuid))
        setComisionBaseItem(ObtenerComisionBaseItem(subasta,itemUuid))
        console.log(precioBaseItem)
    }, [])
    
    const ObtenerPrecioBaseItem = (subasta,itemUuid) => {
        const longitudPrecios=size(subasta.preciosBase)
        let precioBaseProd = ""
        for(let i = 0; i < longitudPrecios; i++){
            if(subasta.preciosBase[i].itemUuid==itemUuid){
                precioBaseProd =subasta.preciosBase[i].precioBase
            }
        }
        return precioBaseProd
    }
    const ObtenerComisionBaseItem = (subasta,itemUuid) => {
        const longitudPrecios=size(subasta.preciosBase)
        let comisionBaseProd = ""
        for(let i = 0; i < longitudPrecios; i++){
            if(subasta.preciosBase[i].itemUuid==itemUuid){
                comisionBaseProd=parseFloat(parseInt(subasta.preciosBase[i].precioBase)*0.1).toFixed(2)
            }
        }
        return comisionBaseProd
    }
 
    return (
        <TouchableOpacity onPress={goCatItem}>
            <View style={styles.viewCatitem}>
                <View>
                    <Text style={styles.catitemTitle}>Producto: {nombreItem}</Text>
                    <Text style={styles.catitemInformation}>Descripción: {descripcion}</Text>
                    <Text style={styles.catitemInformation}>Cantidad: {cantidad}</Text>
                    <Text style={styles.catitemTitle}>Precio Base: ${precioBaseItem}</Text>
                    <Text style={styles.catitemTitle}>Comision Base: ${comisionBaseItem} (*)</Text>
                    <Text style={styles.catitemInformation}>(*) La comisión final será calculada siendo el 10% del precio final del producto.</Text>
                    <Text style={styles.catitemRecordatorio}>Recordatorio: En caso de rechazar la oferta se llevará a cabo la devolución del bien y se le cobrarán los gastos de devolución.</Text>
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
    catitemRecordatorio: {
        paddingTop: 2,
        color: "grey",
        fontStyle: "italic"
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