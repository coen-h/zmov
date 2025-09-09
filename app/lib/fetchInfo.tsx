"use server";

export default async function fetchFile(type: string, id: number) {
  const apiKey = process.env.API_KEY;

  const responseInfo = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=release_dates,content_ratings,images,recommendations,credits,watch/providers,videos`, { next: { revalidate: 86400 } });
  const dataInfo = await responseInfo.json();

  const logo = dataInfo.images.logos.find((logo: { iso_639_1: string }) => logo.iso_639_1 === "en");

  return {...dataInfo, logo: logo ? logo.file_path : null};
}

