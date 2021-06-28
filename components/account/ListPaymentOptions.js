import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { getCurrentUser } from "../../utils/actions";

export default function ListPaymentOptions({
  payments,
  navigation,
  handleLoadMore,
}) {
  return (
    <View>
      <FlatList
        data={payments}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        renderItem={(payment) => (
          <Payment payment={payment} navigation={navigation} />
        )}
      />
    </View>
  );
}

function Payment({ payment, navigation }) {
  console.log("hola", payment)
  const { uuid, cvc, name, expiry, postalCode, type, number } = payment.item;
  const currentUser = getCurrentUser().uid

  const goPayment = () => {
    navigation.navigate("payment", { id, name });
  };

  return (
    <TouchableOpacity onPress={goPayment}>
      <View style={styles.viewpayment}>
        <View>
          <Text style={styles.paymentTitle}>{name}</Text>
          <Text style={styles.paymentInformation}>Categoría: {type}</Text>
          <Text style={styles.paymentInformation}>Fecha expiracion: {expiry}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewpayment: {
    flexDirection: "row",
    margin: 10,
  },
  viewpaymentImage: {
    marginRight: 15,
  },
  imagepayment: {
    width: 90,
    height: 90,
  },
  paymentTitle: {
    fontWeight: "bold",
  },
  paymentInformation: {
    paddingTop: 2,
    color: "grey",
  },
});
