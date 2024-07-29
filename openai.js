const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const refinePrompt = async (userPrompt) => {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a prompt refining assistant.' },
        { role: 'user', content: `Hi ChatGPT, I need your help in refining my prompts to get the best possible responses from you. Please transform the given prompt into a more effective and detailed version, ensuring it is clear, specific, and includes necessary context. If you need more information, please ask clarifying questions. Also, provide examples and encourage step-by-step reasoning. Let’s start with this prompt: '${userPrompt}'.` }
      ],
      stream: true,
    });

    let refinedPrompt = '';
    for await (const part of stream) {
      refinedPrompt += part.choices[0].delta.content;
    }

    return refinedPrompt;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('API error:', error.status, error.message, error.code, error.type);
    } else {
      console.error('Non-API error:', error);
    }
    throw error;
  }
};

module.exports = {
  refinePrompt,
};