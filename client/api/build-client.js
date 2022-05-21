import axios from "axios";

const isInBrowser = () => typeof window !== "undefined";

export default (req) => {
  if (isInBrowser()) {
    return axios.create({
      baseURL: "/",
    });
  }
  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: req.headers,
  });
};
