import React, { Component, Fragment } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";

import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../src/routes";
import CampaignFactory from "../../ethereum/build/CampaignFactory.json";

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    campaignName: '',
    campaignAddress:'',
    creatorName:'',
    endDate:'',
    campaignerAddress:'',
    campaignDetails: '',
    campaignTarget: '',
    tags:'',
    selectedfile: null,
    image: null,
    errorMessage: '',
    loading: false
  };

  componentDidMount() {
    factory.events.returnCampaignAddress ({
    }, function(error, event){})
      .on('data',(event) => {
        this.setState({campaignAddress: event['returnValues']['_address']});
        console.log("print,", this.state.campaignAddress)
        //console.log("calling...",event['returnValues']['_address']);
      });
  }



  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      const result = await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      const formData = new FormData();
      formData.append('title',JSON.stringify(this.state.campaignName));
      formData.append('campaign_address',JSON.stringify(this.state.campaignAddress));
      formData.append('description',JSON.stringify(this.state.campaignDetails));
      formData.append('goal',JSON.stringify(this.state.campaignTarget));
      formData.append('image',this.state.selectedFile);
      formData.append('tags',JSON.stringify(this.state.tags));
      formData.append('end_date',JSON.stringify(this.state.endDate));
      formData.append('creator_name',JSON.stringify(this.state.creatorName));
      formData.append('campaigner_address',JSON.stringify(accounts[0]));
      for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }
      // PUT call to Database
      const url = "https://backable-db.herokuapp.com/api/v1/new-campaign-submit/";
      fetch(url, {
        method: "PUT",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })



      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
    if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
        }
  }

  render() {
    return (
      <Fragment>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          
          <Form.Field>
            <label>Campaigner Name</label>
            <Input
              value={this.state.creatorName}
              onChange={event =>
                this.setState({ creatorName: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Campaign Name</label>
            <Input
              value={this.state.campaignName}
              onChange={event =>
                this.setState({ campaignName: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Campaign End Date</label>
            <Input
              value={this.state.endDate}
              onChange={event =>
                this.setState({ endDate: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Campaign Photo</label>
            <Input 
            type="file" onChange={this.fileChangedHandler.bind(this)}
            />
            <img id="target" src={this.state.image}/>
          </Form.Field>

          <Form.Field>
            <label>Campaign Details</label>
            <textarea
              value={this.state.campaignDetails}
              onChange={event =>
                this.setState({ campaignDetails: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Tags</label>
            <Input
              value={this.state.tags}
              onChange={event =>
                this.setState({ tags: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Campaign Target</label>
            <Input
              value={this.state.campaignTarget}
              onChange={event =>
                this.setState({ campaignTarget: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Fragment>
    );
  }
}

export default CampaignNew;
