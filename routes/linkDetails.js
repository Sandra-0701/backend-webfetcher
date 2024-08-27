const express = require('express');
const router = express.Router();
const getPageContent = require('../utils/getPageContent');
const processLink = require('../utils/processLink');
const cheerio = require('cheerio');

router.post('/', async (req, res) => {
  const { url, onlyUhf = false } = req.body;

  try {
    // Fetch page content based on the UHF flag
    const { content, header, footer } = await getPageContent(url, onlyUhf);

    // Check if content, header, or footer is missing
    if (!content && !header && !footer) {
      return res.status(500).send('Failed to fetch page content.');
    }

    let $;
    
    if (onlyUhf) {
      // Combine header and footer for UHF content
      const uhfContent = `${header || ''}${footer || ''}`;
      $ = cheerio.load(uhfContent);
    } else {
      // Load the main content
      $ = cheerio.load(content);
    }

    // Fetch link details
    const linkElements = $('a').toArray();
    const linkPromises = linkElements.map(link => processLink(link, $));
    const links = await Promise.all(linkPromises);

    // Respond with link details
    res.json({ links });
  } catch (error) {
    console.error('Error in /link-details route:', error.stack || error.message);
    res.status(500).send(`Failed to process page content: ${error.message}`);
  }
});

module.exports = router;
