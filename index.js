const express = require('express');
const cors = require('cors');
const { refinePrompt } = require('./openai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/refine-prompt', async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log('Streaming API request:', userPrompt);

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const stream = await refinePrompt(userPrompt);

    for await (const part of stream) {
      if (part.choices[0].delta && part.choices[0].delta.content) {
        res.write(`data: ${part.choices[0].delta.content}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('API error:', error.status, error.message, error.code, error.type);
      res.status(error.status).json({ error: error.message });
    } else {
      console.error('Non-API error:', error);
      res.status(500).json({ error: 'Failed to refine prompt' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});