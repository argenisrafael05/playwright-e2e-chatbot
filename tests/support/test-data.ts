export const credentials = {
  username: process.env.ORANGEHRM_USERNAME ?? "Admin",
  password: process.env.ORANGEHRM_PASSWORD ?? "admin123",
};

export const routes = {
  login: "/web/index.php/auth/login",
  dashboard: "/web/index.php/dashboard/index",
  chatbotSample: "/preview-embedded/",
};

export const messages = {
  invalidCredentials: "Invalid credentials",
  required: "Required",
};
