import React from "react";
import { Row, Col } from "antd";
import CardProduct from "../../../../../components/Card";
import * as Style from "./style";

function ProductRelated({ productList }) {
  return (
    <Style.ProductRelated>
      <Row gutter={[15, 20]}>
        <Col span={24}>
          <div className="title">
            <div>LANCHISHOP</div>
            <h2>Sản phẩm tương tự</h2>
          </div>
        </Col>
        {productList.data.map((productItem, productIndex) => {
          if (productIndex <= 7) {
            return (
              <Col
                xl={{ span: 6 }}
                lg={{ span: 8 }}
                sm={{ span: 12 }}
                xs={{ span: 12 }}
                key={productIndex}
                className="col-custom"
              >
                <CardProduct
                  path={`/product/${productItem.name}-${productItem.id}`}
                  product={productItem}
                ></CardProduct>
              </Col>
            );
          }
        })}
      </Row>
    </Style.ProductRelated>
  );
}

export default ProductRelated;
