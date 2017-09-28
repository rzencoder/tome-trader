//Requirements
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkAuth } from '../actions/auth';
import { changeLocation } from '../actions/user';

function mapStateToProps (state) {
  return { user: state.user };
}

function mapDispatchToProps (dispatch) {
  return { changeLocation: bindActionCreators(changeLocation, dispatch),
           checkAuth: bindActionCreators(checkAuth, dispatch)
         };
}

//Account Component to update users location
class Account extends Component {
	constructor (props) {
		super();
		this.state = {
			cityInput: '',
			countryInput: ''
		};
		this.handleCityChange = this.handleCityChange.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.submitlocation = this.submitlocation.bind(this);
	}

  componentWillMount () {
		this.props.checkAuth();
	}

	handleCityChange(e) {
		this.setState({cityInput: e.target.value});
	}

	handleCountryChange(e) {
		this.setState({countryInput: e.target.value});
	}

	submitlocation (e) {
		e.preventDefault();
		this.props.changeLocation({
			"city": this.state.cityInput,
			"country": this.state.countryInput
		})
	}

	render () {

		return (
			<div className="account-container">
				<h1>Account Settings</h1>
        <div className="account-info">
  				<div className="user"><span>Username: </span>{this.props.user.username}</div>
  				<div><span>City: </span>{this.props.user.city}</div>
  				<div><span>Country: </span>{this.props.user.country}</div>
        </div>
				<form onSubmit={this.submitlocation.bind(this)}>
          <h2>Update Location</h2>
					<input className="form-control" type='text' name="city" placeholder="New City"
						value={this.state.cityInput} onChange={this.handleCityChange}></input><br/>
					<input className="form-control" type='text' name="country" placeholder="New Country"
						value={this.state.countryInput} onChange={this.handleCountryChange}></input><br/>
					<button className="btn btn-trade acc-update" type="submit">Update</button>
				</form>
				<Link to="/profile"><button className="btn btn-submit acc-back">Back to Profile</button></Link>
			</div>
		);

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
