import React, { Component } from "react";
import { Card, Button, Grid } from "semantic-ui-react";

import factory from "../ethereum/factory";
import { Link } from "../src/routes";
import styles from "./campaigns/show.css.js";

const fetch = require("node-fetch");

let num_campaigns = 10;

class CampaignIndex extends Component {
  static async getInitialProps() {
    let test = {};

    let headers = {
      num_entities: num_campaigns
    };

    await fetch("https://backable-db.herokuapp.com/api/v1/get-campaigns", {
      method: "GET",
      headers: headers
    })
      .then(response => {
        return response.json();
      }) // change to return response.text()
      .then(data => {
        test = data;
      });

    let campaign_array = [];
    let campaign_addresses = Object.keys(test);

    campaign_addresses.forEach(function(key) {
      test[key]["campaign_address"] = key;
      campaign_array.push(test[key]);
    });

    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns, test, campaign_addresses, campaign_array };
  }

  createLink(eth_address) {
    return "https://rinkeby.etherscan.io/address/" + eth_address;
  }

  renderCampaigns() {
    const card = this.props.campaign_array.map(campaign => ({
      image: campaign["image_url"],
      header: campaign["title"],
      extra: campaign["campaign_address"],
      link: "",

      description: (
        <div>
          <p>{campaign["campaign_subheader"]}</p>
          <Link route={`/campaigns/${campaign["campaign_address"]}`}>
            <Button
              style={{ margin: "3px" }}
              content="View Campaign"
              inverted
              circular
              color="violet"
              fluid
            />
          </Link>
        </div>
      ),
      fluid: true,
      raised: true
      // link: true
    }));
    return <Card.Group items={card} />;
  }

  render() {
    return (
      <Grid centered>
        <Grid.Row center aligned verticalAlign="bottom">
          <Grid.Column mobile={12} computer={8}>
            <h3>Open Campaigns</h3>
            {this.renderCampaigns()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default CampaignIndex;
