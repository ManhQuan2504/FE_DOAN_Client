import React from "react";
import { Badge, Space, Rate } from "antd";
import * as Style from "./styles";
import history from "../../utils/history";

function CardProduct({ product, path }) {
  return (
    <Badge.Ribbon style={{ zIndex: 5 }} text="New" color="red">
      <Style.CardProduct onClick={() => history.push(path)}>
        <Style.ProductImage onClick={() => history.push(path)}>
          <img
            src={product.images[0]}
            className="visible content"
            alt={product.name}
          />
          <img
            src={product.images[1]}
            className="hidden content"
            alt={product.name}
          />
        </Style.ProductImage>
        <Style.ProductContent>
          <h3 onClick={() => history.push(path)}>{product.name}</h3>
          <strong>{product?.price?.toLocaleString()}₫</strong>
          <div align="center" className="card-info">
            <Rate className="star" allowHalf disabled value={product.rate} />
            <span className="quantity">
              {product.quantity === 0
                ? "đã hết"
                : `còn ${product.quantity} sản phẩm`}
            </span>
          </div>
          <div align="center" className="card-info brand-info">
            {/* <img
              src={product.category?.logo}
              className="logo_brand"
              alt={product.category?.name}
            /> */}
            <span className="option">
              {product?.productOptions?.length === 0
                ? "size mặc định"
                : `có ${product?.productOptions?.length} size`}
            </span>
            <span className="brand">{product.category?.name}</span>
          </div>
        </Style.ProductContent>
      </Style.CardProduct>
    </Badge.Ribbon>
  );
}

export default CardProduct;
