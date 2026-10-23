/**
 * YouTube Data API v3 Live Integration Service for Creatorly
 */

export interface YouTubeChannelStats {
  channelId: string;
  title: string;
  customUrl: string;
  avatarUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyCYgCCQWKATYDfFYyA1z5rBgMCnGbT89N4';

/**
 * Fetch verified real-time YouTube Channel metrics by handle, channel ID, or username.
 */
export async function fetchYouTubeChannelStats(channelInput: string): Promise<YouTubeChannelStats | null> {
  if (!channelInput || !channelInput.trim()) return null;

  // Clean the input (extract from full URL or strip leading @)
  let cleanInput = channelInput.trim();
  let directChannelId: string | null = null;

  try {
    // A. Check if the user passed a video URL (e.g. watch?v=... or youtu.be/... or shorts/...)
    let videoId: string | null = null;
    if (cleanInput.includes('watch?v=')) {
      videoId = cleanInput.split('watch?v=')[1].split('&')[0].split('#')[0];
    } else if (cleanInput.includes('youtu.be/')) {
      videoId = cleanInput.split('youtu.be/')[1].split('?')[0].split('#')[0].split('/')[0];
    } else if (cleanInput.includes('youtube.com/shorts/')) {
      videoId = cleanInput.split('youtube.com/shorts/')[1].split('?')[0].split('#')[0].split('/')[0];
    }

    if (videoId) {
      const vidRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${YOUTUBE_API_KEY}`);
      const vidData = await vidRes.json();
      if (vidData.items && vidData.items.length > 0) {
        directChannelId = vidData.items[0].snippet.channelId;
      }
    }

    // B. Clean handle / channel URL if not a video
    if (!directChannelId) {
      if (cleanInput.includes('youtube.com/@')) {
        cleanInput = cleanInput.split('youtube.com/@')[1].split('/')[0].split('?')[0];
      } else if (cleanInput.includes('youtube.com/channel/')) {
        directChannelId = cleanInput.split('youtube.com/channel/')[1].split('/')[0].split('?')[0];
      }
      cleanInput = cleanInput.replace(/^@/, '');
    }

    // 1. Direct channel ID query (if extracted from video or channel/ URL)
    let data: any = { items: [] };
    if (directChannelId) {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${encodeURIComponent(directChannelId)}&key=${YOUTUBE_API_KEY}`);
      data = await res.json();
    }

    // 2. Query by handle (@handle)
    if ((!data.items || data.items.length === 0) && cleanInput) {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(cleanInput)}&key=${YOUTUBE_API_KEY}`);
      data = await res.json();
    }

    // 3. Query as raw channel ID
    if ((!data.items || data.items.length === 0) && cleanInput) {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${encodeURIComponent(cleanInput)}&key=${YOUTUBE_API_KEY}`);
      data = await res.json();
    }

    // 4. Query by legacy username
    if ((!data.items || data.items.length === 0) && cleanInput) {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${encodeURIComponent(cleanInput)}&key=${YOUTUBE_API_KEY}`);
      data = await res.json();
    }

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const stats = item.statistics;
      const snippet = item.snippet;

      return {
        channelId: item.id,
        title: snippet.title || cleanInput,
        customUrl: snippet.customUrl || `@${cleanInput}`,
        avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
        subscriberCount: parseInt(stats.subscriberCount || '0', 10),
        viewCount: parseInt(stats.viewCount || '0', 10),
        videoCount: parseInt(stats.videoCount || '0', 10)
      };
    }

    if (data.error) {
      console.warn('[YouTube API Error]', data.error.message);
    }

    return null;
  } catch (err) {
    console.warn('[YouTube API] Network exception fetching channel:', err);
    return null;
  }
}
