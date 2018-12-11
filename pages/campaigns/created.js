import React, { Component } from "react";
import { Card, Button, Grid, GridRow, GridColumn } from "semantic-ui-react";

// import factory from "../ethereum/factory";
import { Link } from "../../src/routes";
import styles from "./created.css.js";
import web3 from "../../ethereum/web3";
import { Router } from "../../src/routes";

const fetch = require("node-fetch");

let accounts = [];

class CampaignIndex extends Component {
  static async getInitialProps(props) {
    let created_campaign_data = {};
    let created_campaign_array = [];
    let created = false;
    let backed_campaign_data = {};
    let backed_campaign_array = [];
    let backed = false;

    // Get user's ETH address

    await web3.eth.getAccounts().then(address => (accounts = address));

    console.log(accounts);

    // Fetching campaigns CREATED by user

    let headers = {
      campaigner_address: await accounts[0]
    };

    await fetch("https://backable-db.herokuapp.com/api/v1/get-campaigner", {
      method: "GET",
      headers: headers
    })
      .then(response => {
        return response.json();
      }) // change to return response.text()
      .then(data => {
        created_campaign_data = data;
      });

    // console.log(created_campaign_data);

    if (created_campaign_data !== null) {
      created = true;
    }

    if (created === true) {
      let hashes = Object.keys(created_campaign_data);

      console.log(created_campaign_data);

      let campaign_data = {};

      for (const hash of hashes) {
        let headers = {
          campaign_address: created_campaign_data[hash]["campaign_address"]
        };

        await fetch("https://backable-db.herokuapp.com/api/v1/get-campaign", {
          method: "GET",
          headers: headers
        })
          .then(response => {
            return response.json();
          }) // change to return response.text()
          .then(data => {
            campaign_data = data;
          });

        campaign_data["campaign_address"] =
          created_campaign_data[hash]["campaign_address"];
        created_campaign_array.push(await campaign_data);
        console.log(created_campaign_array);
      }
    }

    // Fetching campaigns BACKED by user

    let backed_headers = {
      backer_address: await accounts[0]
    };

    await fetch(
      "https://backable-db.herokuapp.com/api/v1/get-campaigns-by-backer",
      {
        method: "GET",
        headers: backed_headers
      }
    )
      .then(response => {
        return response.json();
      }) // change to return response.text()
      .then(data => {
        backed_campaign_data = data;
      });

    console.log(backed_campaign_data);

    if (backed_campaign_data === null) {
      return { created_campaign_array, backed_campaign_array };
    }

    let backed_hashes = Object.keys(backed_campaign_data);

    let backed_campaign_addresses = [];
    for (const hash of backed_hashes) {
      backed_campaign_addresses.push(
        backed_campaign_data[hash]["campaign_address"]
      );
    }

    backed_campaign_addresses = [...new Set(backed_campaign_addresses)];

    let final_backed_data = {};

    for (const address of backed_campaign_addresses) {
      let headers = {
        campaign_address: address
      };

      await fetch("https://backable-db.herokuapp.com/api/v1/get-campaign", {
        method: "GET",
        headers: headers
      })
        .then(response => {
          return response.json();
        }) // change to return response.text()
        .then(data => {
          final_backed_data = data;
        });

      final_backed_data["campaign_address"] = address;
      backed_campaign_array.push(await final_backed_data);
      console.log(backed_campaign_array);
    }

    return { created_campaign_array, backed_campaign_array };
  }

  static createLink(eth_address) {
    return "https://rinkeby.etherscan.io/address/" + eth_address;
  }

  renderCampaigns(campaign_type) {
    let campaign_array = [];

    if (campaign_type === "backed") {
      campaign_array = this.props.backed_campaign_array;
      if (!campaign_array.length) {
        return <p>You haven't backed any campaigns!</p>;
      }
    } else if (campaign_type === "created") {
      campaign_array = this.props.created_campaign_array;
      if (!campaign_array.length) {
        return <p>You haven't created any campaigns!</p>;
      }
    }

    const card = campaign_array.map(campaign => ({
      image: campaign["image_url"],
      header: campaign["title"],
      extra: campaign["campaign_address"],
      description: (
        <div>
          <p>{campaign["campaign_subheader"]}</p>

          <p> By {campaign["creator_name"]}</p>
          {/*<Link route={`/campaigns/${campaign["campaign_address"]}`}>*/}
          {/*<a>View Campaign</a>*/}
          {/*</Link>*/}
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
      <Grid centered>
        <Grid.Row center aligned verticalAlign="bottom">
          <Grid.Column mobile={12} computer={8}>
            <div>
              <h2>Campaigns You've Created</h2>

              {this.renderCampaigns("created")}

              <h2> Campaigns You've Backed</h2>

              {this.renderCampaigns("backed")}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default CampaignIndex;
