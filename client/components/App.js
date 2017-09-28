//Requirements
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return { user: state.user };
}

//Main App Component
class App extends Component {
	constructor (props) {
		super(props);
    //Open state controls opening of navbar menu on mobile
		this.state = {
			open: false
		};
		this.handleOpenMenu = this.handleOpenMenu.bind(this);
	}

	handleOpenMenu () {
		this.setState({
			open: !this.state.open
		});
	}

	render () {
		return (
			<div>
				<div className="header">
					<div className="header-container">
						<ul className={`nav ${this.state.open ? 'header-mobile' : '' }`}>
							<Link to="/"><h1>TOME TRADER</h1></Link>
              <Link to="/about">About</Link>
							<Link to="/books">Books</Link>
							{this.props.user.isAuthenticated ? <Link to="/profile">Profile</Link> : <Link to="/login">Login</Link> }
							<a className="icon" onClick={this.handleOpenMenu}>&#9776;</a>
						</ul>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
}

export default connect(mapStateToProps)(App);
