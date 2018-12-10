pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    // ++ Event to broadcast contract address to javascript
    event returnCampaignAddress(
        address _address

    );

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
        // ++ Emit event `
        emit returnCampaignAddress(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    

    // ++ Maintain a list of approver addresses
    address[] public approversList;


    modifier restricted() {
    /* 
    Modifier function that can be used on functions
    Such that the function can only be called by the manager 
    */
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }


    function contribute() public payable {
        
        require(msg.value > minimumContribution);


        if (approvers[msg.sender]){

        } else {
            // Add contributer to approvers
            approvers[msg.sender] = true;
            approversCount++;
            // ++ Push contributer address to approversList
            approversList.push(msg.sender);

        }
        // Add contributer to approvers
        // ++ Push contributer address to approversList 
        
    }

    // function contribute() public payable {
        
    //     require(msg.value > minimumContribution);

    //     // Add contributer to approvers
    //     approvers[msg.sender] = true;
    //     approversCount++;

    //     // ++ Push contributer address to approversList 
    //     approversList.push(msg.sender);
    // }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address, address[]
      ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager,
          approversList
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}           