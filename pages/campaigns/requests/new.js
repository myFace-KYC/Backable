import React, { Component, Fragment } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';

import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../src/routes';

function validate(description,value,recipient){
    return{
      description: description.length === 0,
      value: value.length === 0,
      recipient: recipient.length === 0,
    };
  }


class RequestNew extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    loading: false,
    errorMessage: 'Invalid fields.',
    data_eth_conv_rate: 0,
    descriptionError: false,
    recipientError:false,
    valueError: false,
    formError:false
  };

  componentDidMount() {
    fetch("https://api.coinmarketcap.com/v2/ticker/1027/?convert=SGD", {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          data_eth_conv_rate: data["data"]["quotes"]["SGD"]["price"]
          // conv_value : toString(parseFloat(value)/data_eth_conv_rate) ,
        });
      });
  }

  calculateEther(val) {
    var val_in_ether;
    if (val == "") {
      val_in_ether = 0;
    } 
    else {
      val_in_ether =
        parseFloat(val) / this.state.data_eth_conv_rate;
    }
    return val_in_ether;
  }


  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();
    let error = false;
    if(this.state.description===''){
      this.setState({descriptionError:true})
      error=true
    }else{
      this.setState({descriptionError:false})
    }
    if(this.state.value ==='0'){
      this.setState({valueError:true})
      error=true
    }else{
      this.setState({valueError:false})
    }
    if(web3.utils.isAddress(this.state.recipient)){
      this.setState({recipientError:false})
    }else{
      this.setState({recipientError:true})
      error=true
    }

    if(error){
      this.setState({formError:true})
      return
    }else{
      this.setState({formError:false})
    }

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, this.calculateEther(this.state.value), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const errors = validate(this.state.description,
      this.state.value, this.state.recipient);
    const isEnabled = !Object.keys(errors).some(x=>errors[x]);
    return (
      <Fragment>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={this.state.formError}>
          <Form.Field>
            <Form.Input
              required={true}
              label = "Description"
              placeholder = "Enter a request"
              error={this.state.descriptionError}
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <Form.Input
              required={true}
              label = "Value"
              type = "number"
              placeholder = "Enter an amount"
              error={this.state.valueError}
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              label="SGD"
              labelPosition="right"
            />
          </Form.Field>
          <p>Converts to {this.calculateEther(this.state.value).toFixed(6)} ETH</p>

          <Form.Field required>
            <Form.Input
              required={true}
              label = "Recipient"
              placeholder = "Enter recipient address"
              error={this.state.recipientError}
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button disabled={!isEnabled} primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Fragment>
    );
  }
}

export default RequestNew;
