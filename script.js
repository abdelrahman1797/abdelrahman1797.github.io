async function getJSON(path, fallback = []) {
  try {
    const r = await fetch(`${path}?v=${Date.now()}`, {
      cache: "no-store"
    });

    if (!r.ok) {
      console.warn(`Could not load ${path}: ${r.status}`);
      return fallback;
    }

    return await r.json();
  } catch (error) {
    console.warn(`Could not load ${path}`, error);
    return fallback;
  }
}
