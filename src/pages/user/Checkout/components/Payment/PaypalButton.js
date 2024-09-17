import React from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";

export default class PaypalButton extends React.Component {
  render() {
    const onSuccess = (payment) => {
      this.props.tranSuccess(payment);
    };

    const onCancel = (data) => {
      console.log("The payment was cancelled!", data);
    };

    const onError = (err) => {
      console.log("Error!", err);
    };

    let env = "sandbox"; // you can set here to 'production' for production
    let currency = "USD"; // or you can set this value from your props or state

    // Lấy số tiền bằng VNĐ từ props
    let totalInVND = this.props.total;
    
    // Ví dụ: giả sử tỷ giá USD/VND là 1 USD = 24,000 VNĐ
    const exchangeRate = 24000; // Bạn có thể lấy giá trị này từ API
    
    // Chuyển đổi số tiền từ VNĐ sang USD
    let totalInUSD = (totalInVND / exchangeRate).toFixed(2); // Chuyển đổi và làm tròn tới 2 chữ số sau dấu phẩy

    const client = {
      sandbox:
        "AQsnAjLCTUbPkxT-KV-D-IsUJJXdjqpTCjtoESa7jeQulpzY8sbjPLZ33G_9u5NWTr9wwtNFaYqGPC4A",
      production: "YOUR-PRODUCTION-APP-ID",
    };

    return (
      <PaypalExpressBtn
        env={env}
        client={client}
        shipping={1}
        currency={currency}
        total={totalInUSD} // Số tiền tính bằng USD
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
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
