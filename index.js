const express = require('express');
const cors = require('cors');
const { refinePrompt } = require('./openai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/refine-prompt', async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log('server endpoint touched', req.body.prompt);
  try {
    const refinedPrompt = await refinePrompt(userPrompt);
    res.json({ refinedPrompt });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      console.error('Error refining prompt:', error);
      res.status(500).json({ error: 'Failed to refine prompt' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});