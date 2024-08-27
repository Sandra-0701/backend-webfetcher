const fetchStatusAndRedirect = require('./fetchStatusAndRedirect');
const getStatusColor = require('./getStatusColor');

const processLink = async (link, $) => {
  const href = $(link).attr('href');
  const text = $(link).text().trim();
  const ariaLabel = $(link).attr('aria-label') || '';
  const target = $(link).attr('target') || '';
  const classNames = $(link).attr('class') || '';

  let linkType = 'unknown';
  if (classNames.includes('cta')) linkType = 'cta';
  else if (classNames.includes('button')) linkType = 'button';
  else if (classNames.includes('link')) linkType = 'link';

  const linkDetails = {
    linkType,
    linkText: text,
    ariaLabel,
    url: href || '',
    redirectedUrl: '',
    statusCode: 200,
    target,
    statusColor: 'green',  // Default color
    originalUrlColor: '',
    redirectedUrlColor: '',
  };

  if (href) {
    try {
      const { statusCode, redirectedUrl } = await fetchStatusAndRedirect(href);
      linkDetails.statusCode = statusCode;
      linkDetails.redirectedUrl = redirectedUrl;
      linkDetails.statusColor = getStatusColor(statusCode);

      if (href !== redirectedUrl) {
        linkDetails.originalUrlColor = 'blue';
        linkDetails.redirectedUrlColor = 'purple';
      }
    } catch {
      linkDetails.statusCode = 500;
      linkDetails.statusColor = 'red';  // Error color
    }
  }

  return linkDetails;
};

module.exports = processLink;
