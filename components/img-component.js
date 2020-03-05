const React = require("react");

class ImgComponent extends React.Component {
  constructor(props) {
    super(props);

    //this.changePropsColor = this.changePropsColor.bind(this);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <img src={this.props.iconicImage} alt="Artist" class="img-button" />
      </div>
    );
  }
}

module.exports = ImgComponent;
