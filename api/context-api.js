import api from "./api";

export const GenerateUserContext = async ({
  personalContext,
  pastProjects,
  resumeFile,
}) => {
  try {
    const formData = new FormData();
    formData.append("personal_context", personalContext ?? "");
    formData.append("past_projects", pastProjects ?? "");
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }
    const res = await api.post("generate_info/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};
