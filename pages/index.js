import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";

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

    // console.log(campaign_array);

    // const campaigns = await factory.methods.getDeployedCampaigns().call();
    // console.log(campaigns);
    return { test, campaign_addresses, campaign_array };
  }

  createLink(eth_address) {
    return "https://rinkeby.etherscan.io/address/" + eth_address;
  }

  renderCampaigns() {
    const card = this.props.campaign_array.map(campaign => ({
      image: campaign["image_url"],
      header: campaign["title"],
      extra: campaign["campaign_address"],
      description: (
        <div>
          <p>{campaign["description"]}</p>
          <p>
            <b>Raising</b> {campaign["goal"]}
          </p>
          <p> By {campaign["creator_name"]}</p>
          <Link route={`/campaigns/${campaign["campaign_address"]}`}>
            <a>
              <Button floated="left" content="View Campaign" primary />
            </a>
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
