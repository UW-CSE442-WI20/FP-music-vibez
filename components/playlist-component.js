const React = require("react");

class AlbumComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <iframe src={this.props.url} 
                width="275" height="380" 
                frameborder="0" 
                allowtransparency="true" 
                allow="encrypted-media"></iframe>
      </div>
    );
  }
}

module.exports = AlbumComponent;
