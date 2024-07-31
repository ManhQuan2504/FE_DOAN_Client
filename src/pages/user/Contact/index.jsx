import React from "react";
import Hero from "../../../components/Hero";
import { TITLE } from "../../../constants/title";
import { Container } from "../../../styles/styles";
import * as Style from "./style";

function ContactPage() {
  document.title = TITLE.CONTACT;
  return (
    <Style.Contact>
      <Hero title="Liên hệ" />
      <Container>
        <Style.ContactContent>
          <h2>LANCHISHOP</h2>
          <p>Website bán đồ điện gia dụng</p>
        </Style.ContactContent>
      </Container>
    </Style.Contact>
  );
}

export default ContactPage;
