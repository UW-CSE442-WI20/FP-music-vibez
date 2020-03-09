const React = require("react");

class ImgComponent extends React.Component {
  constructor(props) {
    super(props);

    //this.changePropsColor = this.changePropsColor.bind(this);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props} class="flex-col">
        <img src={this.props.iconicImage} alt="Artist" class="img-button" />
        <h3 class="artist-name">{this.props.artistName}</h3>
      </div>
    );
  }
}

module.exports = ImgComponent;
