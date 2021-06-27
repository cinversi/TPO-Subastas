import React, { useState, useRef,useCallback } from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import { isEmpty } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
 
import Loading from '../../components/Loading'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, updateDocument, addNewPuja } from '../../utils/actions'
 
export default function AddReviewSubasta({ navigation, route }) {
    const { idSubasta } = route.params
    const toastRef = useRef()
 
    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [errorTitle, setErrorTitle] = useState(null)
    const [puja, setPuja] = useState("")
    const [errorReview, setErrorReview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [subasta, setSubasta] = useState(null)
    const [listadoPujas, setListadoPujas] = useState([])
 
    useFocusEffect(
        useCallback(() => {
            async function getData() {
                const responseGetSubasta = await getDocumentById("subastas", idSubasta)
                setSubasta(responseGetSubasta.document)
            }
            getData()
        }, [])
    )
    
 
    const addReview = async() => {
        if (!validForm()) {
            return
        }
 
        setLoading(true)
        const user = getCurrentUser()
        const data = {
            idUser: user.uid,
            avatarUser: user.photoURL,
            idSubasta,
            title,
            review,
            rating,
            createAt: new Date()
        }
 
        const responseAddReview = await addDocumentWithoutId("reviews", data)
        if (!responseAddReview.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al enviar el comentario, por favor intenta más tarde.", 3000)
            return
        }
 
        const responseGetSubasta = await getDocumentById("subastas", idSubasta)
        if (!responseGetSubasta.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al obtener la subasta, por favor intenta más tarde.", 3000)
            return
        }
 
        const subasta = responseGetSubasta.document
        const ratingTotal = subasta.ratingTotal + rating
        const quantityVoting = subasta.quantityVoting + 1
        const ratingResult = ratingTotal / quantityVoting
        const responseUpdateSubasta = await updateDocument("subastas", idSubasta, {
            ratingTotal,
            quantityVoting,
            rating: ratingResult
        })
        setLoading(false)
 
        if (!responseUpdateSubasta.statusResponse) {
            toastRef.current.show("Error al actualizar la subasta, por favor intenta más tarde.", 3000)
            return
        }
 
        navigation.goBack()
    }
 
    const addPuja = async () => {
        if (!validForm()) {
            return
        }
        setLoading(true)
        const responseAddPuja = await addNewPuja(idSubasta,puja,getCurrentUser().uid )
        if (!responseAddPuja.statusResponse) {
            setLoading(false)
            console.log(idSubasta,puja,getCurrentUser().uid)
            toastRef.current.show("Error al realizar puja", 3000)
            return
        }
 
 
    } 
 
    const validForm = () => {
        setErrorTitle(null)
        setErrorReview(null)
        let isValid = true
 
        if (puja<subasta.precioBase){
            setErrorReview("El valor a pujar es menor que el precio actual")
            isValida=false
        }
 
        return isValid
    }
 
    if (subasta === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }
 
    return (
        <KeyboardAwareScrollView style={styles.viewBody}>
            <View>
                <Text style={{fontSize: 30,textAlign:"center"}}>Precio actual</Text>
               <Text style={styles.viewPrecioBase}>${subasta.precioBase}</Text>
            </View>
            <FlatList
                        data={subasta.pujas}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(puja) => 
                            <Pujas
                                puja={puja}
                                navigation={navigation}
                            />
                        }
                    />
            <View style={styles.formReview}>
                <Input
                    placeholder="Valor a pujar"
                    containerStyle={styles.input}
                    onChange={(e) => setPuja(e.nativeEvent.text)}
                    errorMessage={errorReview}
                />
                <Button
                    title="Pujar"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addPuja}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Enviando comentario..."/>
        </KeyboardAwareScrollView>
    )
}
 
function Pujas ({ puja, navigation }) {
    const { hora, nombre, valor } = puja.item
}
 
const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewPrecioBase:{
        fontSize:30,
        textAlign:"center"
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1, 
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
