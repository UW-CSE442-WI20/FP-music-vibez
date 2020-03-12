const React = require("react");

class DescComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <p> {this.props.desc} </p>
        <p className="date-class"> Released {this.props.date} </p>
      </div>
    );
  }
}

module.exports = DescComponent;
