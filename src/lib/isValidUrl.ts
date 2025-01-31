function isValidUrl(url: string | undefined) {
    try {
      if (!url) return false;
      const parsedUrl = new URL(url);
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }