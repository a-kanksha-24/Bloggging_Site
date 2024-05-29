import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

// import author from '../assets/author.jpg'
// import av2 from '../assets/av2.jpg'
// import av3 from '../assets/av3.jpg'
// import av4 from '../assets/av4.jpg'
// import av5 from '../assets/av5.jpg'
// const authorsData=[
//   {id: 1, avatar: author, name : 'Arpan', posts: 3},
//   {id: 2, avatar: av2, name : 'Aryan', posts: 5},
//   {id: 3, avatar: av3, name : 'Aman', posts: 2},
//   {id: 4, avatar: av4, name : 'Ayan', posts: 1},
//   {id: 5, avatar: av5, name : 'Ahan', posts: 8},
// ]
const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`
        );
        setAuthors(response.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    getAuthors();
  }, []);

  if(isLoading){
    return <Loader/>
  }
  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id:id, avatar, name, posts }) => {
            return (
              <Link key={id} to={`/posts/users/${id}`} className="author">
                <div className="author__avatar">
                  <img
                    src={`${process.env.REACT_APP_ASSESTS_URL}/uploads/${avatar}`}
                    alt={`Image of ${name}`}
                  />
                </div>
                <div className="author__info">
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No authors found</h2>
      )}
    </section>
  );
};

export default Authors;
