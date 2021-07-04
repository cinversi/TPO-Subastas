import React, { useState,useEffect,useCallback } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import moment from 'moment'
import {size} from 'lodash'
import Toast from 'react-native-easy-toast'
import { getCurrentUser,getUsers,ganadaPorPujador,reseteandoPujadores,getDocumentById,cerrandoSubasta,updatePujadorSubasta} from '../../utils/actions'

export default function ListItems({ catItems, id, horaComienzoSubasta,horaFinSubasta,fechaSubasta,subasta, currentUser, navigation, handleLoadMore }) {
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged((currentUser) => {
        currentUser ? setUserLogged(true) : setUserLogged(false)
    })

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
                        horaComienzoSubasta={horaComienzoSubasta}
                        horaFinSubasta={horaFinSubasta}
                        fechaSubasta={fechaSubasta}
                        subasta={subasta}
                        userLogged={userLogged}
                        navigation={navigation}/>
                )}
            />
        </View>
    )
}

function CatItem({ catItem,id,horaComienzoSubasta,horaFinSubasta,fechaSubasta,subasta, userLogged,navigation }) {
    const { itemUuid, nombreItem, descripcion, cantidad } = catItem.item
    const [subastaNoValida,setSubastaNoValida] = useState(false)
    const [ultimoPujador,setUltimoPujador] = useState("")
    const [ultimoPujadorID,setUltimoPujadorID] = useState("")
    const [ultimoValorPujado,setUltimoValorPujado] = useState("") 
    const [permitidoPujar,setPermitidoPujar] = useState(false)
    const [precioBaseItem,setPrecioBaseItem] = useState()
    const [ultimoDiaHorarioPuja,setUltimoDiaHorarioPuja] = useState()
    const [espectadorRematador,setEspectadorRematador] = useState(false)
    const [users,setUsers]=useState([])
    const [loading, setLoading] = useState(false)

    const goCatItem = () => {
        navigation.navigate("catItem", { nombreItem,descripcion,cantidad })
    }

    useEffect(() => {
        if (!validForm()) {
            return;
          }
        setPrecioBaseItem(ObtenerPrecioBaseItem(subasta,itemUuid))
        setUltimoDiaHorarioPuja(ObtenerDiaHorarioUltimaPuja(subasta,itemUuid))
        setEspectadorRematador(VerificarUsuarioRematador(subasta))
        //verificacionHorarioSubasta(ultimoValorPujado,ultimoPujadorID)
    }, [])

     useFocusEffect(
        useCallback(() => {
            async function getDataUsuario() {
                setLoading(true)
                const longitudPujas=size(subasta.listadoPujas)
                let lastPujador = ""
                if(longitudPujas>0)
                {
                    for(let i = 0; i < longitudPujas; i++){
                        if(subasta.listadoPujas[i].itemUuid==itemUuid){
                            lastPujador=subasta.listadoPujas[i].datosPujador
                            setLoading(true)
                            setUltimoPujadorID(lastPujador)
                            const response = await getDocumentById("users", lastPujador)
                            setUltimoPujador(response.document.nombre+" "+response.document.apellido)
                            setLoading(false)
                         }
                    }
                } else if (longitudPujas ==0 || longitudPujas>0 && !ultimoValorPujado ) {
                    setUltimoPujador("Anonimo")
                }
                const longitudPujas2=size(subasta.listadoPujas)
                const longitudPrecios=size(subasta.preciosBase)
                let pujaMax = 0
                if(longitudPujas2>0)
                {
                    for(let i = 0; i < longitudPujas2; i++){
                        if(subasta.listadoPujas[i].itemUuid==itemUuid){
                            pujaMax=subasta.listadoPujas[i].valorPujado
                        }
                    }
                }
                else if ((longitudPujas2 > 0 && !ultimoValorPujado)|| longitudPujas2 ==0 ) {
                    for(let i = 0; i < longitudPrecios; i++){
                        if(subasta.preciosBase[i].itemUuid==itemUuid){
                            pujaMax=subasta.preciosBase[i].precioBase
                        }
                    }
                }
                pujaMax=parseFloat(pujaMax)
                setUltimoValorPujado(pujaMax)

                let date = 
                moment()
                .utcOffset('-3:00')
                .format('D-M-YYYY');

                //Para diferencia entre dia de hoy y dia de comienzo de subasta -> diffDias  
                const oldDate = new Date()
                const day = oldDate.getDate();
                const month = oldDate.getMonth() + 1;
                const year = oldDate.getFullYear();         
                date=date+' '+'05:00'
                const fechaSubastaFull=fechaSubasta+' '+'00:00'
                const fechaFinSubasta = year + "-" + month + "-" + day + " " + horaFinSubasta;
                var hoyMomenteado=moment(date,"YYYY-M-D")
                var comienzoMomenteado=moment(fechaSubastaFull,"YYYY-M-D")
                var diffDias=moment.duration(hoyMomenteado.diff(comienzoMomenteado)).asDays()
                //Fin de calculo para diffDias

                //Diferencia momentoActual-comienzoSubasta

                //var d = new Date();
                //var s = d.format("hh:mm:ss tt");
                let horaMinActual = 
                moment()
                .utcOffset('-3:00')
                .format('HH:mm');

                var time_start = new Date();
                var time_end = new Date();
                var value_start =horaComienzoSubasta.split(':');
                var value_end = horaMinActual.split(':');

                time_start.setHours(value_start[0], value_start[1], 0)
                time_end.setHours(value_end[0], value_end[1], 0)

                const diffHoursComienzoAhora = time_end - time_start // millisecond 

                //Diferencia finSubasta-momentoActual
                var time_start1 = new Date();
                var time_end1 = new Date();
                var value_start1 =horaMinActual.split(':');
                var value_end1 = horaFinSubasta.split(':');

                time_start1.setHours(value_start1[0], value_start1[1], 0)
                time_end1.setHours(value_end1[0], value_end1[1], 0)

                const diffHoursFinAhora = time_end1 - time_start1 // millisecond 
        
                if(diffDias==0){
                    if(diffHoursComienzoAhora>=0 && diffHoursFinAhora>=0){
                        setSubastaNoValida(false)
                    }
                    else if(diffHoursComienzoAhora<0){
                        //En este caso quiere decir que todavia no llegó el momento del comienzo de la subasta.
                        console.log("Subasta no disponible")
                        setSubastaNoValida(true)
                    }
                    else if (diffHoursFinAhora<0){
                        setSubastaNoValida(true)
                        //Este caso quiere decir que ya es más tarde que el momento de la subasta
                        //Hay que guardar usuario final,puja final,listadoDePujas y borrar las pujas, enviar mail al ganador

                        //Finalizar subasta cambiará el estado de la subasta
                        setLoading(true)
                        const resultCerrandoSubasta = await cerrandoSubasta("subastas",id,"CERRADA") 
                        if (!resultCerrandoSubasta.statusResponse) {
                            setLoading(false)
                        }

                        //Asigna al usuario la subasta ganada
                        setLoading(true)
                        const resultGanadaPujador = await ganadaPorPujador("users",lastPujador,id,itemUuid,nombreItem,pujaMax) 
                        if (!resultGanadaPujador.statusResponse) {
                            setLoading(false)
                        }

                        const longitudPujas3=size(subasta.listadoPujas)
                        console.log("longitudPujas3",longitudPujas3)
                        for(let i = 0; i < longitudPujas3; i++){
                            setLoading(true)
                            console.log("Participantes",subasta.listadoPujas[i].datosPujador)
                            const resultPujadores = await updatePujadorSubasta("users",subasta.listadoPujas[i].datosPujador,"0")
                            setLoading(false)
                        }  
                    }
                }
                else if(diffDias>0)
                {
                    //En este caso sería si ya nos pasamos del día de la subasta
                    //Hay que guardar usuario final,puja final,listadoDePujas y borrar las pujas, enviar mail al ganador
                    console.log("Subasta no disponible")
                    setSubastaNoValida(true)

                    //Finalizar subasta cambiará el estado de la subasta
                    setLoading(true)
                    const resultCerrandoSubasta = await cerrandoSubasta("subastas",id,"CERRADA") 
                    if (!resultCerrandoSubasta.statusResponse) {
                        setLoading(false)
                        toastRef.current.show("Error al finalizar subasta", 3000)
                    }

                    //Asigna al usuario la subasta ganada
                    setLoading(true)
                    const resultGanadaPujador = await ganadaPorPujador("users",lastPujador,id,itemUuid,nombreItem,pujaMax) 
                    if (!resultGanadaPujador.statusResponse) {
                        setLoading(false)
                    }                          

                    //Asigna al usuario la subasta ganada
                    const longitudPujas3=size(subasta.listadoPujas)
                    console.log("longitudPujas3",longitudPujas3)
                    for(let i = 0; i < longitudPujas3; i++){
                        setLoading(true)
                        console.log("Participantes",subasta.listadoPujas[i].datosPujador)
                        const resultPujadores = await updatePujadorSubasta("users",subasta.listadoPujas[i].datosPujador,"0")
                        setLoading(false)
                    }
                    
                }
                else if(diffDias<0){
                    //Caso en cual la subasta es en el futuro, todavia no se llegó al día
                    console.log("Subasta no disponible")
                    setSubastaNoValida(true)
                } 
            }
            getDataUsuario()
        }, [])
    )

    const validForm = () => {
        clearErrors();
        let isValid = true;
        
        if(userLogged){
            if(getCurrentUser().uid != ultimoPujadorID){
                setPermitidoPujar(true)
            }
        }
        return isValid;
      };

      const clearErrors = () => {
        setPermitidoPujar(false);
      };
    

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

    const ObtenerDiaHorarioUltimaPuja = (subasta,itemUuid) => {
        const longitudPujas=size(subasta.listadoPujas)
        let horarioDia = ""
        if(longitudPujas==0){
            horarioDia="No hay pujas hasta el momento"
        }        
        else{
            for(let i = 0; i < longitudPujas; i++){
                if(subasta.listadoPujas[i].itemUuid==itemUuid){
                    horarioDia=subasta.listadoPujas[i].horarioPuja
                }
            }
        }
        return horarioDia
    }

    const VerificarUsuarioRematador = (subasta) =>{
        let esElRematador=false
        if(userLogged){
            if(subasta.rematador==getCurrentUser().uid){
                esElRematador=true
            }
        }
        return esElRematador
    }

    const verificacionHorarioSubasta = async (ultimoValorPujado,ultimoPujadorID) => {
        let date = 
        moment()
          .utcOffset('-3:00')
          .format('D-M-YYYY');

        //Para diferencia entre dia de hoy y dia de comienzo de subasta -> diffDias  
        const oldDate = new Date()
        const day = oldDate.getDate();
        const month = oldDate.getMonth() + 1;
        const year = oldDate.getFullYear();         
        date=date+' '+'05:00'
        const fechaSubastaFull=fechaSubasta+' '+'00:00'
        const fechaFinSubasta = year + "-" + month + "-" + day + " " + horaFinSubasta;
        var hoyMomenteado=moment(date,"YYYY-M-D")
        var comienzoMomenteado=moment(fechaSubastaFull,"YYYY-M-D")
        var diffDias=moment.duration(hoyMomenteado.diff(comienzoMomenteado)).asDays()
        //Fin de calculo para diffDias

        //Diferencia momentoActual-comienzoSubasta

        //var d = new Date();
        //var s = d.format("hh:mm:ss tt");
        let horaMinActual = 
        moment()
          .utcOffset('-3:00')
          .format('HH:mm');

        var time_start = new Date();
        var time_end = new Date();
        var value_start =horaComienzoSubasta.split(':');
        var value_end = horaMinActual.split(':');

        time_start.setHours(value_start[0], value_start[1], 0)
        time_end.setHours(value_end[0], value_end[1], 0)

        const diffHoursComienzoAhora = time_end - time_start // millisecond 

        //Diferencia finSubasta-momentoActual
        var time_start1 = new Date();
        var time_end1 = new Date();
        var value_start1 =horaMinActual.split(':');
        var value_end1 = horaFinSubasta.split(':');

        time_start1.setHours(value_start1[0], value_start1[1], 0)
        time_end1.setHours(value_end1[0], value_end1[1], 0)

        const diffHoursFinAhora = time_end1 - time_start1 // millisecond 
  
        if(diffDias==0){
            if(diffHoursComienzoAhora>=0 && diffHoursFinAhora>=0){
                setSubastaNoValida(false)
            }
            else if(diffHoursComienzoAhora<0){
                //En este caso quiere decir que todavia no llegó el momento del comienzo de la subasta.
                console.log("Subasta no disponible")
                setSubastaNoValida(true)
            }
            else if (diffHoursFinAhora<0){
                setSubastaNoValida(true)
                //Este caso quiere decir que ya es más tarde que el momento de la subasta
                //Hay que guardar usuario final,puja final,listadoDePujas y borrar las pujas, enviar mail al ganador

                //Finalizar subasta cambiará el estado de la subasta
                setLoading(true)
                const resultCerrandoSubasta = await cerrandoSubasta("subastas",id,"CERRADA") 
                if (!resultCerrandoSubasta.statusResponse) {
                    setLoading(false)
                }

                //Asigna al usuario la subasta ganada
                setLoading(true)
                const resultGanadaPujador = await ganadaPorPujador("users",ultimoPujadorID,id,itemUuid,nombreItem,ultimoValorPujado) 
                if (!resultGanadaPujador.statusResponse) {
                    setLoading(false)
            }

        }
    }
        else if(diffDias>0)
        {
            //En este caso sería si ya nos pasamos del día de la subasta
            //Hay que guardar usuario final,puja final,listadoDePujas y borrar las pujas, enviar mail al ganador
            console.log("Subasta no disponible")
            setSubastaNoValida(true)

            //Finalizar subasta cambiará el estado de la subasta
            setLoading(true)
            const resultCerrandoSubasta = await cerrandoSubasta("subastas",id,"CERRADA") 
            if (!resultCerrandoSubasta.statusResponse) {
               setLoading(false)
               toastRef.current.show("Error al finalizar subasta", 3000)
            }

            //Asigna al usuario la subasta ganada
            setLoading(true)
            const resultGanadaPujador = await ganadaPorPujador("users",ultimoPujadorID,id,itemUuid,nombreItem,ultimoValorPujado) 
            if (!resultGanadaPujador.statusResponse) {
                setLoading(false)
            }
        }
        else if(diffDias<0){
            //Caso en cual la subasta es en el futuro, todavia no se llegó al día
            console.log("Subasta no disponible")
            setSubastaNoValida(true)
        }   

    }

    return (
        <TouchableOpacity onPress={goCatItem}>
            <View style={styles.viewCatitem}>
                <View>
                    <Text style={styles.catitemTitle}>Producto: {nombreItem}</Text>
                    <Text style={styles.catitemInformation}>Descripción: {descripcion}</Text>
                    <Text style={styles.catitemInformation}>Cantidad: {cantidad}</Text>
                    { 
                        espectadorRematador ? 
                            <Text style={styles.mensajes} >
                            Al terminar la subasta se te informarán los resultados.
                            </Text>
                        : userLogged && !subastaNoValida ? 
                            <Button
                                buttonStyle={styles.btnAddPayment}
                                title="Ver precio"
                                onPress={() => navigation.navigate("add-pujas-subasta", { id,itemUuid,permitidoPujar,nombreItem,ultimoValorPujado,ultimoPujador,precioBaseItem,ultimoDiaHorarioPuja })}
                            />
                        : subastaNoValida && !userLogged ?
                        <View>
                             <Text 
                                style={styles.mustLoginText}
                                onPress={() => navigation.navigate("login")}
                            >
                                Para visualizar el precio del producto o participar en la subasta es necesario iniciar sesión.{"\n"}
                                <Text style={styles.loginText}>
                                    Pulsa AQUÍ para hacerlo!
                                </Text>
                            </Text>
                            <Text style={styles.mensajes}>
                                La subasta elegida no se encuentra disponible
                            </Text>
                            </View>
                    : !subastaNoValida && !userLogged ?
                        <View>
                            <Text 
                            style={styles.mustLoginText}
                            onPress={() => navigation.navigate("login")}
                            >
                            Para visualizar el precio del producto o participar en la subasta es necesario iniciar sesión.{"\n"}
                            <Text style={styles.loginText}>
                                Pulsa AQUÍ para hacerlo!
                            </Text>
                             </Text>
                         </View> 
                        : subastaNoValida && userLogged ?      
                        <Text 
                        style={styles.mensajes}>
                        La subasta elegida no se encuentra disponible
                    </Text>
                        : null  
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
    },    
    mensajes: {
        marginTop:10,
        fontWeight: "bold",
        textAlign: "center"
    }
})