const functions = require('firebase-functions');
const {google} = require('googleapis');

exports.updateVideo = functions.pubsub.schedule('every 10 minutes').onRun(async () => {
  const authClient = new google.auth.OAuth2({
    clientId: '<client id here>',
    clientSecret: '<client secret here>',
  });

  authClient.setCredentials({
    // in the video I used a sample (expired) token that will not work anymore
    refresh_token: '<refresh token here>',
  });

  const youtube = google.youtube({
    auth: authClient,
    version: 'v3',
  });

  const videoId = '4ErTK92HPCU';

  const videoResult = await youtube.videos.list({
    id: videoId,
    part: 'snippet,statistics',
  });

  const {statistics, snippet} = videoResult.data.items[0];

  const newTitle = `Self-Updating YouTube Video Tutorial (Views: ${statistics.viewCount}, Likes: ${statistics.likeCount})`;

  console.log(newTitle);

  // this if statement helps to save on quota if the title has not changed
  if (snippet.title !== newTitle) {
    snippet.title = newTitle;

    await youtube.videos.update({
      part: 'snippet',
      requestBody: {
        id: videoId,
        snippet,
      },
    });
  }

  console.log('Done!');
});
