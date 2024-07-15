import { Button, Row, List, Table, Card } from "antd";
import React from "react";
import PaypalButton from "./PaypalButton";
import * as Style from "../../style";
function Payment({
  tranSuccess,
  prev,
  next,
  confirmValues,
  totalPrice,
  location,
  columns,
  data,
  handleOrder,
  orderInfo,
}) {
  const dataList = [
    `Tên khách hàng: ${confirmValues.name}`,
    `Email: ${confirmValues.email}`,
    `Số điện thoại: ${confirmValues.phoneNumber}`,
    `Địa chỉ: ${confirmValues.address} - ${
      location.wards.find((ward) => ward.code === confirmValues.ward).name
    } - ${
      location.districts.find(
        (district) => district.code === confirmValues.district
      ).name
    } - ${
      location.cities.find((city) => city.code === confirmValues.city).name
    }`,
    `Tổng tiền phải thanh toán:
      ${totalPrice.toLocaleString()}₫
      ${
        orderInfo.percent !== 0
          ? `nhập mã giảm ${
              orderInfo.percent * 100
            }% giá còn ${orderInfo.total.toLocaleString()}₫`
          : ""
      }`,
  ];
  return (
    <div>
      <Button onClick={() => prev()}>Quay lại</Button>
      <Card style={{ marginTop: 15 }} title="Thông tin đơn hàng" size="small">
        <Style.CustomTable
          size="small"
          columns={columns}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          scroll={{ x: "max-content" }}
          dataSource={data}
          bordered
        />
        <List
          style={{ marginTop: 10 }}
          bordered
          size="small"
          dataSource={dataList}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          padding: "15px 0 5px",
        }}
      >
        <div>
          <Button
            style={{ height: "100%" }}
            type="primary"
            shape="round"
            onClick={() => handleOrder(confirmValues, "cod")}
          >
            Thanh toán khi nhận hàng
          </Button>
        </div>
        <PaypalButton total={totalPrice} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
}

export default Payment;
