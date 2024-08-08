import React, { useEffect } from "react";
import * as Style from "./styles";

import register from "../../../assets/images/register.png";

import SectionHome from "./components/SectionHome";
import ProductNew from "./components/ProductNew";
import ProductSlider from "./components/ProductSlider";
import RegisterForm from "./components/RegisterForm";
import CategoryHome from "./components/Category";
import SliderHome from "./components/SliderHome";
import ArticlesHome from "./components/Articles";
import GalleryHome from "./components/Gallery";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlogListAction,
  getProductListAction,
} from "../../../redux/actions";
import Loading from "../../../components/Loading";
import { TITLE } from "../../../constants/title";
import { notification } from "antd";

function HomePage() {
  document.title = TITLE.HOME;
  const { productList } = useSelector((state) => state.productReducer);
  const { blogList } = useSelector((state) => state.blogReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    //preload Image
    const img = new Image();
    img.src = register;
    dispatch(getProductListAction({ loadHome: true }));
    dispatch(getBlogListAction({ page: 1 }));

    const paymentSuccess = localStorage.getItem('paymentSuccess');
    if (paymentSuccess) {
      const { message, description } = JSON.parse(paymentSuccess);
      notification.success({
        message: message,
        description: description,
      });

      // Xóa thông tin sau khi hiển thị thông báo
      localStorage.removeItem('paymentSuccess');
    }
  }, []);
  console.log("🚀 ~ HomePage ~ productList:", productList)

  const shoesMenList = {
    data: productList.data?.filter(
      (productItem) => productItem?.department?.name === "Máy giặt"
    ),
  };
  const shoesWomenList = {
    data: productList.data?.filter(
      (productItem) => productItem?.department?.name === "Tủ lạnh"
    ),
  };
  const shoesKidsList = {
    data: productList.data?.filter(
      (productItem) => productItem?.department?.name === "Điều hoà"
    ),
  };

  return (
    <>
      {productList.load ? (
        <Loading load={productList.load} />
      ) : (
        <Style.Home>
          {/* Slider */}
          <SliderHome />
          {/* Giày mới */}
          <SectionHome title="Sản phẩm mới" text="xem thêm" params="/product">
            <ProductNew productList={productList} />
          </SectionHome>
          {/* category */}
          <CategoryHome />
          {/* Giày nam */}
          <SectionHome title="Điều hoà" text="xem thêm" params="/product/men">
            <ProductSlider productList={shoesMenList} />
          </SectionHome>
          {/* Form đăng ký nhận thông báo */}
          <RegisterForm
            bg={register}
            title="Đăng ký"
            text=" Đăng ký nhận bản tin của LanChiShop để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá khác."
          />
          {/* Giày nữ */}
          <SectionHome title="Tủ lạnh" text="xem thêm" params="/product/woman">
            <ProductSlider productList={shoesWomenList} />
          </SectionHome>
          {/* Giày trẻ em */}
          <SectionHome
            title="Máy giặt"
            text="xem thêm"
            params="/product/kids"
          >
            <ProductSlider productList={shoesKidsList} />
          </SectionHome>
          {/* Bài viết */}
          <SectionHome title="Bài viết mới nhất" text="xem thêm" params="/blog">
            <ArticlesHome articlesList={blogList.data} />
          </SectionHome>

          {/* list ảnh giới thiệu */}
          <SectionHome
            title="Khách hàng và LanChiShop"
            text=""
            noContainer={true}
          >
            <GalleryHome />
          </SectionHome>
        </Style.Home>
      )}
    </>
  );
}

export default HomePage;
