"use server";

export default async function fetchVideo() {
  const apiKey = process.env.API_KEY;

  const responseHero = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false`, { next: { revalidate: 86400 } });
  const dataHero = await responseHero.json();

  const movies = await Promise.all(
    dataHero.results.map(async (movie: { id: number; }) => {
      const responseImage = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=images,videos`, { next: { revalidate: 86400 } });

      const dataImage = await responseImage.json();

      const trailer = dataImage.videos.results.find((video: { type: string, site: string; }) => video.type === "Trailer" && video.site === "YouTube");
      const logo = dataImage.images.logos.find((logo: { iso_639_1: string }) => logo.iso_639_1 === "en");

      return {...movie, trailerKey: trailer ? trailer.key : null, logo: logo ? logo.file_path : null };
    })
  );

  return movies;
}