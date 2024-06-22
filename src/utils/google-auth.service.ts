import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

export async function getAccessToken() {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
  console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN);

  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REFRESH_TOKEN
  ) {
    throw new Error('Missing required environment variables for OAuth2');
  }

  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground', // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  try {
    const accessTokenResponse = await oauth2Client.getAccessToken();
    console.log('Access token response:', accessTokenResponse);
    if (!accessTokenResponse.token) {
      throw new Error('Failed to obtain access token');
    }
    return accessTokenResponse.token;
  } catch (error) {
    console.error(
      'Error obtaining access token:',
      error.response?.data || error.message,
    );
    throw new Error('Failed to obtain access token');
  }
}
