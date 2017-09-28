//Requirements
import React from 'react';
import { Link } from 'react-router';
import homeimg from '../styles/img/book-home.png';

//Home Page Component
const Home = () => {
	return (
		<div className="home">
			<div className="home-main-container">
				<div className="home-title-container">
					<h1 className="home-title">What will<br/>you discover</h1>
					<img className="mob-home-image" src={homeimg} alt="books"/>
					<h3>Search thousands of books and trade with friends to find that perfect read</h3>
					<Link to="/login"><button className="btn btn-action home-btn">Get Started</button></Link>
				</div>
				<img className="home-image" src={homeimg} alt="books"/>
			</div>
			<div className="home-content">
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Home;
