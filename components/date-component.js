const React = require("react");

class DateComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getDate(str) {
    console.log(str);
    var result = "";
    var res = str.split("/");
    var month = parseInt('res', 10);
    result += this.getMonth(month);
    res = str.split("/");
    result += res + ", ";
    res = str.split("/");
    result += res;
    return result;      
  }

  getMonth(month) {
    if(month == 1) {
      return "January ";
    } else if(month == 2) {
      return "February ";
    } else if(month == 3) {
      return "March ";
    } else if(month == 4) {
      return "April ";
    } else if(month == 5) {
      return "May ";
    } else if(month == 6) {
      return "June ";
    } else if(month == 7) {
      return "July ";
    } else if(month == 8) {
      return "August ";
    } else if(month == 9) {
      return "September ";
    } else if(month == 10) {
      return "October ";
    } else if(month == 11) {
      return "November ";
    } else if(month == 12) {
      return "December ";
    }
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <h3> {this.props.date} </h3>
      </div>
    );
  }
}

module.exports = DateComponent;
