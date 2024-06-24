const https = require('https');
const fs = require('fs');

const baseUrl = 'https://search-api.artlist.io/v2/graphql'

async function fetchSongs(currentPage, pageSearchLimit, searchQuantity, songs = []) {
  if (currentPage > pageSearchLimit) {
    return songs
  }
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{"query":"query SongList($page: Int!, $songSortType: SongSortType!, $take: Int!, $vocalType: VocalType!, $bpmMax: Int, $bpmMin: Int, $durationMax: Int, $durationMin: Int, $excludedCategoryIds: [Int], $categoryIds: [Int]) {  songList(    page: $page    songSortType: $songSortType    take: $take    vocalType: $vocalType    bpmMax: $bpmMax    bpmMin: $bpmMin    durationMax: $durationMax    durationMin: $durationMin    excludedCategoryIds: $excludedCategoryIds    categoryIds: $categoryIds  ) {    songs {      albumThumbFilePath      albumImageFilePath      albumId      albumName      albumNameForURL      artistId      artistName      duration      durationTime      explicit      featuredArtists      isOriginal      isNew      isVocal      lyrics      MP3FilePath      nameForURL      primaryArtists      assetTypeId      sitePlayableFilePath      songName      songId      waveSurferFilePath      numberOfStems      isPreRelease      officialReleaseDate      genreCategories {        id        name        parentName      }      hook30End      hook30Start      versions {        albumThumbFilePath        albumImageFilePath        albumId        albumName        albumNameForURL        artistId        artistName        duration        durationTime        explicit        featuredArtists        isOriginal        isNew        isPreRelease        officialReleaseDate        isVocal        lyrics        MP3FilePath        nameForURL        primaryArtists        assetTypeId        sitePlayableFilePath        songName        songId        waveSurferFilePath        genreCategories {          id          name          parentName        }      }    }    totalResults  }}","variables":{"isAuthenticated":false,"searchTerm":"","typeId":1,"take":${searchQuantity},"page":${currentPage},"songSortType":"STAFF_PICKS","vocalType":"VOCAL_AND_INSTRUMENTS","categoryIds":[549],"excludedCategoryIds":[]}}`
  };

  const result = await fetch(baseUrl, options)
  const resultBody = await result.json()

  resultBody.data.songList.songs.forEach((val) => {
    songs.push(val)
  })

  return fetchSongs(++currentPage, pageSearchLimit, searchQuantity, songs)

}

async function createSongsObjects(songs) {
  const songList = []
  songs.forEach(async (val) => {
    songList.push({ url: val.sitePlayableFilePath, name: val.songName,
      genres: val.genreCategories, duration: val.duration,
      durationTime: val.durationTime, isVocal: val.isVocal,
      explicit: val.explicir, artist: val.artistName, album: val.albumName })
    })

  const songsFinalUrls = []

  // TODO need to create a promise solution to return the final song object with the actual playable files url - available in the response after redirected from the current songObj.url
  songList.forEach(async (songObj) => {
    const result = await fetch(songObj.url)
    songsFinalUrls.push(result.url)
  })

  // console.log(finalSongList)


  return {songList, songsFinalUrls}

}

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
  songs.map(test => console.log(test))

  songs.forEach(song => {
    // console.log(song.url)
    let urlObj = new URL(song.url);
    let parts = urlObj.pathname.split("/");
    let filename = parts[parts.length - 1];
    requests.push(download(url, `${filename}`));
  })
  return requests;
};


(async () => {
  const songsRawData = await fetchSongs(1, 3, 30);
  const songs = await createSongsObjects(songsRawData)




  console.log(songs)

  // try {
  //   const requests = createDownloadRequests(songs);
  //   await Promise.all(requests);
  // } catch (err) {
  //   console.log(err);
  // }
})();

