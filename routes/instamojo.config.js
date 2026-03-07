const dotenv = require('dotenv');
dotenv.config();

const instamojo_api_key = process.env.INSTAMOJO_API_KEY;
const instamojo_auth_token = process.env.INSTAMOJO_AUTH_TOKEN;
const instamojo_base_url = process.env.INSTAMOJO_BASE_URL || "https://test.instamojo.com"; // test: https://test.instamojo.com | live: https://www.instamojo.com

module.exports = {
  instamojo_api_key,
  instamojo_auth_token,
  instamojo_base_url
};

