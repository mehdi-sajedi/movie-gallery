import styles from './CreditsItem.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreditsItem = ({
  id,
  profile_path,
  name,
  total_episode_count,
  work,
  creditType,
}) => {
  const { hideEpisodes } = useSelector((state) => state.show);

  return (
    <li className={styles.person}>
      <Link to={`/person/${id}`}>
        <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w132_and_h132_face${profile_path}`}
          alt=""
        />
      </Link>
      <div className={styles.personInfo}>
        <Link to={`/person/${id}`}>
          <h3>{name}</h3>
        </Link>
        <p>
          {creditType === 'cast' ? work.character : work.job}{' '}
          <span className={hideEpisodes ? styles.hide : ''}>
            ({total_episode_count} episodes)
          </span>
        </p>
      </div>
    </li>
  );
};

export default CreditsItem;
