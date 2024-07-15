import React, { useState } from "react";
import * as Style from "./style";
import {
  Button,
  Col,
  Image,
  Row,
  Tabs,
  Tooltip,
  Radio,
  Comment,
  List,
  Avatar,
  Rate,
  Space,
  InputNumber,
  Descriptions,
  notification,
  Form,
  Input,
} from "antd";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlistAction,
  addToCartAction,
  deleteWishlistItemAction,
  addCommentProductAction,
} from "../../../../../redux/actions";

import * as Icons from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import history from "../../../../../utils/history";
import "moment/locale/vi";

const { TabPane } = Tabs;
const { TextArea } = Input;

function ProductInfo({
  userInfo,
  productDetail,
  setOptionSelected,
  optionSelected,
  commentList,
  productID,
}) {
  const { wishList } = useSelector((state) => state.wishlistReducer);
  const { cartList } = useSelector((state) => state.cartReducer);

  console.log(cartList.data);
  const [swiper, setSwiper] = useState(null);
  const [productCount, setProductCount] = useState(1);
  const [viewMore, setViewMore] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);

  const [formComment] = Form.useForm();

  moment.locale("vi");

  const dispatch = useDispatch();

  const slideTo = (index) => {
    if (swiper) swiper.slideTo(index);
  };

  function handleAddToWishlist() {
    if (!userInfo.data.name) {
      const key = `open${Date.now()}`;
      return notification.warning({
        message: "Chưa đăng nhập",
        description: "Bạn cần đăng nhập để thêm yêu thích",
        key,
        btn: (
          <Button
            type="primary"
            onClick={() => {
              notification.close(key);
              history.push("/login");
            }}
          >
            Đăng nhập
          </Button>
        ),
      });
    }
    const existProductIndex = wishList.data?.findIndex(
      (item) => item.productId === productID
    );
    if (existProductIndex !== -1) {
      // Xoá yêu thích
      const newWishlistData = [...wishList.data];
      newWishlistData.splice(existProductIndex, 1);
      dispatch(
        deleteWishlistItemAction({
          userId: userInfo.data.id,
          data: { wishlist: newWishlistData },
        })
      );
      // notification.success({
      //   message: "Sản phẩm đã được thêm!",
      // });
    } else {
      dispatch(
        addToWishlistAction({
          userId: userInfo.data.id,
          data: [
            ...wishList.data,
            {
              productId: productID,
              name: productDetail.data.name,
              price: productDetail.data.price,
              color: productDetail.data.color,
              image: productDetail.data.images[0],
              category: productDetail.data.category.name,
              type: productDetail.data.type.name,
              department: productDetail.data.department.description,
            },
          ],
        })
      );
    }
  }

  /// Dùng với kiểu cần đăng nhập để bỏ vào giỏ hàng
  function handleAddToCart() {
    if (!userInfo.data.name) {
      const key = `open${Date.now()}`;
      return notification.warning({
        message: "Chưa đăng nhập",
        description: "Bạn cần đăng nhập để thêm vào giỏ hàng",
        key,
        btn: (
          <Button
            type="primary"
            onClick={() => {
              notification.close(key);
              history.push("/login");
            }}
          >
            Đăng nhập
          </Button>
        ),
      });
    }
    if (optionSelected.id) {
      const existOptionIndex = cartList.data?.findIndex(
        (item) => item.option.id === optionSelected.id
      );
      if (existOptionIndex !== -1) {
        const newCartList = [...cartList.data];
        newCartList?.splice(existOptionIndex, 1, {
          productId: parseInt(productID),
          count:
            cartList.data[existOptionIndex].count + productCount >=
              productDetail.data.quantity
              ? productDetail.data.quantity
              : cartList.data[existOptionIndex].count + productCount,
          name: productDetail.data.name,
          price: productDetail.data.price,
          color: productDetail.data.color,
          image: productDetail.data.images[0],
          quantity: productDetail.data.quantity,
          category: productDetail.data.category.name,
          type: productDetail.data.type.name,
          department: productDetail.data.department.description,
          option: {
            id: optionSelected.id,
            size: optionSelected.size,
            price: optionSelected.price,
          },
        });
        dispatch(
          addToCartAction({
            userId: userInfo.data.id,
            carts: newCartList,
          })
        );
      } else {
        dispatch(
          addToCartAction({
            userId: userInfo.data.id,
            carts: [
              ...cartList.data,
              {
                productId: parseInt(productID),
                count: productCount,
                name: productDetail.data.name,
                price: productDetail.data.price,
                color: productDetail.data.color,
                image: productDetail.data.images[0],
                category: productDetail.data.category.name,
                quantity: productDetail.data.quantity,
                type: productDetail.data.type.name,
                department: productDetail.data.department.description,
                option: {
                  id: optionSelected.id,
                  size: optionSelected.size,
                  price: optionSelected.price,
                },
              },
            ],
          })
        );
      }
    } else {
      const existProductIndex = cartList.data?.findIndex(
        (item) => item.productId === parseInt(productID)
      );
      if (existProductIndex !== -1) {
        const newCart = [...cartList.data];
        newCart?.splice(existProductIndex, 1, {
          productId: parseInt(productID),
          count:
            cartList.data[existProductIndex].count + productCount >=
              productDetail.data.quantity
              ? productDetail.data.quantity
              : cartList.data[existProductIndex].count + productCount,
          name: productDetail.data.name,
          price: productDetail.data.price,
          color: productDetail.data.color,
          image: productDetail.data.images[0],
          quantity: productDetail.data.quantity,
          category: productDetail.data.category.name,
          type: productDetail.data.type.name,
          department: productDetail.data.department.description,
          option: {},
        });
        dispatch(
          addToCartAction({
            userId: userInfo.data.id,
            carts: newCart,
          })
        );
      } else {
        dispatch(
          addToCartAction({
            userId: userInfo.data.id,
            carts: [
              ...cartList.data,
              {
                productId: parseInt(productID),
                count: productCount,
                name: productDetail.data.name,
                price: productDetail.data.price,
                color: productDetail.data.color,
                image: productDetail.data.images[0],
                quantity: productDetail.data.quantity,
                category: productDetail.data.category.name,
                type: productDetail.data.type.name,
                department: productDetail.data.department.description,
                option: {},
              },
            ],
          })
        );
      }
    }
    setProductCount(1);
  }

  const DataList = [
    {
      icon: <Icons.FireTwoTone twoToneColor="#eb2f96" />,
      text: "Miễn phí vận chuyển trong 5km",
    },
    {
      icon: <Icons.RocketTwoTone twoToneColor="#eb2f96" />,
      text: "Trả hàng dễ dàng trong vòng 2 giờ",
    },
    {
      icon: <Icons.TagTwoTone twoToneColor="#eb2f96" />,
      text: "Đặt hàng vào trước buổi trưa để giao trong ngày",
    },
  ];

  function renderCommentList() {
    return commentList.data?.map((commentItem, commentIndex) => {
      const comment = {
        author: commentItem?.user?.name,
        avatar: commentItem?.user?.avatar,
        content: (
          <>
            <div style={{ marginBottom: 5 }}>
              <Rate
                style={{ fontSize: 10 }}
                disabled
                allowHalf
                value={commentItem.rating}
              />
            </div>
            <p>{commentItem.content}</p>
          </>
        ),
        datetime: (
          <Tooltip
            title={moment(commentItem.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          >
            <span>{moment(commentItem.createdAt).fromNow()}</span>
          </Tooltip>
        ),
      };
      return (
        <li key={`${commentItem.id}-${commentIndex}`}>
          <Comment
            author={comment.author}
            avatar={comment.avatar}
            content={comment.content}
            datetime={comment.datetime}
          />
        </li>
      );
    });
  }

  const EditorComment = () => (
    <Form
      form={formComment}
      layout="vertical"
      onFinish={(values) => handleAddComment(values)}
    >
      <Form.Item
        name="rating"
        label="Đánh giá"
        rules={[
          {
            required: true,
            message: "Phải có đánh giá",
          },
        ]}
      >
        <Rate allowHalf />
      </Form.Item>
      <Form.Item
        name="content"
        label="Nội dung"
        rules={[
          {
            required: true,
            message: "Phải có nội dung đánh giá",
          },
        ]}
      >
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Thêm đánh giá
        </Button>
      </Form.Item>
    </Form>
  );

  function renderProductOptions() {
    return productDetail.data.productOptions?.map((optionItem, optionIndex) => {
      return (
        <Radio.Button key={`${optionItem}-${optionIndex}`} value={optionItem}>
          {optionItem.size}
        </Radio.Button>
      );
    });
  }

  function handleAddComment(values) {
    dispatch(
      addCommentProductAction({
        idProduct: parseInt(productID),
        idUser: userInfo.data.id,
        data: {
          ...values,
          userId: userInfo.data.id,
          productId: parseInt(productID),
        },
      })
    );
    formComment.resetFields();
  }
  console.log("🚀 ~ cartList:", cartList)

  let maxCount = cartList.data.find(
    (cartitem) => cartitem.productId === parseInt(productID)
  )
    ? productDetail.data.quantity -
    cartList.data.find(
      (cartitem) => cartitem.productId === parseInt(productID)
    ).count
    : productDetail.data.quantity;
  return (
    <Style.ProductInfo>
      <Style.MainInfo>
        <Row gutter={[15, 30]}>
          <Col xl={{ span: 12 }} lg={{ span: 12 }} sm={{ span: 24 }}>
            <div className="image-group">
              <Image.PreviewGroup>
                <Swiper onSwiper={setSwiper}>
                  {productDetail.data?.images?.map((image) => {
                    return (
                      <SwiperSlide className="slide-item">
                        <Image
                          className="slide-image"
                          src={image}
                          placeholder={<div className="bg-animate" />}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Image.PreviewGroup>
              <Swiper
                style={{ marginTop: 10 }}
                spaceBetween={10}
                slidesPerView={4}
                className="mySwiper"
              >
                {productDetail.data?.images?.map((image, index) => {
                  return (
                    <SwiperSlide key={index - image}>
                      <Image
                        onClick={() => slideTo(index)}
                        preview={false}
                        src={image}
                        placeholder={<div className="bg-animate" />}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </Col>
          <Col xl={{ span: 12 }} lg={{ span: 12 }} sm={{ span: 24 }}>
            <div className="product-content">
              <h3>{` ${productDetail.data.name}`}</h3>
              <div className="product-rate">
                <Rate
                  className="rate"
                  disabled
                  allowHalf
                  value={commentList.rate}
                />
                <span className="number-rate">
                  {commentList.data?.length} Khách hàng đánh giá
                </span>
              </div>
              <div className="product-price">
                <strong>
                  {optionSelected.price?.toLocaleString() ||
                    productDetail.data.price?.toLocaleString() ||
                    0}
                  ₫
                </strong>
              </div>
              <div className="product-info-list">
                <div className="product-brand-item">
                  <span className="product-info-tag">Thương hiệu:</span>
                  <span className="product-info-text">
                    <Space align="center">
                      <img
                        src={productDetail.data.category?.logo}
                        height="30px"
                        alt=""
                      />
                      <span>{` ${productDetail.data.category?.name}`}</span>
                    </Space>
                  </span>
                </div>
                <div className="product-type-item">
                  <span className="product-info-tag">Loại giày:</span>
                  <span className="product-info-text">{` ${productDetail.data.type?.name}`}</span>
                </div>
              </div>
              <div className="product-info-list">
                <div className="product-type-item">
                  <span className="product-info-tag">Sản phẩm dành cho:</span>
                  <span className="product-info-text">{` ${productDetail.data.department?.name}`}</span>
                </div>
                <div className="product-type-item">
                  <span className="product-info-tag">Số lượng sản phẩm:</span>
                  <span className="product-info-text">
                    {productDetail.data.quantity === 0
                      ? "đã hết"
                      : ` ${productDetail.data.quantity}`}
                  </span>
                </div>
              </div>
              <div className="product-color">
                <span className="product-info-tag">Màu sắc:</span>
                <Style.Color color={productDetail.data.color} />
              </div>
              {productDetail.data.productOptions?.length > 0 && (
                <div className="product-option">
                  <strong className="tag">Size</strong>
                  <Radio.Group
                    onChange={(e) => setOptionSelected(e.target.value)}
                    value={optionSelected}
                  >
                    {renderProductOptions()}
                  </Radio.Group>
                </div>
              )}
              <div className="product-action">
                {productDetail.data?.quantity === 0 ? (
                  <Button disabled>Hết hàng</Button>
                ) : (
                  <Space wrap>
                    <InputNumber
                      size="large"
                      disabled={maxCount === 0 ? true : false}
                      min={1}
                      max={maxCount}
                      onChange={(value) => setProductCount(value)}
                      value={productCount}
                    />
                    <Button
                      size="large"
                      disabled={maxCount === 0 ? true : false}
                      type="primary"
                      icon={<Icons.ShoppingCartOutlined />}
                      onClick={() => handleAddToCart()}
                    >
                      Thêm vào giỏ
                    </Button>
                  </Space>
                )}
                <Button
                  size="large"
                  type="default"
                  danger
                  onClick={() => handleAddToWishlist()}
                  icon={
                    wishList.data?.findIndex(
                      (item) => item.productId === productID
                    ) !== -1 ? (
                      <Icons.HeartFilled />
                    ) : (
                      <Icons.HeartOutlined />
                    )
                  }
                >
                  {wishList.data?.findIndex(
                    (item) => item.productId === productID
                  ) !== -1
                    ? "Đã yêu thích"
                    : "Thêm yêu thích"}
                </Button>
              </div>

              <List
                bordered
                header={<strong>Chính sách</strong>}
                dataSource={DataList}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      {item.icon}
                      {item.text}
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </Style.MainInfo>
      <Row gutter={[15, 30]}>
        <Col
          lg={{ span: 15, order: 1 }}
          xs={{ order: 2 }}
          style={{ width: "100%" }}
        >
          <Style.TabCard>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane
                tab={
                  <span>
                    <Icons.FileSearchOutlined />
                    Giới thiệu
                  </span>
                }
                key="1"
              >
                <div className={viewMore ? "list-info active" : "list-info"}>
                  <p>Chào mừng đến với cửa hàng của chúng tôi:<br />

                    🍀 Nếu quan tâm đến giá sỉ, bạn có thể chat riêng với chúng tôi.<br />

                    🍀 Khi bạn nhận được sản phẩm, vui lòng nhấn chấp nhận.<br />

                    🍀Đánh giá 5 sao rất khuyến khích cho cửa hàng của chúng tôi.<br />

                    🍀 Nếu khách hàng không hài lòng với hệ thống giao hàng. Vui lòng tách dịch vụ khỏi các cửa hàng và công ty vận tải. bởi vì cửa hàng không thể thực sự kiểm soát việc vận chuyển<br />

                    🍀 Nếu sản phẩm có vấn đề hoặc đang được vận chuyển. Xin vui lòng liên hệ với cửa hàng của chúng tôi để được trợ giúp và sửa chữa.<br />

                    🍀 Sản phẩm của chúng tôi có chất lượng cao và giá rẻ. Vì vậy, bạn không phải lo lắng rằng sản phẩm sẽ không khớp với sản phẩm thật. Các sản phẩm có chất lượng cao và chắc chắn rẻ. "<br />
                  </p>
                  {/* <div className="tab-list-image">
                    {productDetail.data?.images?.map((image, index) => {
                      return (
                        <Image
                          onClick={() => slideTo(index)}
                          preview={false}
                          src={image}
                          placeholder={<div className="bg-animate" />}
                        />
                      );
                    })}
                  </div>
                  <Button
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      zIndex: 2,
                      transform: "translateX(-50%)",
                    }}
                    onClick={() => setViewMore(!viewMore)}
                  >
                    {viewMore ? "View Less" : "View More"}
                  </Button> */}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icons.LikeOutlined />
                    Đánh giá sản phẩm
                  </span>
                }
                key="2"
              >
                {userInfo.data?.name && (
                  <Comment
                    avatar={
                      <Avatar
                        src={userInfo.data?.avatar}
                        alt={userInfo.data?.name}
                      />
                    }
                    content={<EditorComment />}
                  />
                )}
                <List
                  className="comment-list"
                  header={`${commentList.data?.length} đánh giá`}
                  itemLayout="horizontal"
                >
                  {renderCommentList()}
                </List>
              </TabPane>
            </Tabs>
          </Style.TabCard>
        </Col>
        <Col
          lg={{ span: 9, order: 2 }}
          xs={{ order: 1 }}
          style={{ width: "100%" }}
        >
          <Style.DescriptionsCard>
            <Descriptions
              title={<span>Thông tin sản phẩm</span>}
              layout="horizontal"
              bordered
            >
              <Descriptions.Item label="Sản phẩm" span={3}>
                {productDetail.data?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu" span={3}>
                {productDetail.data.category?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Loại giày" span={3}>
                {productDetail.data.type?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Giày" span={3}>
                {productDetail.data.department?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Màu sắc" span={3}>
                <Style.Color color={productDetail.data.color} />
              </Descriptions.Item>
              <Descriptions.Item label="Giá" span={3}>
                {productDetail.data.price?.toLocaleString()} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={3}>
                {productDetail.data.description}
              </Descriptions.Item>
            </Descriptions>
          </Style.DescriptionsCard>
        </Col>
      </Row>
    </Style.ProductInfo>
  );
}

export default ProductInfo;
