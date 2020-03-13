const React = require("react");

class ImgComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props} className="img-component">
        <img src={this.props.iconicImage} alt="Artist" className="img-button" />
        <h4 id="artist-label">{this.props.artistName}</h4>
      </div>
    );
  }
}

module.exports = ImgComponent;
