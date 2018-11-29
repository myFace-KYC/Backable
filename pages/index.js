import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";

import factory from "../ethereum/factory";
import { Link } from "../src/routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  getCampaignInfo() {
    // The address of the campaign to be sent in the header
    let myheaders = {
      // USE this for when create campaign has been finished
      // "campaign_address":  this.props.address ,

      // This is hardcoded placedholder address, needs to change
      campaign_address: "0xcF01071DB0CAB2CBeE4A8C21BB7638aC1FA1c38c"
    };

    // GET call to Database
    fetch("https://backable-db.herokuapp.com/api/v1/get-campaign", {
      method: "GET",
      headers: myheaders
    })
      .then(response => response.json())
      .then(data => {
        // Update the data state with db values
        this.setState({
          data_campaigner_name: "Jason Bourne",
          data_sub_header: "A short description of your project and what it is",
          data_enddate: "12/31/2018",

          data_title: data["title"],
          data_description: data["description"],
          data_campaigner_address: data["campaigner_address"],
          // data_goal: data["goal"],
          data_goal: "50",
          data_tags: data["tags"],
          data_img: data["image_url"]
        });
        console.log(data);
      });
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => ({
      image: "https://via.placeholder.com/400x270",
      header: "Title of campaign",
      extra: address,
      description: (
        <div>
          <p>A Short description of the campaign and what is it about</p>

          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        </div>
      ),
      fluid: true
    }));

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <div>
        <h3>Open Campaigns</h3>

        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>

        {this.renderCampaigns()}
      </div>
    );
  }
}

export default CampaignIndex;
