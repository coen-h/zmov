import Genre from './Genre';
import MediaShort from './MediaShort';

export default interface Media {
  id: number;
  title: string;
  description: string;
  tagline: string | null;
  genres: Genre[];
  date: string;
  rating: number;
  suggested: MediaShort[];
  images: {
    backdrop: string;
    poster: string;
    logo: string;
  };
}
