const functions = require('firebase-functions');
const {google} = require('googleapis');

exports.updateVideo = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const authClient = new google.auth.OAuth2({
    clientId: '295304590720-b47arnpmo1dtck8pbf656pq9jb1q98g6.apps.googleusercontent.com',
    clientSecret: 'JfM__SSWFceiSFAagu4APtmY',
  });

  authClient.setCredentials({
    refresh_token: '1//04bgtJ92gfhevCgYIARAAGAQSNwF-L9Ir9bvwT5djqsqJJ5IAcBeZQqWYDKwzbraZ4YBfmsNl2X-CnXapU1yaZYC2pjBxR3J97HA',
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

  snippet.title = newTitle;

  await youtube.videos.update({
    part: 'snippet',
    requestBody: {
      id: videoId,
      snippet,
    },
  });

  console.log('Done!');
});
