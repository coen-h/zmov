"use server";

export default async function fetchEpisodes(id: number, season_number: number) {
  const apiKey = process.env.API_KEY;

  const responseEpisodes = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${apiKey}`, { next: { revalidate: 3600 } });
  const dataEpisodes = await responseEpisodes.json();

  return dataEpisodes;
}