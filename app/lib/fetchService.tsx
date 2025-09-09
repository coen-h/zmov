"use server";

export default async function fetchSearch(service: number, page: number) {
  const apiKey = process.env.API_KEY;

  const responseSearch = await fetch(`https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=${service}&api_key=${apiKey}&include_adult=false&page=${page}`, { next: { revalidate: 86400 } });
  const dataSearch = await responseSearch.json();

  return dataSearch;
}