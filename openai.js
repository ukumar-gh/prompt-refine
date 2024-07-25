const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: 'sk-proj-CGSHMBaQzBj1PafdSZgFT3BlbkFJs4ZPA4v89iJXQSa75yN2',
});

const refinePrompt = async (userPrompt) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a prompt refining assistant." },
        { role: "user", content: `Hi ChatGPT, I need your help in refining my prompts to get the best possible responses from you. Please transform the given prompt into a more effective and detailed version, ensuring it is clear, specific, and includes necessary context. If you need more information, please ask clarifying questions. Also, provide examples and encourage step-by-step reasoning. Let’s start with this prompt: '${userPrompt}'.` }
      ],
      model: "gpt-4o-mini",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  refinePrompt,
};