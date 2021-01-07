import actioncable from "actioncable";
import Cookies from "js-cookie";

const getWebSocketURL = () => {
  const token = Cookies.get("token");
  return `${process.env.REACT_APP_ACTION_CABLE_BASE_URL}?token=${token}`;
};

const consumer = actioncable.createConsumer(getWebSocketURL());

export default consumer;
