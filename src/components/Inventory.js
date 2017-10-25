import React from 'react';
import base from '../base';

import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			uid: null,
			owner: null
		};
	}

	componentDidMount() {
		base.onAuth((user) => {
			if(user) {
				this.authHandler(null, { user });
			}
		});
	}

	authHandler(err, authData) {
		console.log(authData);
		if (err) {
			console.error(err);
			return;
		}

		// Get the Store Data from Firebase
		const storeRef = base.database().ref(this.props.storeId);

		// Query Firebase for Store Data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			// Set Owner in Firebase
			if(!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			// Set Owner in Local State
			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	}

	authenticate(provider) {
		console.log(`Tried to Login with ${provider}`);
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout() {
		base.unauth();
		this.setState({ uid: null });
	}

	handleClick(e, key) {
		const fish = this.props.fishes[key];
		// Take a copy of fish and update it with new values
		const updatedFish = {
			...fish,
			[e.target.name] : e.target.value
		};
		this.props.updateFish(key, updatedFish);
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Please sign in to manage your store's inventory!</p>
				<button className="github" onClick={ () => this.authenticate('github') } >Log In with Github</button>
				<button className="facebook" onClick={ () => this.authenticate('facebook') } >Log In with Facebook</button>
				<button className="twitter" onClick={ () => this.authenticate('twitter') } >Log In with Twitter</button>
			</nav>
		)
	}

	renderInventory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder='Fish Name' onChange={(e) => this.handleClick(e, key)} />
				<input type="text" name="price" value={fish.price} placeholder='Fish Price' onChange={(e) => this.handleClick(e, key)} />
				<select name="status" value={fish.status} onChange={(e) => this.handleClick(e, key)} >
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea name="desc" value={fish.desc} placeholder='Fish Desc' onChange={(e) => this.handleClick(e, key)} ></textarea>
				<input name="image" type="text" value={fish.image} placeholder='Fish Image' onChange={(e) => this.handleClick(e, key)} />
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	}

	render() {
		const logout = <button onClick={ this.logout } >Log Out!</button>

		// Check if no user is Logged In
		if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}

		// Check if Logged In user is not Owner
		if (this.state.uid !== this.state.owner ) {
			return (
				<div>
					<p>Sorry, You aren't the Owner of this Store!</p>
					{logout}
				</div>
			)
		}

		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	updateFish: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired
};

export default Inventory;