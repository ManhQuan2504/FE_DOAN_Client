import { useEffect, useState } from "react";
import { Form, Space, notification, Tag, Steps, Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../../components/Loading";

import {
  editProductAction,
  getProductListAction,
  orderProductAction,
} from "../../../redux/actions";
import * as Style from "./style";
import Hero from "../../../components/Hero";
import { COLOR_MENU } from "../../../constants/color";
import axios from "axios";
import Confirm from "./components/Comfirm";
import Payment from "./components/Payment";

const { Step } = Steps;

function CheckoutPage() {
  const [checkoutForm] = Form.useForm();

  const { cartList } = useSelector((state) => state.cartReducer);
  const { productList } = useSelector((state) => state.productReducer);
  const { userInfo } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [location, setLocation] = useState({
    cities: [],
    districts: [],
    wards: [],
  });

  const [locationSelect, setLocationSelect] = useState({
    city: "",
    district: "",
    ward: "",
  });

  const [confirmValues, setConfirmValues] = useState({});

  const dispatch = useDispatch();

  let totalPrice = 0;

  useEffect(() => {
    dispatch(getProductListAction({ loadHome: true }));
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      const wards = await axios.get(
        "https://location-api-0ho5.onrender.com/wards"
      );
      const districts = await axios.get(
        "https://location-api-0ho5.onrender.com/districts"
      );
      const cities = await axios.get(
        "https://location-api-0ho5.onrender.com/cities"
      );
      setLocation({
        wards: wards.data,
        districts: districts.data,
        cities: cities.data,
      });
      setLoading(false);
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (userInfo.data.id) {
      checkoutForm.resetFields();
    }
  }, [userInfo.data.id]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const columns = [
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (value) => (
        <Image
          preview={false}
          src={value}
          width={70}
          height={70}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Size", dataIndex: "size", key: "size" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => value?.toLocaleString() + "₫",
    },
    { title: "Số lượng", dataIndex: "count", key: "count" },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => value?.toLocaleString() + "₫",
    },
  ];

  const data = cartList.data.map((cartItem, cartIndex) => {
    totalPrice = totalPrice + cartItem.price * cartItem.count;
    return {
      key: cartIndex,
      ...cartItem,
      size: cartItem.option.size ? cartItem.option.size : "mặc định",
      totalPrice: cartItem.price * cartItem.count,
      description: (
        <div>
          <Space size={15} wrap align="center">
            <span>
              Hãng giày: <strong>{cartItem.category}</strong>
            </span>
            <span>
              Loại giày: <strong>{cartItem.type}</strong>
            </span>
            <span>
              Sản phẩm: <strong>{cartItem.department}</strong>
            </span>
            <span>
              Màu:{" "}
              <Tag
                color={
                  cartItem.color === "multiColor"
                    ? "#ff514e"
                    : cartItem.color === "ffffff"
                    ? "purple"
                    : `#${cartItem.color}`
                }
              >
                {COLOR_MENU.find((color) => color.code === cartItem.color).name}
              </Tag>
            </span>
          </Space>
        </div>
      ),
    };
  });

  const handleChageCity = (value) => {
    setLocationSelect({
      ...locationSelect,
      city: value,
    });
  };
  const handleChageDistrict = (value) => {
    setLocationSelect({
      ...locationSelect,
      district: value,
    });
  };
  const handleChageWard = (value) => {
    setLocationSelect({
      ...locationSelect,
      ward: value,
    });
  };

  function handleOrder(values, checkoutInfo, paymentID = "") {
    cartList.data?.forEach((cartItem) => {
      let indexProductNew = productList.data?.findIndex(
        (productnew) => productnew.id === cartItem.productId
      );
      if (indexProductNew !== -1) {
        let productItemNew = productList?.data[indexProductNew];
        dispatch(
          editProductAction({
            id: productItemNew.id,
            data: {
              quantity: cartItem.quantity - cartItem.count,
              sold: productItemNew.sold + cartItem.count,
            },
          })
        );
      }
    });

    dispatch(
      orderProductAction({
        id: userInfo.data.id,
        data: {
          userId: userInfo.data.id,
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address:
            values.address +
            " - " +
            location.wards.find((ward) => ward.code === values.ward).name +
            " - " +
            location.districts.find(
              (district) => district.code === values.district
            ).name +
            " - " +
            location.cities.find((city) => city.code === values.city).name,
          products: cartList.data,
          totalPrice:
            cartList.orderInfo.total !== 0
              ? cartList.orderInfo.total
              : totalPrice,
          paymentID: paymentID,
          checkoutInfo: checkoutInfo,
          status: "waiting",
        },
      })
    );
    // next();
    notification.success({
      message: "Đặt hàng thành công",
      description: "Cảm ơn quý khách đã mua hàng.",
    });
  }

  const tranSuccess = async (payment) => {
    const { paymentID } = payment;
    handleOrder(confirmValues, "paypal", paymentID);
  };

  const steps = [
    {
      title: "Đăng nhập",
    },
    {
      title: "Xác minh",
      content: (
        <Confirm
          confirmValues={confirmValues}
          setConfirmValues={setConfirmValues}
          checkoutForm={checkoutForm}
          userInfo={userInfo}
          columns={columns}
          data={data}
          orderInfo={cartList.orderInfo}
          handleChageCity={handleChageCity}
          handleChageDistrict={handleChageDistrict}
          locationSelect={locationSelect}
          totalPrice={totalPrice}
          handleChageWard={handleChageWard}
          location={location}
          next={next}
        />
      ),
    },
    {
      title: "Thanh toán",
      content: (
        <Payment
          tranSuccess={tranSuccess}
          prev={prev}
          next={next}
          columns={columns}
          data={data}
          confirmValues={confirmValues}
          orderInfo={cartList.orderInfo}
          totalPrice={totalPrice}
          location={location}
          handleOrder={handleOrder}
        />
      ),
    },
    {
      title: "Hoàn thành",
    },
  ];

  return (
    <>
      {loading ? (
        <Loading load={loading} />
      ) : (
        <Style.OrderPage>
          <Hero title="Thanh toán" />
          <Style.OrderContainer>
            <Style.Title>
              <Steps responsive current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </Style.Title>
            <Style.Content>{steps[current].content}</Style.Content>
          </Style.OrderContainer>
        </Style.OrderPage>
      )}
    </>
  );
}

export default CheckoutPage;
