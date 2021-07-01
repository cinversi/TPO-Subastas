import React, { useState, useRef} from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'firebase/app'
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast'
import ChangePrecioBaseForm from '../../components/subastas/ChangePrecioBaseForm';
import Loading from '../../components/Loading'

export default function ListItemsMiSubastaAdmin({ catItems, id, navigation, handleLoadMore }) {
    // const [formData, setFormData] = useState(defaultFormValues());
    // const [errorPrecioBase, setErrorPrecioBase] = useState(null);
    // const validForm = () => {
    //     clearErrors()
    //     let isValid = true
 
    //     if (isEmpty(formData.precioBase)) {
    //     setErrorPrecioBase("Debes ingresar un precio base de la subasta.");
    //     isValid = false;
    //     }

    //     if (isNaN(formData.precioBase)) {
    //     setErrorPrecioBase("Debes ingresar un precio base válido.");
    //     isValid = false;
    //     }

    //     return isValid
    // }

    // const clearErrors = () => {
    //     setErrorPrecioBase(null)
    //     setFecha(null)
    //     setHora(null)
    //     setHoraFinSubasta(null)
    //     setHourPickerVisibility(false)
    //     setDatePickerVisibility(false)
    // }
    
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
    const { uuid, nombreItem, descripcion, cantidad } = catItem.item
    const [isModalVisible, setModalVisible] = useState(false);
    const [precioBase, setPrecioBase] = useState(null);

    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    
    console.log("dentro de la funcion",id)
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    //console.log("adentor de la funcion:",listadoPujas)


    // for (let key in listadoPujas) {
    //     console.log(key,listadoPujas["horarioPuja"]);
    //     //console.log(listadoPujas[0])
    //   }

    
    const goCatItem = () => {
        navigation.navigate("catItem", { uuid, nombreItem })
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
                                <Modal isVisible={isModalVisible}>
                                    <ChangePrecioBaseForm
                                        id={id}
                                        uuid={uuid}
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

// function FormAdd({
//     formData,
//     setFormData,
//     errorPrecioBase,
//   }) {
//     const onChange = (e, type) => {
//       setFormData({ ...formData, [type]: e.nativeEvent.text });
//     };
  
//     return (
//       <View style={styles.viewForm}>
//         <Text style={styles.CompletarTitle}>Completar los siguientes campos: </Text>
//         {
//                 <Input
//                     placeholder="$ Ingresar aqui Precio base"
//                     containerStyle={styles.inputPrecioBase}
//                     defaultValue={formData.precioBase}
//                     onChange={(e) => onChange(e, "precioBase")}
//                     errorMessage={errorPrecioBase}
//                 />
//         }
//       </View>
//     );
//   }

//   const defaultFormValues = () => {
//     return {
//       precioBase: ""
//     };
//   };

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