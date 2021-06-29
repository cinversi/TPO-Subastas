import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListItems({ catItems, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={catItems}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(catItem) => (
                    <Subasta catItem={catItem} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function catItem({ catItem, navigation }) {
    const { uuid, nombreItem, descripcion, cantidad } = catItem.item

    const goCatItem = () => {
        navigation.navigate("catItem", { id, nombreItem })
    } 

    return (
        <TouchableOpacity onPress={goCatItem}>
            <View style={styles.viewCatitem}>
                <View>
                    <Text style={styles.catitemTitle}>{nombreItem}</Text>
                    <Text style={styles.catitemInformation}>{descripcion}</Text>
                    <Text style={styles.catitemInformation}>{cantidad}</Text>
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
    }
})