const React = require("react");

class YearComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        {this.props.year}
      </div>
    );
  }
}

module.exports = YearComponent;
