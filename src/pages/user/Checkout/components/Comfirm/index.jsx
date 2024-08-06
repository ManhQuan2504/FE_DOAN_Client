import React from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Form,
  Space,
  Table,
  Select,
} from "antd";
import * as Style from "../../style";

function Confirm({
  confirmValues,
  setConfirmValues,
  userInfo,
  checkoutForm,
  columns,
  data,
  handleChangeCity,
  handleChangeDistrict,
  locationSelect,
  handleChangeWard,
  location,
  totalPrice,
  orderInfo,
  next,
}) {
  const confirm =
    Object.keys(confirmValues).length === 0
      ? {}
      : {
          address: confirmValues.address,
          city: confirmValues.city,
          district: confirmValues.district,
          email: confirmValues.email,
          name: confirmValues.name,
          phoneNumber: confirmValues.phoneNumber,
          ward: confirmValues.ward,
        };
  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "15px 0 30px" }}>
        Thủ tục thanh toán
      </h2>
      <Form
        form={checkoutForm}
        name="basic"
        layout="vertical"
        initialValues={{
          name: userInfo?.data?.data?.customerName,
          email: userInfo?.data?.data?.email,
          ...confirm,
        }}
        onFinish={(values) => {
          setConfirmValues(values);
          next();
        }}
      >
        <Card title="Thông tin đơn hàng" size="small">
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
          <strong style={{ marginTop: 15, display: "inline-block" }}>
            Tổng giá: {totalPrice.toLocaleString() + "₫"}{" "}
            {orderInfo.percent !== 0 &&
              `(nhập mã giảm ${orderInfo.percent * 100}% giá còn ${
                orderInfo.total.toLocaleString() + "₫"
              }`}
          </strong>
        </Card>
        <Card
          title="Thông tin cá nhân"
          size="small"
          style={{ margin: "16px 0" }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Tên khách hàng"
                name="customerName"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Tỉnh-Thành phố"
                name="city"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tỉnh thành phố!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn tỉnh thành phố"
                  onChange={handleChangeCity}
                  allowClear
                >
                  {location.cities.map((city, cityIndex) => {
                    return (
                      <Select.Option key={cityIndex} value={city.code}>
                        {city.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Quận-Huyện"
                name="district"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn quận huyện!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn quận huyện"
                  onChange={handleChangeDistrict}
                  allowClear
                >
                  {location.districts
                    .filter(
                      (district, districtIndex) =>
                        district.parentcode === locationSelect.city
                    )
                    .map((districtItem, districtIndex) => {
                      return (
                        <Select.Option
                          key={districtIndex}
                          value={districtItem.code}
                        >
                          {districtItem.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Phường-Xã"
                name="ward"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phường xã!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn phường xã"
                  onChange={handleChangeWard}
                  allowClear
                >
                  {location.wards
                    .filter(
                      (ward, wardIndex) =>
                        ward.parentcode === locationSelect.district
                    )
                    .map((wardItem, wardIndex) => {
                      return (
                        <Select.Option key={wardIndex} value={wardItem.code}>
                          {wardItem.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24}>
              <Form.Item
                label="Địa chỉ cụ thể"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ cụ thể!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row style={{ marginTop: "15px" }} justify="center">
          <Button htmlType="submit" type="primary">
            Tiếp tục
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default Confirm;
