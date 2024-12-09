import axios from "axios";

export const triggerModel = async () => {
  const response = await axios.get(`${process.env.BASE_URL}/proces`);
  return response;
};
