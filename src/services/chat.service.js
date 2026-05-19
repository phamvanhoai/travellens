class ChatService {
  async reply({ message, context }) {
    return {
      message,
      context,
      reply: 'AI integration placeholder: configure OPENAI_API_KEY and replace chat.service.js with provider call.',
    };
  }
}

module.exports = new ChatService();

