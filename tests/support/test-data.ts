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

export const chatbot = {
  botName: "ChatBot",
  greeting: "Hola",
  // Informational: it never leads to sales or contact, so no person is bothered.
  quickReply: /Build AI chatbot/,
  maxReplyWait: 15_000,
  // The bot words its greeting differently each time, so the reply is checked by intent.
  greetingIntent:
    /\b(hi|hello|hey|hola|welcome)\b|good to see|great to see|nice to meet/i,
  fallbackIntent: /sorry|didn't (understand|get)|don't understand|try again/i,
};
