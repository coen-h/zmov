import MediaType from './MediaType';

export default interface Hero {
  id: number;
  type: MediaType;
  title: string;
  description: string;
  images: {
    logo: string;
    backdrop: string;
  };
}
