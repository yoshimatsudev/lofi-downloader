
const baseUrl = 'https://search-api.artlist.io/v2/graphql'

async function createSongsObjects(songs) {
    const songList = []
    let totalLength = 0
    songs.forEach(async (val) => {
      totalLength += val.durationTime
      songList.push({ url: val.sitePlayableFilePath, name: val.songName,
        genres: val.genreCategories, duration: val.duration,
        durationTime: val.durationTime, isVocal: val.isVocal,
        explicit: val.explicir, artist: val.artistName, album: val.albumName })
      })
  
    return songList
  
  }

async function fetchSongs(currentPage, pageSearchLimit, searchQuantity, songs = []) {
    if (currentPage > pageSearchLimit) {
      return songs
    }
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"query":"query SongList($page: Int!, $songSortType: SongSortType!, $take: Int!, $vocalType: VocalType!, $bpmMax: Int, $bpmMin: Int, $durationMax: Int, $durationMin: Int, $excludedCategoryIds: [Int], $categoryIds: [Int], $searchTerm: String) { songList(page: $page, songSortType: $songSortType, take: $take, vocalType: $vocalType, bpmMax: $bpmMax, bpmMin: $bpmMin, durationMax: $durationMax, durationMin: $durationMin, excludedCategoryIds: $excludedCategoryIds, categoryIds: $categoryIds, searchTerm: $searchTerm) { songs { albumThumbFilePath albumImageFilePath albumId albumName albumNameForURL artistId artistName duration durationTime explicit featuredArtists isOriginal isNew isVocal lyrics MP3FilePath nameForURL primaryArtists assetTypeId sitePlayableFilePath songName songId waveSurferFilePath numberOfStems isPreRelease officialReleaseDate genreCategories { id name parentName } hook30End hook30Start versions { albumThumbFilePath albumImageFilePath albumId albumName albumNameForURL artistId artistName duration durationTime explicit featuredArtists isOriginal isNew isPreRelease officialReleaseDate isVocal lyrics MP3FilePath nameForURL primaryArtists assetTypeId sitePlayableFilePath songName songId waveSurferFilePath genreCategories { id name parentName } } } totalResults }}","variables":{"isAuthenticated":false,"searchTerm":"","typeId":1,"take":${searchQuantity},"page":${currentPage},"songSortType":"STAFF_PICKS","vocalType":"VOCAL_AND_INSTRUMENTS","categoryIds":[549],"excludedCategoryIds":[]}}`
    };

    // console.log
  
    const result = await fetch(baseUrl, options)
    const resultBody = await result.json()

    console.log(resultBody)
  
    resultBody.data?.songList.songs.forEach((val) => {
      songs.push(val)
    })
  
    return fetchSongs(++currentPage, pageSearchLimit, searchQuantity, songs)
  
  }

(async () => {
  const songsRawData = await fetchSongs(1, 20, 50);
  const songs = await createSongsObjects(songsRawData)

  // for (let i = 1; i < 10)

  // console.log(songs)
  
  await Bun.write("metadata/test.json", JSON.stringify(songs))
})();