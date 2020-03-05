const React = require("react");

class CustomComponent extends React.Component {
  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    return (

      <div {...props}>
        Hello there!

      </div>
    );
  }
}

module.exports = CustomComponent;
