import React from "react";
import { Space, Tag } from "antd";
import { useDispatch } from "react-redux";
import history from "../../../../../utils/history";
import { getProductListAction } from "../../../../../redux/actions";
import { COLOR_MENU } from "../../../../../constants/color";

function TagList({
  typeList,
  departmentList,
  categoryList,
  categoriesSelected,
  searchKey,
  typesSelected,
  departmentsSelected,
  priceRange,
  setCategoriesSelect,
  setSearchKey,
  setTypesSelect,
  setDepartmentsSelect,
  setPriceRange,
  colorSelected,
  setColorSelect,
}) {
  const dispatch = useDispatch();

  function renderTagFilter() {
    if (
      categoriesSelected.length === 0 &&
      colorSelected.length === 0 &&
      typesSelected.length === 0 &&
      (departmentsSelected.length === 0 ||
        (departmentsSelected.length > 0 &&
          history.location.pathname !== "/product")) &&
      priceRange[0] === 0 &&
      priceRange[1] === 15000000
    )
      return null;
    return (
      <Space wrap style={{ padding: "5px 0 15px" }} size={[0, 8]}>
        {/* Đang filter theo: */}
        {categoriesSelected.length > 0 &&
          categoriesSelected.map((selectedItem, selectedIndex) => {
            const categorySelectedData = categoryList.data.find(
              (categoryItem) => categoryItem.id === selectedItem
            );
            return (
              <Tag
                color="#1790c8"
                key={`category-${selectedIndex}`}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  const newCategoriesSelect = [...categoriesSelected];
                  newCategoriesSelect.splice(selectedIndex, 1);
                  setCategoriesSelect(newCategoriesSelect);
                  dispatch(
                    getProductListAction({
                      page: 1,
                      categoriesSelected: newCategoriesSelect,
                      priceRange,
                      departmentsSelected: departmentsSelected,
                      typesSelected: typesSelected,
                      searchKey: searchKey,
                      colorSelected,
                    })
                  );
                }}
              >
                {categorySelectedData.name}
              </Tag>
            );
          })}
        {typesSelected.length > 0 &&
          typesSelected.map((typeSelectedItem, typeSelectedIndex) => {
            const typeSelectedData = typeList.data.find(
              (typeItem) => typeItem.id === typeSelectedItem
            );
            return (
              <Tag
                color="#1790c8"
                key={`type-${typeSelectedIndex}`}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  const newTypesSelect = [...typesSelected];
                  newTypesSelect.splice(typeSelectedIndex, 1);
                  setTypesSelect(newTypesSelect);
                  dispatch(
                    getProductListAction({
                      page: 1,
                      categoriesSelected: categoriesSelected,
                      typesSelected: newTypesSelect,
                      priceRange,
                      departmentsSelected: departmentsSelected,
                      searchKey: searchKey,
                      colorSelected,
                    })
                  );
                }}
              >
                {typeSelectedData.name}
              </Tag>
            );
          })}
        {departmentsSelected.length > 0 &&
          history.location.pathname === "/product" &&
          departmentsSelected.map(
            (departmentSelectedItem, departmentSelectedIndex) => {
              const departmentSelectedData = departmentList.data.find(
                (departmentItem) => departmentItem.id === departmentSelectedItem
              );
              return (
                <Tag
                  color="#1790c8"
                  key={`type-${departmentSelectedIndex}`}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    const newDepartmentSelect = [...departmentsSelected];
                    newDepartmentSelect.splice(departmentSelectedIndex, 1);
                    setDepartmentsSelect(newDepartmentSelect);
                    dispatch(
                      getProductListAction({
                        page: 1,
                        categoriesSelected: categoriesSelected,
                        typesSelected: typesSelected,
                        departmentsSelected: newDepartmentSelect,
                        priceRange,
                        searchKey: searchKey,
                        colorSelected,
                      })
                    );
                  }}
                >
                  {departmentSelectedData.name}
                </Tag>
              );
            }
          )}
        {colorSelected.length > 0 &&
          colorSelected.map((colorSelectedItem, colorSelectedIndex) => {
            const colorSelectedData = COLOR_MENU.find(
              (colorItem) => colorItem.code === colorSelectedItem
            );
            return (
              <Tag
                color="#1790c8"
                key={`type-${colorSelectedIndex}`}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  const newColorSelect = [...colorSelected];
                  newColorSelect.splice(colorSelectedIndex, 1);
                  setColorSelect(newColorSelect);
                  dispatch(
                    getProductListAction({
                      page: 1,
                      categoriesSelected: categoriesSelected,
                      typesSelected: typesSelected,
                      colorSelected: newColorSelect,
                      priceRange,
                      departmentsSelected: departmentsSelected,
                      searchKey: searchKey,
                    })
                  );
                }}
              >
                {colorSelectedData.name}
              </Tag>
            );
          })}
        {(priceRange[0] !== 0 || priceRange[1] !== 15000000) && (
          <Tag
            color="#1790c8"
            closable
            onClose={() => {
              setPriceRange([0, 15000000]);
              dispatch(
                getProductListAction({
                  page: 1,
                  categoriesSelected,
                  typesSelected,
                  departmentsSelected,
                  priceRange: [0, 15000000],
                  searchKey,
                  colorSelected,
                })
              );
            }}
          >
            {`Giá từ: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`}
          </Tag>
        )}
        {(priceRange[0] !== 0 ||
          priceRange[1] !== 15000000 ||
          (departmentsSelected.length > 0 &&
            history.location.pathname === "/product") ||
          typesSelected.length > 0 ||
          colorSelected.length > 0 ||
          categoriesSelected.length > 0) && (
          <Tag
            closable
            color="#ff324d"
            onClose={() => {
              setPriceRange([0, 15000000]);
              setCategoriesSelect([]);
              setTypesSelect([]);
              setColorSelect([]);
              if (history.location.pathname === "/product") {
                setDepartmentsSelect([]);
              }
              dispatch(
                getProductListAction({
                  page: 1,
                  categoriesSelected: [],
                  typesSelected: [],
                  departmentsSelected:
                    history.location.pathname === "/product"
                      ? []
                      : departmentsSelected,
                  priceRange: [0, 15000000],
                  searchKey,
                  colorSelected: [],
                })
              );
            }}
          >
            Xoá tất cả
          </Tag>
        )}
      </Space>
    );
  }
  return <>{renderTagFilter()}</>;
}

export default TagList;
