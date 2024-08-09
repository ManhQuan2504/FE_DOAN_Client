import React from "react";
import { Space, Table, Image, Typography, Badge, Empty } from "antd";
import { useSelector } from "react-redux";

import * as Style from "./style";
import { TITLE } from "../../../../../constants/title";

const { Title } = Typography;

function HistoryOrder() {
  document.title = TITLE.HISTORY_ORDER;
  const { orderList } = useSelector((state) => state.orderReducer);
  console.log("🚀 ~ HistoryOrder ~ orderList:", orderList);

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
      title: "Thanh toán",
      dataIndex: "checkoutInfo",
      key: "checkoutInfo",
      render: (value) => {
        const displayValue = value || 'Chưa xác định'; // Cung cấp giá trị mặc định nếu value là undefined
        return displayValue === "paypal" ? "Đã thanh toán (paypal)" : displayValue.toUpperCase();
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return value === "waiting" ? (
          <Badge status="processing" text={"Đang chờ"} />
        ) : value === "confirm" ? (
          <Badge color={"purple"} text={"Xác nhận"} />
        ) : value === "shipping" ? (
          <Badge status="warning" text={"Đang chuyển hàng"} />
        ) : (
          <Badge status="success" text={"Đã giao"} />
        );
      },
    },
  ];

  // Chỉnh sửa để phù hợp với cấu trúc dữ liệu
  const data = orderList?.data?.length
    ? orderList.data.map((orderItem, orderIndex) => {
        console.log("🚀 ~ orderItem:", orderItem);
        return {
          key: orderIndex,
          customerName: orderItem.customer.customerName, // Lấy tên khách hàng
          address: orderItem.shipTo, // Lấy địa chỉ khách hàng
          phoneNumber: orderItem.customer.phoneNumber, // Lấy số điện thoại khách hàng
          totalPrice: orderItem.productList.reduce((acc, item) => acc + (item.price * item.count), 0), // Tính tổng tiền
          checkoutInfo: orderItem.checkoutInfo || 'Chưa xác định',
          status: orderItem.status || 'waiting', // Đảm bảo có giá trị mặc định cho trạng thái
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
                <span>Số lượng: {product.count}</span>
              </Space>
            </div>
          )),
        };
      })
    : [];

  console.log("🚀 ~ HistoryOrder ~ data:", data);

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
