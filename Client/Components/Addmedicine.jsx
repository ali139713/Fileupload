import React, { Component } from "react";
import './Addmedicine.css';


class Addmedicine extends Component {
  constructor() {
    super();

    this.state = {
      Name: "",
      Price: "",
      Availability: "",
      Image: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(
      "The form was submitted Successfully with the following data: "
    );
    this.onCustomerSignUp();
  }

  onCustomerSignUp = async () => {
    const { name, email, password } = this.state;
    // const res = await customerAPI.addCustomer({ name, email, password });
    // const res = await axios.post('http://localhost:4000/customer', {
    //     name,
    //     email,
    // });
  };

  render() {
    return (
      <div className="FormCenter">
        <form
          onSubmit={this.handleSubmit}
          className="FormFields"
          onSubmit={this.handleSubmit}
        >
          <div className="FormField">
            <label className="FormField__Label" htmlFor="Name">
              Name
            </label>
            <input
              autoComplete="off"
              type="text"
              id="Name"
              className="FormField__Input"
              placeholder="Enter Name"
              name="Name"
              value={this.state.Name}
              onChange={this.handleChange}
            />
          </div>

          <div className="FormField">
            <label className="FormField__Label" htmlFor="Price">
              Price
            </label>
            <input
              type="text"
              id="Price"
              className="FormField__Input"
              placeholder="Enter Price"
              name="Price"
              value={this.state.Price}
              onChange={this.handleChange}
            />
          </div>
          <div className="FormField">
            <label className="FormField__Label" htmlFor="Availability">
              Availability
            </label>
            <input
              type="text"
              id="Availability"
              className="FormField__Input"
              placeholder="Enter Availability"
              name="Availability"
              value={this.state.Availability}
              onChange={this.handleChange}
            />
          </div>
          <div className="FormField">
            <label className="FormField__Label" htmlFor="Image">
             Image
            </label>
            <input
              type="file"
              id="Image"
              className="FormField__Input"
              placeholder=""
              name="Image"
              value={this.state.Image}
              onChange={this.handleChange}
            />
          </div>

         
        </form>
      </div>
    );
  }
}

export default Addmedicine;
