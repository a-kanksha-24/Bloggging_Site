import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <ul className='footer__categories'>
        <li><Link to="/posts/category/Agriculture">Agriculture</Link></li>
        <li><Link to="/posts/category/Business">Business</Link></li>
        <li><Link to="/posts/category/Education">Education</Link></li>
        <li><Link to="/posts/category/Entertianment">Entertaiment</Link></li>
        <li><Link to="/posts/category/Art">Art</Link></li>
        <li><Link to="/posts/category/Investment">Investment</Link></li>
        <li><Link to="/posts/category/Uncategorized">Uncategorized</Link></li>
        <li><Link to="/posts/category/Weather">Weather</Link></li>
      </ul>
      <div className='footer__copyright'>
        <small>All Rights Reserved &copy; Copyright, Akanksha Pal.</small>
      </div>
    </footer>
  )
}

export default Footer