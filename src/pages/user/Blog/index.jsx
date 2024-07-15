import React, { useEffect, useState } from "react";
import BreadcrumbUI from "../../../components/Breadcrumb";

import * as Icons from "@ant-design/icons";
import * as Style from "./styles";
import { TITLE } from "../../../constants/title";
import { ARTICLES_LIMIT } from "../../../constants/acticle";
import { Button, Input, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getBlogListAction } from "../../../redux/actions/blog.action";
import history from "../../../utils/history";
import Loading from "../../../components/Loading";
import moment from "moment";
import "moment/locale/vi";

function BlogPage() {
  document.title = TITLE.BLOG;
  const { blogList } = useSelector((state) => state.blogReducer);
  const [sortValue, setSortValue] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();
  moment.locale("vi");

  useEffect(() => {
    dispatch(getBlogListAction({ page: 1 }));
  }, []);

  function renderArticlesList() {
    return blogList.data?.map((article, index) => {
      return (
        <Style.ArticleItem
          key={`${article.id}-${index}`}
          onClick={() => history.push(`/blog/${article.id}`)}
        >
          <div className="article-img">
            <img src={article.thumb} alt="" />
          </div>
          <div className="article-content">
            <span>{moment(article.createdAt).fromNow()}</span>
            <h2>
              <title>{article.title}</title>
            </h2>
            <p>{article.desc}</p>
          </div>
        </Style.ArticleItem>
      );
    });
  }

  function handleSearchBlog(value) {
    setSearchKey(value);
    dispatch(
      getBlogListAction({
        page: 1,
        searchKey: value,
        sortValue,
      })
    );
  }

  function handleChangeSelect(value) {
    setSortValue(value);
    dispatch(
      getBlogListAction({
        page: 1,
        searchKey,
        sortValue: value,
      })
    );
  }

  function handleShowMore() {
    dispatch(
      getBlogListAction({
        page: blogList.page + 1,
        searchKey: searchKey,
        sortValue,
        more: true,
      })
    );
  }

  return (
    <>
      <Style.BlogPage>
        <Style.Hero src="">
          <Style.Breadcrumb>
            <BreadcrumbUI />
          </Style.Breadcrumb>

          <Style.HeroTitle>Bài viết</Style.HeroTitle>
        </Style.Hero>
        <Style.BlogContainer>
          <Style.SortSearchBlog>
            <Input
              placeholder="Search..."
              onChange={(e) => handleSearchBlog(e.target.value)}
              value={searchKey}
              suffix={<Icons.SearchOutlined />}
            />
            <div className="select-sort">
              <Select
                style={{ width: "100%" }}
                value={sortValue}
                onChange={handleChangeSelect}
                placeholder="Sắp xếp theo..."
              >
                <Select.Option value="" disabled>
                  Sắp xếp theo...
                </Select.Option>
                <Select.Option value="id-desc">Mới nhất</Select.Option>
                <Select.Option value="id-asc">Cũ nhất</Select.Option>
              </Select>
            </div>
          </Style.SortSearchBlog>
          {blogList.load ? (
            <Loading load={blogList.load} />
          ) : (
            <>
              <Style.ArticleList>{renderArticlesList()}</Style.ArticleList>

              {blogList.data?.length % ARTICLES_LIMIT === 0 && (
                <Row justify="center" style={{ marginTop: 16 }}>
                  <Button
                    type="default"
                    loading={blogList.loadMore}
                    onClick={() => {
                      handleShowMore();
                    }}
                  >
                    Xem thêm
                  </Button>
                </Row>
              )}
            </>
          )}
        </Style.BlogContainer>
      </Style.BlogPage>
    </>
  );
}

export default BlogPage;
