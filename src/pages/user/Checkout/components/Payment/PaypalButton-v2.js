import { notification } from "antd";
import React from "react";
import { PayPalButton } from "react-paypal-button-v2";

class PaypalButton extends React.Component {
  createOrder = (data, actions) => {
    const { paypalCreatOrder, confirmValues } = this.props;
    paypalCreatOrder(confirmValues, "paypal")
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: this.props.total.toString(),
        },
      }],
    });
  };

  onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      notification.success({
        message: "Thanh toán thành công",
        description: "Transaction completed by " + details.payer.name.given_name,
      });
      // alert("Transaction completed by " + details.payer.name.given_name);
      console.log("Transaction details:", details);
      // return fetch("/paypal-transaction-complete", {
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     orderID: data.orderID,
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     this.props.tranSuccess(data);
      //   });
      window.location.href = "/";
      localStorage.setItem('paymentSuccess', JSON.stringify({
        message: "Thanh toán thành công",
        description: "Transaction completed by " + details.payer.name.given_name,
      }));
    });
  };

  onCancel = (data) => {
    console.log("The payment was cancelled!", data);
  };

  onError = (err) => {
    console.log("Error!", err);
  };

  render() {
    const client = {
      sandbox: "AQsnAjLCTUbPkxT-KV-D-IsUJJXdjqpTCjtoESa7jeQulpzY8sbjPLZ33G_9u5NWTr9wwtNFaYqGPC4A",
      production: "YOUR-PRODUCTION-APP-ID",
    };

    const env = "sandbox"; // or 'production'
    const currency = "USD";
    const total = this.props.total;
    const paypalCreatOrder = this.props.paypalCreatOrder;
    const confirmValues = this.props.confirmValues;
    return (
      <PayPalButton
        createOrder={this.createOrder}
        onApprove={this.onApprove}
        onError={this.onError}
        onCancel={this.onCancel}
        options={{
          clientId: client[env],
          currency: currency,
        }}
        style={{
          size: "small",
          color: "blue",
          shape: "pill",
          label: "checkout",
          tagline: false,
        }}
      />
    );
  }
}

export default PaypalButton;