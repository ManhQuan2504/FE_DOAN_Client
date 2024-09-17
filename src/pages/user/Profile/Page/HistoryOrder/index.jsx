import React from "react";
import { Space, Table, Image, Typography, Badge, Empty } from "antd";
import { useSelector } from "react-redux";

import * as Style from "./style";
import { TITLE } from "../../../../../constants/title";
import moment from "moment";

const { Title } = Typography;

function HistoryOrder() {
  document.title = TITLE.HISTORY_ORDER;
  const { orderList } = useSelector((state) => state.orderReducer);
  console.log("🚀 ~ HistoryOrder ~ orderList:", orderList)

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 250,
      ellipsis: true,
    },
    { title: "SĐT", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => {
        const formattedValue = typeof value === 'number' ? value.toLocaleString() : 'N/A';
        return `${formattedValue}đ`;
      },
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text) => moment(text).format('DD-MM-YYYY HH:mm'),
    },
    {
      title: "Thanh toán",
      dataIndex: "checkoutInfo",
      key: "checkoutInfo",
      render: (value) => {
        const displayValue = value || 'Chưa xác định'; // Cung cấp giá trị mặc định nếu value là undefined
        if (displayValue === "paypal") {
          return "Đã thanh toán (paypal)";
        } else if (displayValue === "cod") {
          return "Thanh toán khi nhận hàng";
        } else {
          return displayValue.toUpperCase();
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return value === "Chờ phê duyệt" ? (
          <Badge status="processing" text={"Chờ phê duyệt"} />
        ) : value === "Chờ giao hàng" ? (
          <Badge color={"purple"} text={"Chờ giao hàng"} />
        ) : value === "Đã từ chối" ? (
          <Badge status="warning" text={"Đã từ chối"} />
        ) : (
          <Badge status="success" text={"Đã giao"} />
        );
      },
    },
  ];

  // Chỉnh sửa để phù hợp với cấu trúc dữ liệu
  const data = orderList?.data?.length
    ? orderList.data.map((orderItem, orderIndex) => {
      return {
        key: orderIndex,
        customerName: orderItem.customer.customerName, // Lấy tên khách hàng
        address: orderItem.shipTo, // Lấy địa chỉ khách hàng
        phoneNumber: orderItem.customer.phoneNumber, // Lấy số điện thoại khách hàng
        totalPrice: orderItem.productList.reduce((acc, item) => acc + ((item.price + (item.price * item.tax.taxValue) / 100) * item.count), 0), // Tính tổng tiền
        checkoutInfo: orderItem.paymentMethod || 'Chưa xác định',
        status: orderItem.orderState || 'waiting', // Đảm bảo có giá trị mặc định cho trạng thái
        description: orderItem.productList.map((product, productIndex) => (
          <div key={productIndex}>
            <Space size={15} wrap align="center">
              <Image
                width={50}
                height={50}
                style={{ objectFit: "cover" }}
                preview={false}
                src={product.image?.absoluteUrl}
              />
              <span>Tên sản phẩm: {product.productName}</span>
              {product.option?.size && <span>Size: {product.option.size}</span>}
              <span>Số lượng: {product.count}</span>|
              <span>Đơn giá: {(product.price).toLocaleString()}đ</span>|
              <span>
                Đơn giá(sau VAT): {(product.price + (product.price * product.tax.taxValue) / 100).toLocaleString()} ₫
              </span>

            </Space>
          </div>
        )),
      };
    })
    : [];

  return (
    <Style.HistoryOrder>
      <h2>Lịch sử mua hàng</h2>
      {orderList?.data?.length > 0 ? (
        <Style.CustomTable
          bordered
          size="small"
          columns={columns}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <div>{record.description}</div> // Đảm bảo description là HTML hợp lệ
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          scroll={{ x: "1200px" }}
          dataSource={data}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Style.HistoryOrder>
  );
}

export default HistoryOrder;
