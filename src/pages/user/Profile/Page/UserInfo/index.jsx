import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Form,
  Input,
  Select,
  Typography,
  Row,
  Space,
  Modal,
} from "antd";
import history from "../../../../../utils/history";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserProfileAction,
  getUserInfoAction,
} from "../../../../../redux/actions";
import { TITLE } from "../../../../../constants/title";

const { Title } = Typography;
function UserInfo() {
  document.title = TITLE.USER_INFO;

  const { userInfo } = useSelector((state) => state.userReducer);
  const { responseAction } = useSelector((state) => state.userReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (responseAction.edit_user.load) {
      dispatch(getUserInfoAction());
    }
  }, [responseAction.edit_user]);

  useEffect(() => {
    form.resetFields();
  }, [userInfo.data]);

  const handleChangeInfo = (values) => {
    dispatch(
      editUserProfileAction({
        id: userInfo.data.id,
        data: {
          name: values.name,
          gender: values.gender,
          email: values.email,
        },
      })
    );
    setIsModalVisible(false);
  };

  const data = [
    `Tên: ${userInfo?.data?.data?.customerName}`,
    `Email: ${userInfo?.data?.data?.email}`,
    `Giới tính: ${userInfo?.data?.data?.gender === "female" ? "Nữ" : "Nam"}`,
    `Số điện thoại: ${userInfo.data?.data?.phoneNumber}`,
  ];

  return (
    <>
      <h2>Thông tin cá nhân</h2>
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
      <Row style={{ marginTop: 15 }} justify="end">
        <Space>
          <Button type="default" onClick={() => showModal()}>
            Thay đổi thông tin
          </Button>
        </Space>
      </Row>
      <Modal
        title="Thay đổi thông tin cá nhân"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          name="change-info"
          layout="vertical"
          initialValues={
            userInfo.data
              ? {
                  name: userInfo.data.name,
                  email: userInfo.data.email,
                  gender: userInfo.data.gender,
                }
              : {}
          }
          onFinish={(values) => handleChangeInfo(values)}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Bạn chưa nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Bạn chưa nhập email ahihi!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Bạn chưa nhập giới tính!" }]}
          >
            <Select>
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={responseAction.edit_user.load}
          >
            Thay đổi thông tin
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default UserInfo;
