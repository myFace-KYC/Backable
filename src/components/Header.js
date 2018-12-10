import React from "react";
import { Menu, Segment, Button } from "semantic-ui-react";

import { Link } from "../routes";

export default () => {
  return (
    <div
      style={{
        padding: "3px 30px 3px 30px",
        marginBottom: "30px",
        backgroundColor: "black"
      }}
    >
      <Menu inverted style={{ marginTop: "0px" }}>
        <Menu.Item>
          <img src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Link route="/">
          <a className="item">Home</a>
        </Link>
        <Link route="/campaigns/new">
          <Button
            style={{ margin: "5px" }}
            content="Create Campaign"
            icon="add circle"
            inverted
            color="teal"
          />
        </Link>

        <Menu.Menu position="right">
          <Link route={`/my-campaigns`}>
            <a className="item">My Campaigns</a>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  );
};
