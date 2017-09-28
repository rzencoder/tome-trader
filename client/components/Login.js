//Requirements
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, register } from '../actions/auth';

function mapStateToProps (state) {
  return { user: state.user };
}

function mapDispatchToProps (dispatch) {
  return { login: bindActionCreators(login, dispatch),
           register: bindActionCreators(register, dispatch),
         };
}

//Login and Register Component
class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			usernameReg: '',
			passwordReg: '',
			confirmPassword: '',
			type: '',
			message: ''
		}
		this.handleInput = this.handleInput.bind(this);
		this.submitLogin = this.submitLogin.bind(this);
		this.submitRegister = this.submitRegister.bind(this);
	}

	handleInput (e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	submitLogin () {
		this.setState({type: '', message: ''});
		if (this.state.username && this.state.password) {
			let data = {
				username: this.state.username,
				password: this.state.password,
			}
			this.props.login(data);
			this.setState({type: 'login', message: ''});
		} else {
			   this.setState({type: 'login', message: 'Please complete all Fields'});
		}
	}

	submitRegister () {
		this.setState({type: '', message: ''});
		if (this.state.usernameReg && this.state.passwordReg && this.state.confirmPassword) {
			let data = {
				username: this.state.usernameReg,
				password: this.state.passwordReg,
				confirmPassword: this.state.confirmPassword
			};
			this.props.register(data);
			this.setState({type: 'register', message: ''});
		} else {
			this.setState({type: 'register', message: 'Please complete all Fields'});
		}
	}

	render () {
		return (
			<div className="login-container">
				<div className="register">
					<h1 className="login-headings">New User</h1>
					<h3>Register</h3>
					{this.props.user.errorMessage && this.state.type === "register" ?
						<div className="error-message">{this.props.user.errorMessage}</div>
						: '' }
					{this.state.message && this.state.type === "register" ?
						<div className="error-message">{this.state.message}</div>
						: '' }
					<input className="form-control" type='text' name="usernameReg" placeholder='Enter Username'
        					value = {this.state.usernameReg}
        					onChange = {this.handleInput}
					>
					</input><br/>
          <div>Password needs to be at least six characters long</div>
					<input className="form-control" type='password' name="passwordReg" placeholder='Password'
        					value = {this.state.passwordReg}
        					onChange = {this.handleInput}
					>
					</input><br/>
					<input className="form-control" type='password' name="confirmPassword" placeholder='Confirm Password'
        					value = {this.state.confirmPassword}
        					onChange = {this.handleInput}
					>
					</input><br/>
					<button className="btn btn-submit" type="submit" onClick={this.submitRegister}>Submit</button>
				</div>

				<div className="login">
					<h1 className="login-headings">Returning</h1>
					<h3>Login</h3>
						{this.props.user.errorMessage && this.state.type === "login" ?
							<div className="error-message">{this.props.user.errorMessage}</div>
							: '' }
						{this.state.message && this.state.type === "login" ?
							<div className="error-message">{this.state.message}</div>
							: '' }
						<input className="form-control" type='text' name="username" placeholder='Enter Username'
									 value = {this.state.username}
									 onChange = {this.handleInput}
						>
						</input><br/>
						<input className="form-control" type='password' name="password" placeholder='Password'
									 value = {this.state.password}
									 onChange = {this.handleInput}
						>
						</input><br/>
						<button className="btn btn-submit" type="submit" onClick = {this.submitLogin}>Submit</button>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
