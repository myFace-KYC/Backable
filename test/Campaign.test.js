const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

describe("Inbox", async () => {
  let accounts;
  let factory;
  let campaignAddress;
  let campaign;

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode })
      .send({ from: accounts[0], gas: "1000000" });

    await factory.methods.createCampaign("100").send({
      from: accounts[0],
      gas: "1000000"
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
      JSON.parse(compiledCampaign.interface),
      campaignAddress
    );
  });

  it("Deploy campaign factory and campaign", () => {
    expect(factory.options.address).toBeTruthy();
    expect(campaign.options.address).toBeTruthy();
  });

  it("Check that campaign creator gets marked as manager", async () => {
    const manager = await campaign.methods.manager().call();
    expect(accounts[0]).toEqual(manager);
  });

  it("Check if backers can contribute and become request approvers", async () => {
    await campaign.methods.contribute().send({
      value: "10",
      from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    expect(isContributor).toBeTruthy();
  });

  it("Checks if pledge follows minimum contribution limit", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1]
      });
      dd;
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("Allow campaigner to make request", async () => {
    await campaign.methods
      .createRequest("Buy materials", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000"
      });
    const request = await campaign.methods.requests(0).call();

    expect(request.description).toEqual("Buy materials");
  });

  it("Checks for successful campaign contribution, request creation and approval", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("10", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
