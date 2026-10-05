import api from "./api";

export const FetchApiKeys = async () => {
  try {
    const res = await api.get("api-keys/");
    return res.data;
  } catch (error) {
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};

export const CreateApiKey = async (name) => {
  try {
    const res = await api.post("api-keys/", { name });
    return res.data;
  } catch (error) {
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};

export const RevokeApiKey = async (id) => {
  try {
    await api.delete(`api-keys/${id}/`);
  } catch (error) {
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};
