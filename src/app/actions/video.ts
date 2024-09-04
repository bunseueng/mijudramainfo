export async function getYoutubeVideo() {
    const apiKey = process.env.YOUTUBE_API_KEY
    const channelId = process.env.YOUTUBE_CHANNEL_ID
    const apiURL = process.env.YOUTUBE_API_URL
    try {
        const data = await fetch(
            `${apiURL}?key=${apiKey}&channelId=${channelId}&order=date&part=snippet`
        )

        if(!data.ok) {
            throw Error ("Failed to fetch videos")
        }
        return  data.json()
    } catch (error){
        throw new Error("An error occured while fetching the videos")
    }
}