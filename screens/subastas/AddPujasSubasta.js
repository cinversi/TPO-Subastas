import React, { useState, useRef} from 'react'
import { Alert,SafeAreaView,StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native'
import { Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { isEmpty,size} from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Loading from '../../components/Loading'
import { getCurrentUser, addNewPuja,asistiendoAPuja,getDocumentById } from '../../utils/actions'
 
export default function AddPujasSubasta({ navigation, route }) {
    const { subasta,id,itemUuid,permitidoPujar,nombreItem,ultimoValorPujado,ultimoPujador,precioBaseItem,ultimoDiaHorarioPuja,subastaNoValida,espectadorRematador} = route.params
    const toastRef = useRef()
 
    const [puja,setPuja] = useState(null)
    const [errorPuja,setErrorPuja]=useState(null)
    const [loading, setLoading] = useState(false) 

    function getParsedDate() {
        const oldDate = new Date();
        const day = oldDate.getDate();
        const month = oldDate.getMonth() + 1;
        const year = oldDate.getFullYear();
        const hour = oldDate.getHours();
        const minutes = oldDate.getUTCMinutes();

        const horario=day + "-" + month + "-" + year + " " + hour + ":" + minutes
        return horario
    }
    
    const addPuja = async() => {
        if (!validForm()) {
            return
        }
        const horarioPuja = getParsedDate()
        setLoading(true)
        const usuarioActual = await getDocumentById("users",getCurrentUser().uid)
        const longitudMediosPago = size(usuarioActual.document.medioPago)
        console.log("usuarioSubasta",usuarioActual.document.estoyEnSubasta,id)
        if(longitudMediosPago > 0){
            if(usuarioActual.document.estoyEnSubasta=="0" ||usuarioActual.document.estoyEnSubasta==id){
                console.log("No estoy en otra subasta")
                const responseAddPuja = await addNewPuja(id,itemUuid,puja,getCurrentUser().uid,horarioPuja )
                cambiarAsistenciaAPuja()
                if (!responseAddPuja.statusResponse) {
                    setLoading(false)
                    toastRef.current.show("Error al realizar puja", 3000)
                    return
                }
                toastRef.current.show("Su puja fue realizada", 3000)
                navigation.navigate("subastas") 
            }
            else{
                console.log("Estoy en otra subasta")
                setLoading(false)
                //Alert.alert("Confirmación", "Se le ha enviado un email con las instrucciones para generar su contraseña.",)
                AlertaParticipandoEnOtraSubasta()            
                navigation.navigate("subastas") 
            }
        }        
        else{
            setLoading(false)
            //Alert.alert("Confirmación", "Se le ha enviado un email con las instrucciones para generar su contraseña.",)
            AlertaNoMediosDePago()            
            navigation.navigate("account") 
        }
        
    }
    const AlertaNoMediosDePago = () =>
        Alert.alert(
        "Fallo",
        "No tenes medios de pago registrados",
        [
            {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "OK", onPress: () => navigation.navigate("account")  }
        ]
    );

    const AlertaParticipandoEnOtraSubasta = () =>
        Alert.alert(
        "Fallo",
        "Actualmente ya estas participando en otra subasta",
        [
            {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "OK", onPress: () => navigation.navigate("account")  }
        ]
    );


    const cambiarAsistenciaAPuja = async () =>{
        setLoading(true)
        const result = await asistiendoAPuja("users",getCurrentUser().uid,id,id,itemUuid,nombreItem) 
        if (!result.statusResponse){
            setLoading(false)
            toastRef.current.show("Error al confirmar asistencia a la puja", 3000)
            return
        }
    }

 
    const validForm = () => {
        clearErrors()
        let isValid = true
        const pujaInt=parseInt(puja)
        const valorLimit=(parseInt(ultimoValorPujado))*1.20
        const ultimoValorPujadoInt=parseInt(ultimoValorPujado)
 
        console.log("categoriaSubasta",subasta.categoria)
        console.log("ultimovalorpujado",ultimoValorPujado)
        if(subasta.categoria=="COMUN" || subasta.categoria == "ESPECIAL" || subasta.categoria== "PLATA"){
            if(parseInt(puja)<parseInt(ultimoValorPujadoInt*1.01)){
                setErrorPuja("Debes ingresar un monto mayor al 1% del precio base")
                isValid=false
        }
        }  

        if(pujaInt<=ultimoValorPujadoInt){
            setErrorPuja("El monto ingresado debe ser mayor a la ultima puja.")
            isValid = false
        }
 
        if(pujaInt>valorLimit){
            setErrorPuja("El monto ingresado no debe exceder al 20% del valor de la misma.")
            isValid = false 
        }
 
        if(isNaN(puja)){
            setErrorPuja("Debes ingresar un valor numerico para pujar.")
            isValid = false  
        }
        
        if (isEmpty(puja)) {
            setErrorPuja("Debes ingresar un valor para pujar.")
            isValid = false
        }
 
        return isValid
    }

    console.log("AddPujaspermitidoPujar",permitidoPujar)
 
    const clearErrors = () => {
        setErrorPuja(null)
    }

    return (
        <KeyboardAwareScrollView>
            <View style={styles.viewBody}>
                <View>
                    <Text style={styles.viewPrecioBaseText}>Precio base</Text> 
                    <Text style={styles.viewPrecioBase}>${precioBaseItem}</Text>
                    <Text style={styles.viewPrecioActualText}>Precio actual</Text>
                    <Text style={styles.viewPrecioActual}>${ultimoValorPujado}</Text>
                    <Text style={styles.viewInfo}>{nombreItem}</Text>
                    <Text style={styles.viewUltimasPujas}>Día y horario de última puja: {ultimoDiaHorarioPuja}</Text>
                    <Text style={styles.viewUltimasPujas}>Ultimo pujador: {ultimoPujador}</Text>
                </View>
                {
                    permitidoPujar ?
                <View style={styles.formReview}>
                    <Input
                        placeholder="$ Ingresar valor a pujar"
                        containerStyle={styles.input}
                        onChange={(e) => setPuja(e.nativeEvent.text)}
                        errorMessage={errorPuja}
                    />
                <Button
                        title="Pujar"
                        onPress={addPuja}
                        buttonStyle={styles.btn}
                        containerStyle={styles.btnContainer}
                    />
                </View>
                    : !permitidoPujar ? 
                        <View>
                            <Text style={styles.viewNoPujarBigText}>
                            Si ya realizaste una puja debes esperar a que otra persona realice una para volver a pujar, intenta más tarde.
                            </Text>         
                        </View>
                    : null      
                }
                <Toast ref={toastRef} position="center" opacity={0.9}/>
                <Loading isVisible={loading} text="Enviando su puja..."/>
            </View>
        </KeyboardAwareScrollView>
    )
}
 
 
const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewPrecioBaseText:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 15
    },
    viewPrecioBase:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9"
    },
    viewPrecioActualText:{
        fontSize:30,
        textAlign:"center",
        color:"#442484",
        fontWeight:"bold",
        marginTop: 15
    },
    viewPrecioActual:{
        fontSize:30,
        textAlign:"center",
        color:"#442484",
        fontWeight:"bold"
    },
    viewInfo:{
        fontSize:15,
        textAlign:"center",
        fontWeight:"bold"
    },
    viewInfoHora:{
        fontSize:15,
        textAlign:"center",
        fontWeight:"bold"
    },
    viewUltimasPujas:{
        fontSize:15,
        marginTop: 20
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 20
    },
    input: {
        marginBottom: 10,
        marginTop:50
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
        marginBottom: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    },  
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
      },
    viewNoPujarText:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 15
    },
    viewNoPujarSubText:{
        fontSize:15,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 10
    },
    viewNoPujarBigText:{
        fontSize:15,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 10
    }
})