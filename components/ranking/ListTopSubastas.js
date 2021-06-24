import React, { useState, useEffect }  from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Card, Image, Icon, Rating } from 'react-native-elements'

export default function ListTopSubastas({ subastas, navigation }) {
    return (
        <FlatList
            data={subastas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(subasta) => (
                <Subasta subasta={subasta} navigation={navigation}/>
            )}
        />
    )
}

function Subasta({ subasta, navigation }) {
    const { name, rating, images, description, id } = subasta.item
    const [iconColor, setIconColor] = useState("#000")

    useEffect(() => {
        if (subasta.index === 0) {
            setIconColor("#efb819")
        } else if (subasta.index === 1) {
            setIconColor("#e3e4e5")
        } else if (subasta.index === 2) {
            setIconColor("#cd7f32")
        }
    }, [])

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("subastas", {
                screen: "subasta",
                params: { id, name }
            })}
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image
                    style={styles.subastaImage}
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator size="large" color="#FFF"/> }
                    source={{ uri: images[0] }}
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        marginBottom: 30,
        borderWidth: 0
    },
    containerIcon: {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1
    },
    subastaImage: {
        width: "100%",
        height: 200
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    },
    titleRating: {
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "space-between"
    }
})