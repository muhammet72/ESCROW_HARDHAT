// SPDX-License-Identifier: MIT
// pragma solidity 0.8.17;

// contract Escrow {
// 	address public arbiter;
// 	address public beneficiary;
// 	address public depositor;

// 	bool public isApproved;

// 	constructor(address _arbiter, address _beneficiary) payable {
// 		arbiter = _arbiter;
// 		beneficiary = _beneficiary;
// 		depositor = msg.sender;
// 	}

// 	event Approved(uint);

// 	function approve() external {
// 		require(msg.sender == arbiter);
// 		uint balance = address(this).balance;
// 		(bool sent, ) = payable(beneficiary).call{value: balance}("");
//  		require(sent, "Failed to send Ether");
// 		emit Approved(balance);
// 		isApproved = true;
// 	}
// }

pragma solidity 0.8.17;

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    bool public isApproved;
    struct Deployed {
        address arbiter;
        address beneficiary;
        address depositor;
        bool isApproved;
        uint value;
    }
    mapping(address => Deployed[]) public allDeployed;

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }

    event Approved(uint);

    function approve() external {
        require(msg.sender == arbiter);
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
        allDeployed[address(this)].push(
            Deployed(arbiter, beneficiary, depositor, isApproved, balance)
        );
    }

    function getAllInstances() external view returns (Deployed[] memory) {
        return allDeployed[address(this)];
    }
}
