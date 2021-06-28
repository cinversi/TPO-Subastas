import React, { Component } from "react";
import { StyleSheet, View, Switch } from "react-native";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { addNewPaymentMethod, getCurrentUser } from "../../utils/actions";
import { Button } from "react-native-elements";

export default class AddPaymentForm extends Component {
  state = { formValues: {}, isLoading: false };

  addPayment = () => {
    const {formValues} = this.state;
    const currentUser = getCurrentUser().uid;
    this.setState({ isLoading: true });
    console.log("sfsdfsdfsdf")
    console.log(formValues)
    addNewPaymentMethod(
      currentUser,
      formValues.values.number,
      formValues.values.expiry,
      formValues.values.cvc,
      formValues.values.name,
      formValues.values.postalCode,
      formValues.values.type
    ).then(response => {
      this.setState({ isLoading: false })
      this.props.navigation.goBack();
    }).catch(error => console.log(error))
  };

  _onChange = (formData) => {
    //console.log(JSON.stringify(formData, null, " "))
    this.setState({ formValues: { ...formData } });
  };
  _onFocus = (field) => console.log("focusing", field);

  //_setUseLiteCreditCardInput = (useLiteCreditCardInput) => this.setState({ useLiteCreditCardInput });

  render() {
    return (
      <View style={s.container}>
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          requiresPostalCode
          labelStyle={s.label}
          inputStyle={s.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          onFocus={this._onFocus}
          onChange={this._onChange}
        />
        {this.state.isLoading ? null : (
          <Button
            title="Agregar Medio de Pago"
            onPress={this.addPayment}
            buttonStyle={s.btnAddPayment}
          />
        )}
      </View>
    );
  }
}

const s = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  btnAddPayment: {
    marginTop: 100,
    backgroundColor: "#442484",
    margin: 20,
  },
});
