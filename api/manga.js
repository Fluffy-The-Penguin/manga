export default async function handler(req, res) {
  try {
    const { query } = req.query;
    
    let apiUrl = 'https://api.mangadex.org/manga';
    const params = new URLSearchParams();
    
    params.append('includes[]', 'cover_art');
    params.append('includes[]', 'author');
    params.append('contentRating[]', 'safe');
    params.append('contentRating[]', 'suggestive');
    params.append('contentRating[]', 'erotica');
    params.append('order[followedCount]', 'desc');
    params.append('limit', '20');
    
    if (query) {
      params.append('title', query);
      params.append('order[relevance]', 'desc');
    }
    
    const response = await fetch(`${apiUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in MangaDex proxy:', error);
    res.status(500).json({ error: error.message });
  }
}
