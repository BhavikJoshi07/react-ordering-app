import React from 'react';
import { getFunName } from '../helpers'

class StorePicker extends React.Component {

	goToStore(e) {
		e.preventDefault();
		// First, Get the Value of Store Name input field
		const storeID = this.storeInput.value;
		console.log(`Going to ${storeID}`);
		// Second, Go to /store/:storeID
		this.context.router.transitionTo(`store/${storeID}`);
	}

	render() {
		return (
			<form className="store-selector" onSubmit={ (e) => { this.goToStore(e) } }>
				{ /* This is how you Comment in JSX ( Inside the only Parent Element ) */ }
				<h2>Please Enter a Store</h2>
				<input type="text" required placeholder='Store Name' defaultValue={ getFunName() } ref={ (input) => { this.storeInput = input } }/>
				<button type='submit'>Visit Store</button>
			</form>
		)
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;