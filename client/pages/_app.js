import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header currentUser={pageProps.currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

const getCurrentUser = async (context) => {
  const client = buildClient(context.req);
  try {
    const { data } = await client.get("/api/users/currentuser");
    return data.currentUser;
  } catch (error) {
    console.log("error while getting the current user", { error });
    return {};
  }
};

AppComponent.getInitialProps = async (context) => {
  const currentUser = await getCurrentUser(context.ctx);
  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

  return {
    pageProps: { ...pageProps, currentUser },
  };
};

export default AppComponent;
