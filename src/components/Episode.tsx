import { Link } from 'react-router-dom';

import EpisodeT from '@/types/Episode';

interface EpisodeProps extends EpisodeT {
  id: number;
  season: number;
  maxEpisodes: number;
}

export default function Episode({ id, season, number, image, title, description, runtime, maxEpisodes }: EpisodeProps) {
  function getLength(runtime: number) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (!hours) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }

  return (
    <Link className="episode" to={`/watch/${id}?s=${season}&e=${number}&me=${maxEpisodes}`}>
      <h2 className="episode-number">{number}</h2>

      <img className="episode-image" src={image} alt="" />

      <div className="episode-text">
        <div className="episode-row">
          <h4 className="episode-title">{title}</h4>

          <span className="episode-runtime">{getLength(runtime)}</span>
        </div>

        {description && <p className="episode-description">{description}</p>}
      </div>
    </Link>
  );
}
