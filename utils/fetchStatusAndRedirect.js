const axios = require('axios');
const getStatusColor = require('./getStatusColor');

const fetchStatusAndRedirect = async (url) => {
  try {
    const response = await axios({
      method: 'get',
      url,
      maxRedirects: 0, // Disable automatic redirects
      validateStatus: () => true, // Accept all status codes
      responseType: 'text', // Ensure response is treated as text
    });

    const redirectedUrl = response.request.res.responseUrl || url;
    return {
      statusCode: response.status,
      redirectedUrl,
      statusColor: getStatusColor(response.status),
    };
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const redirectedUrl = error.response?.request?.res?.responseUrl || url;
    const errorStatusColor = getStatusColor(statusCode);

    return {
      statusCode,
      redirectedUrl,
      statusColor: errorStatusColor,
    };
  }
};

module.exports = fetchStatusAndRedirect;
