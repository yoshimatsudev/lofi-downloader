(async () => {
    const songs = await fetchMetadata()
    console.log(songs)
})();