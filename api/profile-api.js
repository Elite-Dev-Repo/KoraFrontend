import api from "./api";

export const FetchUserProfile = async () => {
  try {
    const res = await api.get("profile/");
    return res.data;
  } catch (error) {
    // Re-throw normalized backend errors so callers can toast them
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};
