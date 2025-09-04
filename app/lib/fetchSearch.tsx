"use server";

export default async function fetchSearch(query: string, type: string) {
  const apiKey = process.env.API_KEY;

  const responseSearch = await fetch(`https://api.themoviedb.org/3/search/${type}?query=${query}&api_key=${apiKey}&include_adult=false`, { next: { revalidate: 3600 } });
  const dataSearch = await responseSearch.json();

  return dataSearch;
}