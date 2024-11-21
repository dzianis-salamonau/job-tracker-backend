export function corsMiddleware(req, res) {
    const allowedOrigin = process.env.ALLOWED_ORIGIN;
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers', 
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return true;
    }
  
    return false;
  }