import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  getCategoryListAction,
  getDepartmentListAction,
  getProductListAction,
  getTypeListAction,
} from "../../../redux/actions";

import { PRODUCT_LIMIT } from "../../../constants/product";
import Product from "./components/Product";
import history from "../../../utils/history";
import Loading from "../../../components/Loading";
import Hero from "../../../components/Hero";
import FilterProduct from "./components/FilterProduct";

import * as Style from "./styles";
import { Container } from "../../../styles/styles";

import { TITLE } from "../../../constants/title";
import SortProduct from "./components/SortProduct";

function ProductPage() {
  document.title = TITLE.PRODUCT_LIST;
  const { productList } = useSelector((state) => state.productReducer);
  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { typeList } = useSelector((state) => state.typeReducer);
  const { departmentList } = useSelector((state) => state.departmentReducer);
  const [categoriesSelected, setCategoriesSelect] = useState('');
  const [sortValue, setSortValue] = useState("");
  const [typesSelected, setTypesSelect] = useState([]);
  const [departmentsSelected, setDepartmentsSelect] = useState([]);
  const [sizeSelected, setSizeSelect] = useState([]);
  const [colorSelected, setColorSelect] = useState([]);
  const [ratingSelected, setRatingSelect] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [priceRange, setPriceRange] = useState([0, 15000000]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryListAction());
    dispatch(getProductListAction({ page: 1 }));
    dispatch(getTypeListAction());
    dispatch(getDepartmentListAction());
  }, []);

  useEffect(() => {
    setCategoriesSelect([]);
    setTypesSelect([]);
    setDepartmentsSelect([]);
    setSearchKey("");
    setSortValue("");
    setPriceRange([0, 15000000]);
    if (history.location.pathname === "/product/DIEU_HOA") {
      setDepartmentsSelect([1]);
      dispatch(getProductListAction({ page: 1, categoriesSelected: ['668d392f6898d2df872ea7fd'] }));
    }
    if (history.location.pathname === "/product/TU_LANH") {
      setDepartmentsSelect([2]);
      dispatch(getProductListAction({ page: 1, categoriesSelected: ['66744456a05d2d473e7b7646'] }));
    }
    if (history.location.pathname === "/product/MAY_GIAT") {
      setDepartmentsSelect([3]);
      dispatch(getProductListAction({ page: 1, categoriesSelected: ['6697e3fc0e31e1290a69145e'] }));
    }
    if (history.location.pathname === "/product") {
      setDepartmentsSelect([]);
      dispatch(getProductListAction({ page: 1 }));
    }
  }, [history.location.pathname]);

  function handleFilterCategory(value) {
    setCategoriesSelect(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected: value,
        typesSelected,
        searchKey,
        priceRange,
        departmentsSelected,
        colorSelected,
        sortValue,
      })
    );
  }

  function handleFilterType(value) {
    setTypesSelect(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected: value,
        searchKey,
        priceRange,
        departmentsSelected,
        colorSelected,
        sortValue,
      })
    );
  }

  function handleFilterDepartment(value) {
    setDepartmentsSelect(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected,
        searchKey,
        departmentsSelected: value,
        priceRange,
        colorSelected,
        sortValue,
      })
    );
  }
  function handleRangePrice(value) {
    setPriceRange(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        priceRange,
        typesSelected,
        departmentsSelected,
        searchKey,
        colorSelected,
        sortValue,
      })
    );
  }

  function handleSearchProduct(value) {
    setSearchKey(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected,
        priceRange,
        searchKey: value,
        departmentsSelected,
        colorSelected,
        sortValue,
      })
    );
  }

  function handleFilterSize(value) {
    setSizeSelect(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected,
        priceRange,
        searchKey,
        departmentsSelected,
        colorSelected,
        sortValue,
      })
    );
  }

  function handleFilterColor(value) {
    setColorSelect(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected,
        priceRange,
        searchKey,
        colorSelected: value,
        departmentsSelected,
        sortValue,
      })
    );
  }

  function handleFilterRating(value) {
    setRatingSelect(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected,
        priceRange,
        searchKey,
        colorSelected: value,
        departmentsSelected,
        sortValue,
      })
    );
  }

  function handleChangeSelect(value) {
    setSortValue(value);
    dispatch(
      getProductListAction({
        page: 1,
        categoriesSelected,
        typesSelected,
        priceRange,
        searchKey,
        colorSelected,
        departmentsSelected,
        sortValue: value,
      })
    );
  }

  return (
    <>
      {typeList.load || departmentList.load || categoryList.load ? (
        <Loading
          load={typeList.load || departmentList.load || categoryList.load}
        />
      ) : (
        <>
          <Hero
            title={
              history.location.pathname === "/product"
                ? "Tất cả sản phẩm"
                : history.location.pathname === "/product/DIEU_HOA"
                ? "Điều hoà"
                : history.location.pathname === "/product/TU_LANH"
                ? "Tủ lạnh"
                : history.location.pathname === "/product/MAY_GIAT"
                ? "Máy giặt"
                : null
            }
          />
          <Container>
            <Style.ProductLayout>
              <Style.ProductFilterContainer>
                <FilterProduct
                  handleFilterCategory={handleFilterCategory}
                  handleFilterColor={handleFilterColor}
                  handleFilterDepartment={handleFilterDepartment}
                  handleFilterSize={handleFilterSize}
                  handleFilterType={handleFilterType}
                  handleRangePrice={handleRangePrice}
                  handleFilterRating={handleFilterRating}
                  typeList={typeList}
                  categoryList={categoryList}
                  departmentList={departmentList}
                  categoriesSelected={categoriesSelected}
                  typesSelected={typesSelected}
                  departmentsSelected={departmentsSelected}
                  priceRange={priceRange}
                  searchKey={searchKey}
                  setTypesSelect={setTypesSelect}
                  setCategoriesSelect={setCategoriesSelect}
                  setDepartmentsSelect={setDepartmentsSelect}
                  setSearchKey={setSearchKey}
                  setPriceRange={setPriceRange}
                  colorSelected={colorSelected}
                  setColorSelect={setColorSelect}
                  sizeSelected={sizeSelected}
                  setSizeSelect={setSizeSelect}
                  ratingSelected={ratingSelected}
                  setRatingSelect={setRatingSelect}
                />
              </Style.ProductFilterContainer>
              <Style.ProductContent>
                <SortProduct
                  handleSearchProduct={handleSearchProduct}
                  handleChangeSelect={handleChangeSelect}
                  sortValue={sortValue}
                  searchKey={searchKey}
                />
                <div style={{ position: "relative" }}>
                  {productList.load ? (
                    <Loading load={productList.load} />
                  ) : (
                    <Product
                      productList={productList}
                      searchKey={searchKey}
                      categoriesSelected={categoriesSelected}
                      typesSelected={typesSelected}
                      priceRange={priceRange}
                      departmentsSelected={departmentsSelected}
                      PRODUCT_LIMIT={PRODUCT_LIMIT}
                    />
                  )}
                </div>
              </Style.ProductContent>
            </Style.ProductLayout>
          </Container>
        </>
      )}
    </>
  );
}

export default ProductPage;
