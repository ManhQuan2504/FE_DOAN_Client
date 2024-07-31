import React, { useEffect } from "react";

import categoryDieuhoa from "../../../../../assets/images/categoryDieuhoa.jpg";
import categoryTulanh from "../../../../../assets/images/categoryTulanh.jpg";
import categoryMaygiat from "../../../../../assets/images/categoryMaygiat.png";

import history from "../../../../../utils/history";

import * as Style from "./style";

function CategoryHome() {
  const categoryList = [
    {
      image: categoryDieuhoa,
      tag: "Bộ sưu tập",
      category: "Điều hoà",
      path: "/product/men",
    },
    {
      image: categoryTulanh,
      tag: "Bộ sưu tập",
      category: "Tủ lạnh",
      path: "/product/woman",
    },
    {
      image: categoryMaygiat,
      tag: "Bộ sưu tập",
      category: "Máy giặt",
      path: "/product/kids",
    },
  ];

  useEffect(() => {
    //preload image
    categoryList.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  function renderCategory() {
    return categoryList.map((category, index) => {
      return (
        <Style.CategoryItem
          key={index}
          onClick={() => history.push(category.path)}
        >
          <img src={category.image} alt="" />
          <div className="category-content">
            <span>{category.tag}</span>
            <h2>{category.category}</h2>
          </div>
        </Style.CategoryItem>
      );
    });
  }
  return (
    <Style.Category>
      <Style.CategoryList>{renderCategory()}</Style.CategoryList>
    </Style.Category>
  );
}

export default CategoryHome;
