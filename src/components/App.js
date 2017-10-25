import React from 'react';

// Import Components
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();

		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);

		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {
		// THis will run before rendering App
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});

		// Check if there is already an Order state present
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if (localStorageRef) {
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}

	addFish(fish) {
		// update State (by making copy of initial state)
		const fishes = { ...this.state.fishes };
		// add in the new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes });
	}

	updateFish(key, updatedFish) {
		// update State (by making copy of initial state)
		const fishes = { ...this.state.fishes };
		// add in the updated fish
		fishes[key] = updatedFish;
		// set state
		this.setState({ fishes });
	}

	removeFish(key) {
		// update State (by making copy of initial state)
		const fishes = { ...this.state.fishes };
		// set the fish to be deleted to null
		fishes[key] = null;
		// set state
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		// update State (by making copy of initial state)
		const order = { ...this.state.order };
		// add in the new fish
		order[key] = order[key] + 1 || 1;
		// set state
		this.setState({ order });
	}

	removeFromOrder(key) {
		// update State (by making copy of initial state)
		const order = { ...this.state.order };
		// set the fish to be deleted to null
		delete order[key];
		// set state
		this.setState({ order });
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline='Fresh Seafood Market' />
					<ul className='list-of-fishes'>
						{
							Object.keys(this.state.fishes)
							.map( key => <Fish key={key} index={key} addToOrder={this.addToOrder} details={this.state.fishes[key]} />)
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes} 
					order={this.state.order} 
					params={this.props.params} 
					removeFromOrder={this.removeFromOrder} 
				/>
				<Inventory 
					addFish={this.addFish} 
					loadSamples={this.loadSamples} 
					fishes={this.state.fishes} 
					updateFish={this.updateFish} 
					removeFish={this.removeFish}
					storeId={this.props.params.storeId}
				/>
			</div>
		)
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
};

export default App;