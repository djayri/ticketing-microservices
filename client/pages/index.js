import React from "react";

const Home = (pageProps) => {
  const { currentUser } = pageProps;
  if (currentUser) {
    return <div>You are signed in as {currentUser?.email}</div>;
  }
  return <div>You are not signed in</div>;
};

Home.getInitialProps = (context) => {
  return { djay: "teah" };
};

export default Home;
