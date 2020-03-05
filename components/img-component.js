const React = require("react");

class ImgComponent extends React.Component {

	constructor(props) {
  		super(props);
  
  		//this.changePropsColor = this.changePropsColor.bind(this);
	}

	render() {
		const { hasError, idyll, updateProps, ...props } = this.props;
		//console.log(this.props.artistName);
		//console.log(this.props.iconicImage);

		return (
		  <div {...props}>
		  		<p>{this.props.artistName}</p>
		      <img src={this.props.iconicImage} alt='Artist' class='img-button' />
		  </div>
		);
	}
}

module.exports = ImgComponent;