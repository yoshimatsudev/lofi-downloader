import https from "https"
import fs from "fs"

const download = (url, destPath) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url)
    https.get(response.url, (res) => {
      const filePath = fs.createWriteStream(destPath);
      res.pipe(filePath);
      resolve(true);
    });
  });
};

const createDownloadRequests = (songs) => {
  const requests = [];
  songs.forEach(song => {
    requests.push(download(song.url, `downloaded_songs/${song.name}-${song.album}-${song.artist}-${song.duration}.aac`));
  })
  return requests;
};

export default async function downloadSongs(songsMetadata){
  try {
    const requests = createDownloadRequests(songsMetadata);
    await Promise.all(requests);
  } catch (err) {
    console.log(err);
  }

  return
}
