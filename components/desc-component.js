const React = require("react");

class DescComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <h3> {this.props.desc} </h3>
      </div>
    );
  }
}

module.exports = DescComponent;
