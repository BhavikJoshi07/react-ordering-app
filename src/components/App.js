import React from 'react';

// Import Components
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';

class App extends React.Component {
	constructor() {
		super();

		this.addFish = this.addFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);

		this.state = {
			fishes: {},
			order: {}
		};
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
				<Order fishes={this.state.fishes} order={this.state.order} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
			</div>
		)
	}
}

export default App;