 const API_KEY = 'AIzaSyDXjze9vKCpEdsLqVXoPfTvbfhoaUK7Dlo'

export async function getYouTubeVideoDetails(youtubeUrl) {
  try {
    let videoId = null;

    // Handle long YouTube URLs
    if (youtubeUrl.includes('youtube.com')) {
      const urlParams = new URLSearchParams(new URL(youtubeUrl).search);
      videoId = urlParams.get('v');
    } 
    // Handle short YouTube URLs (e.g., youtu.be)
    else if (youtubeUrl.includes('youtu.be')) {
      const urlObj = new URL(youtubeUrl);
      videoId = urlObj.pathname.slice(1); // Extract video ID from path
    }

    // If no valid video ID is found
    if (!videoId) {
      console.error('Invalid YouTube video URL');
      return null;
    }

    // Fetch video details from the YouTube API
    const API_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,recordingDetails&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok || !data.items || data.items.length === 0) {
      console.error('Error fetching video details:', data.error || 'No data');
      return { embedUrl: `https://www.youtube.com/embed/${videoId}` };
    }

    // Extract video details
    const video = data.items[0];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      location: video.recordingDetails?.location?.country || 'Unknown', // Fetch country if available
    };
  } catch (error) {
    console.error('Error processing YouTube URL:', error);
    return null;
  }
}
