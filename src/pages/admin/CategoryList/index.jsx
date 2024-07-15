import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Button, Input, Space, Popconfirm } from "antd";

import * as Icon from "@ant-design/icons";

import ModifyCategoryModal from "./components/ModifyCategoryModal";

import {
  getCategoryListAction,
  createCategoryAction,
  editCategoryAction,
  deleteCategoryAction,
} from "../../../redux/actions";

import * as Style from "./styles";

function CategoryListPage(props) {
  const [searchKey, setSearchKey] = useState("");
  const [isShowModifyModal, setIsShowModifyModal] = useState("");
  const [modifyCategoryData, setModifyCategoryData] = useState({});

  const { categoryList } = useSelector((state) => state.categoryReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryListAction());
  }, []);

  function handleSearchCategory(value) {
    setSearchKey(value);
    dispatch(
      getCategoryListAction({
        searchKey: value,
      })
    );
  }
  function handleSubmitForm(values) {
    if (isShowModifyModal === "create") {
      dispatch(
        createCategoryAction({
          data: values,
        })
      );
    } else {
      dispatch(
        editCategoryAction({
          id: modifyCategoryData.id,
          data: values,
        })
      );
    }
    setIsShowModifyModal("");
  }
  function totalQuantityProduct(productData) {
    return productData.reduce(
      (totalProduct, productItem) =>
        productItem.quantity
          ? totalProduct + productItem.quantity
          : totalProduct,
      0
    );
  }
  function totalSoldProduct(productData) {
    return productData.reduce(
      (totalProduct, productItem) =>
        productItem.sold ? totalProduct + productItem.sold : totalProduct,
      0
    );
  }
  const tableColumn = [
    {
      title: "loại",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Tổng số lượng",
      dataIndex: "products",
      key: "products",
      sorter: (a, b) =>
        totalQuantityProduct(a.products) - totalQuantityProduct(b.products),
      render: (value) => totalQuantityProduct(value),
    },
    {
      title: "Đã bán",
      dataIndex: "products",
      key: "products",
      sorter: (a, b) =>
        totalSoldProduct(a.products) - totalSoldProduct(b.products),
      render: (value) => totalSoldProduct(value),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Space>
            <Button
              icon={<Icon.FormOutlined />}
              type="primary"
              ghost
              onClick={() => {
                setIsShowModifyModal("edit");
                setModifyCategoryData(record);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Are you sure to delete this category?"
              onConfirm={() =>
                dispatch(deleteCategoryAction({ id: record.id }))
              }
              onCancel={() => null}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<Icon.DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const tableData = categoryList.data.map((categoryItem, categoryIndex) => {
    return {
      key: categoryIndex,
      ...categoryItem,
    };
  });

  return (
    <div>
      <Style.CustomSpaceBox>
        <Style.Title>Quản lý loại sản phẩm</Style.Title>
        <Style.CustomSpace>
          <Style.Search>
            <Input
              placeholder="Tìm kiếm..."
              suffix={<Icon.SearchOutlined />}
              onChange={(e) => handleSearchCategory(e.target.value)}
            />
          </Style.Search>
          <Button
            type="primary"
            onClick={() => {
              setIsShowModifyModal("create");
              setModifyCategoryData({ name: "", price: 0 });
            }}
          >
            Thêm mới
          </Button>
        </Style.CustomSpace>
      </Style.CustomSpaceBox>
      <Style.CustomTable
        scroll={{ x: "1000px" }}
        size="small"
        columns={tableColumn}
        dataSource={tableData}
        loading={categoryList.load}
      />

      <ModifyCategoryModal
        isShowModifyModal={isShowModifyModal}
        setIsShowModifyModal={setIsShowModifyModal}
        handleSubmitForm={handleSubmitForm}
        modifyCategoryData={modifyCategoryData}
      />
    </div>
  );
}

export default CategoryListPage;
