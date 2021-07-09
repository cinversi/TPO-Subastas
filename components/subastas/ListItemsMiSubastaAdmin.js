import React, { useState, useRef} from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'firebase/app'
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast'
import ChangePrecioBaseForm from '../../components/subastas/ChangePrecioBaseForm';
import Loading from '../../components/Loading'

export default function ListItemsMiSubastaAdmin({ catItems, id, navigation, handleLoadMore }) {
    
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
    const [isModalVisible, setModalVisible] = useState(false);
    const [precioBase, setPrecioBase] = useState(null);

    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const goCatItem = () => {
        navigation.navigate("catItem", { itemUuid, nombreItem })
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
                            <View>
                                <Button
                                    buttonStyle={styles.btnAddPayment}
                                    title="Establecer precio"
                                    onPress={toggleModal}
                                />
                                <Modal isVisible={isModalVisible} transparent={false}>
                                    <ChangePrecioBaseForm
                                        id={id}
                                        itemUuid={itemUuid}
                                        precioBase={precioBase}
                                        setModalVisible={setModalVisible}
                                        toastRef={toastRef}
                                    />
                                </Modal>
                            </View>
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
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text={loadingText}/>
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
        backgroundColor: "#b05777",
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