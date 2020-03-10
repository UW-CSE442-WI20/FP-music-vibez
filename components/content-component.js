const React = require("react");

class ContentComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <p>{this.props.desc}</p>
      </div>
    );
  }
}

module.exports = ContentComponent;
