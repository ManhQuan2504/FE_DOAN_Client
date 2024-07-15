import React from "react";
import { Space, Table, Image, Typography, Badge, Empty } from "antd";
import { useSelector } from "react-redux";

import * as Style from "./style";
import { TITLE } from "../../../../../constants/title";

const { Title } = Typography;

function HistoryOrder() {
  document.title = TITLE.HISTORY_ORDER;
  const { orderList } = useSelector((state) => state.orderReducer);

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
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
      render: (value) => `${value.toLocaleString()}đ`,
    },
    {
      title: "Thanh toán",
      dataIndex: "checkoutInfo",
      key: "checkoutInfo",
      render: (value) =>
        value === "paypal" ? "Đã thanh toán (paypal)" : value.toUpperCase(),
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

  const data = orderList.data?.map((orderItem, orderIndex) => {
    return {
      key: orderIndex,
      ...orderItem,
      description: orderItem.products.map((product, productIndex) => (
        <div key={productIndex}>
          <Space size={15} wrap align="center">
            <Image
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
              preview={false}
              src={product.image}
            />
            <span>Tên sản phẩm: {product.name}</span>
            {product.option.size && <span>Size: {product.option.size}</span>}
            <span>Số lượng: {product.count}</span>
          </Space>
        </div>
      )),
    };
  });

  return (
    <Style.HistoryOrder>
      <h2>Lịch sử mua hàng</h2>
      {orderList.data?.length > 0 ? (
        <Style.CustomTable
          bordered
          size="small"
          columns={columns}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
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
