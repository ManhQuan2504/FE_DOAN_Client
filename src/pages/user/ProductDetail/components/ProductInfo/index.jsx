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
  Modal,
  Table,
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
// notification.config({
//   placement: 'topRight', // Thay đổi giá trị này theo nhu cầu: 'bottomLeft', 'bottomRight', 'topLeft', 'topRight'
//   top: 60, // Khoảng cách từ dưới lên (px)
//   duration: 3, //Thời gian
// });

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

  const [swiper, setSwiper] = useState(null);
  const [productCount, setProductCount] = useState(1);
  const [viewMore, setViewMore] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for Modal

  const [formComment] = Form.useForm();

  moment.locale("vi");

  const dispatch = useDispatch();

  const slideTo = (index) => {
    if (swiper) swiper.slideTo(index);
  };

  function handleAddToWishlist() {
    if (!userInfo?.data?.data?.customerName) {
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
    const existProductIndex = wishList.data?.some(
      (item) => item.productId === productID
    );
    if (existProductIndex) {
      // Xoá yêu thích
      const newWishlistData = wishList.data.filter(w => w.productId !== productID);
      dispatch(
        deleteWishlistItemAction({
          userId: userInfo?.data?.data?._id,
          wishList: newWishlistData,
        })
      );
      // notification.success({
      //   message: "Sản phẩm đã được thêm!",
      // });
    } else {
      dispatch(
        addToWishlistAction({
          userId: userInfo?.data?.data?._id,
          wishList: [
            ...wishList.data,
            {
              productId: productDetail?.data?._id,
              productCode: productDetail?.data?.productCode,
              productName: productDetail?.data?.productName,
              count: productCount,
              price: productDetail?.data?.price,
              color: productDetail?.data?.color,
              image: productDetail?.data?.images[0],
              quantity: productDetail?.data?.qty,
              category: productDetail?.data?.category,
              brand: productDetail?.data?.brand,
              type: productDetail?.data?.type?.name,
              description: productDetail?.data?.description,
              specifications: productDetail?.data?.specifications,
              tax: productDetail?.data?.tax,
              warranty: productDetail?.data?.warranty,
              uom: productDetail?.data?.uom,
              option: {},
            },
          ],
        })
      );
    }
  }

  /// Dùng với kiểu cần đăng nhập để bỏ vào giỏ hàng
  function handleAddToCart() {
    if (!userInfo?.data?.data?.customerName) {
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
    const existProductIndex = cartList.data?.filter(i => {
      return i.productId === productID
    });

    if (existProductIndex && existProductIndex.length > 0) {
      return notification.info({
        message: "Sản phẩm đã có trong giỏ hàng",
        description: "Sản phẩm này đã có trong giỏ hàng của bạn.",
      });
    }

    dispatch(
      addToCartAction({
        userId: userInfo?.data?.data?._id,
        carts: [
          ...cartList.data,
          {
            productId: productDetail?.data?._id,
            productCode: productDetail?.data?.productCode,
            productName: productDetail?.data?.productName,
            count: productCount,
            price: productDetail?.data?.price,
            color: productDetail?.data?.color,
            image: productDetail?.data?.images[0],
            quantity: productDetail?.data?.qty,
            category: productDetail?.data?.category,
            brand: productDetail?.data?.brand,
            type: productDetail?.data?.type?.name,
            description: productDetail?.data?.description,
            specifications: productDetail?.data?.specifications,
            tax: productDetail?.data?.tax,
            warranty: productDetail?.data?.warranty,
            uom: productDetail?.data?.uom,
            option: {},
          },
        ],
      })
    );

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

  function handleModalOk() {
    setIsModalVisible(false);
  }

  function handleModalCancel() {
    setIsModalVisible(false);
  }

  function showWarrantyDetails() {
    setIsModalVisible(true);
  }

  const columns = [
    {
      title: 'NỘI DUNG CHÍNH SÁCH',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
    },
    {
      title: 'ĐIỀU KIỆN ÁP DỤNG',
      dataIndex: 'content',
      key: 'content',
      render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
    },
  ];

  const data = [
    {
      key: '1',
      title: `1) BẢO HÀNH CÓ CAM KẾT TRONG 12 THÁNG

- RIÊNG Phụ kiện có điện AVA bảo hành 3 tháng. Đồng hồ thời trang chỉ bảo hành bộ máy, không bảo hành dây, vỏ, mặt kính.

- Chỉ áp dụng cho sản phẩm chính, KHÔNG áp dụng cho phụ kiện đi kèm sản phẩm chính.

+ Bảo hành trong vòng 15 ngày (tính từ ngày LanChiShop nhận máy ở trạng thái lỗi và đến ngày gọi khách hàng ra lấy lại máy đã bảo hành).

+ Sản phẩm không bảo hành lại lần 2 trong 30 ngày kể từ ngày máy được bảo hành xong.

+ Nếu LanChiShop vi phạm cam kết (bảo hành quá 15 ngày hoặc phải bảo hành lại sản phẩm lần nữa trong 30 ngày kể từ lần bảo hành trước), Khách hàng được áp dụng phương thức Hư gì đổi nấy ngay và luôn hoặc Hoàn tiền với mức phí giảm 50%.

*Từ tháng thứ 13 trở đi không áp dụng bảo hành cam kết, chỉ áp dụng bảo hành hãng (nếu có).`,
      content: `- Sản phẩm đủ điều kiện bảo hành của hãng.`,
    },
    {
      key: '2',
      title: `2) HƯ GÌ ĐỔI NẤY NGAY VÀ LUÔN (KHÔNG áp dụng cho Đồng hồ (ngoại trừ 3 hãng ELIO, SKMEI, SMILE KID), phụ kiện có điện)

Sản phẩm hư gì thì đổi đó (cùng model, cùng dung lượng, cùng màu sắc...) đối với sản phẩm chính và đổi tương đương đối với phụ kiện đi kèm, cụ thể:

2.1) Hư sản phẩm chính thì đổi sản phẩm chính mới

- Tháng đầu tiên kể từ ngày mua: miễn phí.

- Tháng thứ 2 đến tháng thứ 12: phí 10% giá trị hóa đơn/tháng.

(VD: tháng thứ 2 phí 10%, tháng thứ 3 phí 20%...).


Lưu ý: Nếu không có sản phẩm chính đổi cho Khách hàng thì áp dụng chính sách Bảo hành có cam kết hoặc Hoàn tiền với mức phí giảm 50%.

2.2) Hư phụ kiện đi kèm thì đổi phụ kiện có cùng công năng mà LanChiShop đang kinh doanh:

Phụ kiện đi kèm được đổi miễn phí trong vòng 12 tháng kể từ ngày mua sản phẩm chính bằng hàng phụ kiện LanChiShop đang kinh doanh mới với chất lượng tương đương.

Lưu ý: Nếu không có phụ kiện tương đương hoặc Khách hàng không thích thì áp dụng bảo hành hãng.

2.3) Lỗi phần mềm không áp dụng, mà chỉ khắc phục lỗi phần mềm.

2.4) Trường hợp Khách hàng muốn đổi full box (nguyên thùng, nguyên hộp): ngoài việc áp dụng mức phí đổi trả tại Mục 2.1 thì Khách hàng sẽ trả thêm phí lấy full box tương đương 20% giá trị hóa đơn.`,
      content: `- Sản phẩm đổi trả phải giữ nguyên 100% hình dạng ban đầu và đủ điều kiện bảo hành của hãng.

- Sản phẩm chỉ dùng cho mục đích sử dụng cá nhân, không áp dụng việc sử dụng sản phẩm cho mục đích thương mại.`,
    },
    {
      key: '3',
      title: `3) HOÀN TIỀN: Áp dụng cho sản phẩm lỗi và không lỗi.

- Tháng đầu tiên kể từ ngày mua: phí 20% giá trị hóa đơn.

- Tháng thứ 2 đến tháng thứ 12: phí 10% giá trị hóa đơn/tháng.

- Riêng phụ kiện có điện AVA: áp dụng hoàn tiền trong 3 tháng với mức phí như trên. Từ tháng thứ 4 trở đi không áp dụng hoàn tiền.`,
      content: `- Sản phẩm đổi trả phải giữ nguyên 100% hình dạng ban đầu và đủ điều kiện bảo hành của hãng.

- Thân máy, màn hình không trầy xước (áp dụng cho Điện thoại, Tablet, Laptop, Màn hình máy tính, Máy tính để bàn, Đồng hồ).

- Sản phẩm chỉ dùng cho mục đích sử dụng cá nhân, không áp dụng việc sử dụng sản phẩm cho mục đích thương mại.

- Hoàn trả lại đầy đủ hộp, sạc, phụ kiện đi kèm:

+ Mất hộp thu phí 2% giá trị hóa đơn đối với nhóm Điện thoại, Tablet, Laptop, Màn hình máy tính, Máy tính để bàn, Đồng hồ, Máy in.

+ Mất phụ kiện thu phí theo giá bán tối thiểu trên website LanChiShop và chính hãng (tối đa 5% giá trị hóa đơn) cho tất cả nhóm sản phẩm.

- Hoàn trả toàn bộ hàng khuyến mãi. Nếu mất hàng khuyến mãi sẽ thu phí theo mức giá đã được công bố.`,
    },
    // Thêm các dòng khác nếu cần
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

  function parseSpecifications(specifications) {
    const lines = specifications.split('\n');
    const specObject = {};

    lines.forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        specObject[key.trim()] = value.trim();
      }
    });

    return specObject;
  }

  function handleAddComment(values) {
    dispatch(
      addCommentProductAction({
        idProduct: parseInt(productID) ? parseInt(productID) : '',
        idUser: userInfo?.data?.id,
        data: {
          ...values,
          userId: userInfo?.data?.id,
          productId: parseInt(productID) ? parseInt(productID) : '',
        },
      })
    );
    formComment.resetFields();
  }

  let maxCount = cartList?.data?.length > 0
    ? cartList.data.find((cartitem) => cartitem?.productId === parseInt(productID))
      ? productDetail?.data?.quantity - cartList.data.find((cartitem) => cartitem?.productId === parseInt(productID)).count
      : productDetail?.data?.quantity
    : productDetail?.data?.quantity;

  const specifications = productDetail?.data?.specifications;
  const specObject = specifications ? parseSpecifications(specifications) : {};

  return (
    <Style.ProductInfo>
      <Style.MainInfo>
        <Row gutter={[15, 30]}>
          <Col xl={{ span: 12 }} lg={{ span: 12 }} sm={{ span: 24 }}>
            <div className="image-group">
              <Image.PreviewGroup>
                <Swiper onSwiper={setSwiper}>
                  {productDetail?.data?.images?.map((image) => {
                    return (
                      <SwiperSlide className="slide-item">
                        <Image
                          className="slide-image"
                          src={image.absoluteUrl}
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
                        src={image.absoluteUrl}
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
              <h3>{` ${productDetail?.data?.productName}`}</h3>
              <div className="product-rate">
                <span className="number-rate" style={{marginRight: 20}}>
                  Đã bán: {productDetail?.data?.sold}
                  {/* {commentList?.data?.length} Khách hàng đánh giá */}
                </span>
                <Rate
                  className="rate"
                  disabled
                  allowHalf
                  value={4.5}
                // value={commentList?.rate}
                />
                <span className="number-rate">
                  {15} Khách hàng đánh giá
                  {/* {commentList?.data?.length} Khách hàng đánh giá */}
                </span>
              </div>
              <div className="product-price">
                <strong>
                  {optionSelected?.price?.toLocaleString() ||
                    productDetail?.data?.price?.toLocaleString() ||
                    0}
                  ₫
                </strong>
              </div>
              <div className="product-info-list">
                <div className="product-brand-item">
                  <span className="product-info-tag">Loại sản phẩm:</span>
                  <span className="product-info-text">
                    <span>{`${productDetail?.data?.category?.categoryName}`}</span>
                  </span>
                </div>
                <div className="product-type-item">
                  <span className="product-info-tag">Thương hiệu:</span>
                  <span className="product-info-text">{` ${productDetail?.data?.brand?.categoryName}`}</span>
                </div>
              </div>
              <div className="product-info-list">
                <div className="product-type-item">
                  <span className="product-info-tag">Số lượng sản phẩm:</span>
                  <span className="product-info-text">
                    {productDetail?.data?.qty === 0
                      ? "đã hết"
                      : ` ${productDetail?.data?.qty}`}
                  </span>
                </div>
                <div className="product-type-item">
                  <span className="product-info-tag">Thời gian bảo hành:</span>
                  <span className="product-info-text">{` ${productDetail?.data?.warranty}`} Tháng </span><Button onClick={showWarrantyDetails}>Xem chi tiết bảo hành</Button>
                </div>
              </div>
              <div className="product-color">
                <span className="product-info-tag">Màu sắc:</span>
                <Style.Color color={productDetail?.data?.color} />
              </div>
              {productDetail?.data?.productOptions?.length > 0 && (
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
                {productDetail.data?.qty === 0 ? (
                  <Button disabled>Hết hàng</Button>
                ) : (
                  <Space wrap>
                    {/* <InputNumber
                      size="large"
                      disabled={maxCount === 0 ? true : false}
                      min={1}
                      max={maxCount}
                      onChange={(value) => setProductCount(value)}
                      value={productCount}
                    /> */}
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
                    Thông tin sản phẩm
                  </span>
                }
                key="1"
              >
                <div className={viewMore ? "list-info active" : "list-info"}>
                  <div className="description-text">
                    {typeof productDetail?.data?.description === 'string' ? (
                      productDetail.data.description.split('. ').map((item, index) => (
                        <React.Fragment key={index}>
                          <p>{item}</p>
                        </React.Fragment>
                      ))
                    ) : (
                      <p>No description available</p> // Hiển thị thông báo hoặc nội dung khác khi không có mô tả
                    )}
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
                  </Button>
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
                  header={`15 đánh giá`}
                  // header={`${commentList.data?.length} đánh giá`}
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
              title={<span>Thông số kĩ thuật</span>}
              layout="horizontal"
              bordered
            >
              {Object.entries(specObject).map(([key, value]) => (
                <Descriptions.Item key={key} label={key} span={3}>
                  {value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Style.DescriptionsCard>
        </Col>
      </Row>
      <Modal
        title="Chi tiết bảo hành"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={null} // Loại bỏ nút OK và Cancel nếu bạn không cần chúng
        width={700}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          size="small"
        />
      </Modal>
    </Style.ProductInfo>
  );
}

export default ProductInfo;
