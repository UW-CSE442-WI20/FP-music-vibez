const React = require("react");

class AlbumComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <img src={this.props.albumArt} alt="Artist" className="album" />
      </div>
    );
  }
}

module.exports = AlbumComponent;
