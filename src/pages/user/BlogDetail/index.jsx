import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getBlogDetailAction } from "../../../redux/actions";
import moment from "moment";
import "moment/locale/vi";
import { Container } from "../../../styles/styles";
import Loading from "../../../components/Loading";
import { PageHeader } from "antd";
import * as Style from "./styles";
import history from "../../../utils/history";
import DOMPurify from "dompurify";

function BlogDetail() {
  const { id } = useParams();

  const { blogDetail } = useSelector((state) => state.blogReducer);

  const dispatch = useDispatch();

  moment.locale("vi");

  useEffect(() => {
    dispatch(
      getBlogDetailAction({
        id: id,
      })
    );
  }, [id]);

  return (
    <>
      {blogDetail.load ? (
        <Loading load={blogDetail.load} />
      ) : (
        <Style.BlogDetail>
          <Container>
            <PageHeader
              className="site-page-header"
              onBack={() => history.goBack()}
              title="Chi tiết bài viết"
              subTitle={blogDetail.data?.title}
            />
            <Style.BlogContent>
              <h2>{blogDetail.data?.title}</h2>
              <p>{blogDetail.data?.desc}</p>
              <time>
                ngày viết:{" "}
                {moment(blogDetail.data?.createdAt).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </time>

              <div
                style={{ marginTop: 30 }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blogDetail.data.content),
                }}
              ></div>
            </Style.BlogContent>
          </Container>
        </Style.BlogDetail>
      )}
    </>
  );
}

export default BlogDetail;
