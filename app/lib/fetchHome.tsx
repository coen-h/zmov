"use server";

export default async function fetchHome() {
  const apiKey = process.env.API_KEY;

  const responseHome1 = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&include_adult=false`, { next: { revalidate: 86400 } });
  const responseHome2 = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&include_adult=false`, { next: { revalidate: 86400 } });
  const responseHome3 = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc&include_adult=false`, { next: { revalidate: 86400 } });
  const responseHome4 = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=vote_count.desc&include_adult=false`, { next: { revalidate: 86400 } });
  const responseHomeAnime = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&with_keywords=210024&include_adult=false`, { next: { revalidate: 86400 } });

  const dataHome1 = await responseHome1.json();
  const dataHome2 = await responseHome2.json();
  const dataHome3 = await responseHome3.json();
  const dataHome4 = await responseHome4.json();
  const dataHomeAnime = await responseHomeAnime.json();

  return [
    { title: 'Trending Movies', data: dataHome1.results },
    { title: 'Trending TV', data: dataHome2.results },
    { title: 'Trending Anime', data: dataHomeAnime.results },
    { title: 'Popular Movies', data: dataHome3.results },
    { title: 'Popular TV', data: dataHome4.results },
  ];
}