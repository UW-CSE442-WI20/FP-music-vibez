const React = require("react");

class DateComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <h5> Released {this.props.date} </h5>
      </div>
    );
  }
}

module.exports = DateComponent;
