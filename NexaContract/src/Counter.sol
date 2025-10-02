// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract NexaPoll {
    struct Poll {
        string question;
        string[] options;
        mapping(uint256 => uint256) votes; // option index to vote count
        uint256 totalVotes;
    }

    mapping(uint256 => Poll) public polls;
    uint256 public pollCount;

    event PollCreated(uint256 indexed pollId, string question, string[] options);
    event Voted(uint256 indexed pollId, uint256 optionIndex, address voter);

    function createPoll(string memory question, string[] memory options) public {
        require(options.length > 0, "Poll must have at least one option");
        
        Poll storage newPoll = polls[pollCount];
        newPoll.question = question;
        newPoll.options = options;
        newPoll.totalVotes = 0;

        emit PollCreated(pollCount, question, options);
        pollCount++;
    }

    function vote(uint256 pollId, uint256 optionIndex) public {
        require(pollId < pollCount, "Poll does not exist");
        require(optionIndex < polls[pollId].options.length, "Invalid option index");

        polls[pollId].votes[optionIndex]++;
        polls[pollId].totalVotes++;

        emit Voted(pollId, optionIndex, msg.sender);
    }

    function getPoll(uint256 pollId) public view returns (string memory question, string[] memory options, uint256 totalVotes) {
        require(pollId < pollCount, "Poll does not exist");

        Poll storage poll = polls[pollId];
        return (poll.question, poll.options, poll.totalVotes);
    }

    function getVotes(uint256 pollId, uint256 optionIndex) public view returns (uint256) {
        require(pollId < pollCount, "Poll does not exist");
        require(optionIndex < polls[pollId].options.length, "Invalid option index");

        return polls[pollId].votes[optionIndex];
    }
}
