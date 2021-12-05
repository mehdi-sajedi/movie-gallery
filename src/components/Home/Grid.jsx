import React, { useEffect, useContext } from 'react';
import { AppContext } from '../../context/app-context';
import { useLocation, useSearchParams } from 'react-router-dom';
import MediaCard from './MediaCard';
import _ from 'lodash';
import GridStyles from './Grid.module.scss';

const Grid = ({ url, route }) => {
  const { appState, dispatch } = useContext(AppContext);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getResults = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dispatch({
        type: 'SET-RESULTS',
        payload: {
          results: data.results,
          totalResults: data.total_results,
          route: route,
        },
      });
      console.log(data);
    };

    getResults();
  }, [dispatch, url, route]);

  useEffect(() => {
    const myFunc = async () => {
      const searchQuery = searchParams.get('query');

      const URL_MULTI = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&query=${searchQuery}`;

      if (!searchQuery) return;

      const res = await fetch(URL_MULTI);
      const data = await res.json();
      console.log(data);
      if (data.results.length === 0) return;

      // There is an exact match of the users search input and a person in the results
      const personExactMatch = data.results.find((entry) => {
        if (
          entry.media_type === 'person' &&
          entry.name.toLowerCase() === searchQuery.toLowerCase()
        ) {
          dispatch({
            type: 'SET-SEARCH',
            payload: {
              query: searchQuery,
              person: true,
              personFullName: entry.name,
              id: entry.id,
            },
          });
          return entry;
        }

        return null;
      });

      // User searching for person
      if (personExactMatch || data.results[0].media_type === 'person') {
        const personID = (personExactMatch ? personExactMatch : data.results[0])
          .id;

        // The first result is the person
        if (!personExactMatch) {
          dispatch({
            type: 'SET-SEARCH',
            payload: {
              query: searchQuery,
              person: true,
              personFullName: data.results[0].name,
              id: data.results[0].id,
            },
          });
        }

        const URL_PERSON_ID = `https://api.themoviedb.org/3/person/${personID}/combined_credits?api_key=${process.env.REACT_APP_API_KEY}`;

        const res = await fetch(URL_PERSON_ID);
        const personWork = await res.json();
        console.log(personWork);
        dispatch({ type: 'SET-RESULTS-FROM-SEARCH', payload: personWork.cast });
      }
      // User searching for TV Show/Movie
      else {
        const tvAndMovieResults = data.results.filter(
          (entry) => entry.media_type !== 'person'
        );
        console.log(tvAndMovieResults);
        dispatch({
          type: 'SET-RESULTS-FROM-SEARCH',
          payload: tvAndMovieResults,
        });
        dispatch({
          type: 'SET-SEARCH',
          payload: {
            query: searchQuery,
            person: false,
            personFullName: '',
          },
        });
      }
    };
    if (pathname.includes('search')) {
      myFunc();
    }
  }, [dispatch, pathname, searchParams]);

  return (
    <section className={GridStyles.grid}>
      {appState.results.length > 0 &&
        appState.results.map((entry) => {
          return (
            entry.poster_path && <MediaCard {...entry} key={_.uniqueId()} />
          );
        })}
    </section>
  );
};

export default Grid;