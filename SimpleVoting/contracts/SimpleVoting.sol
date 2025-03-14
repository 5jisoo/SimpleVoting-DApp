// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;

contract SimpleVoting {
    struct Proposal {
        string description;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    address public admin;
    WorkflowStatus public workflowStatus;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    uint private winningProposalId;

    modifier onlyAdmin() {
        require(msg.sender == admin, 
            "the caller of this function must be the admin.");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, 
            "the caller of this function must be a registed voter.");
        _;
    }

    modifier onlyDuringVotersRegistration() {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 
            "this function can be called before proposals registration has started");
        _;
    }

    modifier onlyDuringProposalsRegistration() {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 
        "this function can be called only during proposals registration");
        _;
    }

    modifier onlyAfterProposalsRegistration() {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "this function can be called only after proposals registration has ended");
        _;
    }

    modifier onlyDuringVotingSession() {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "this function can be called only during the voting session");
        _;
    }
    
    modifier onlyAfterVotingSession() {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "this function can be called only after the voting session has ended");
        _;
    }

    modifier onlyAfterVotesTallied() {
        require(workflowStatus == WorkflowStatus.VotesTallied, "this function can be called only after votes have been tallied");
        _;
    }

    event VoterRegisteredEvent(address voterAddress);

    event ProposalsRegistrationStartedEvent();

    event ProposalsRegistrationEndedEvent();

    event ProposalRegisteredEvent(uint proposalId);

    event VotingSessionStartedEvent();

    event VotingSessionEndedEvent();

    event VotedEvent(address voter, uint proposalId);

    event VotesTalliedEvent();

    event WorkflowStatusChangeEvent(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    constructor() public {
        admin = msg.sender;
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    function registerVoter(address _voterAddress) public onlyAdmin onlyDuringVotersRegistration{
        require(!voters[_voterAddress].isRegistered, "the voter is already registered");

        voters[_voterAddress].isRegistered = true;
        voters[_voterAddress].hasVoted = false;
        voters[_voterAddress].votedProposalId = 0;

        emit VoterRegisteredEvent(_voterAddress);
    }

    function startProposalsRegistration() public onlyAdmin onlyDuringVotersRegistration {
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        emit ProposalsRegistrationStartedEvent();
        emit WorkflowStatusChangeEvent(WorkflowStatus.RegisteringVoters, workflowStatus);
    }

    function endProposalsRegistration() public onlyAdmin onlyDuringProposalsRegistration {
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        
        emit ProposalsRegistrationEndedEvent();
        emit WorkflowStatusChangeEvent(WorkflowStatus.ProposalsRegistrationStarted, workflowStatus);
    }

    function registerProposal(string memory proposalDescription) public onlyRegisteredVoter onlyDuringProposalsRegistration {
        proposals.push(
            Proposal({
                description: proposalDescription,
                voteCount: 0
            })
        );

        emit ProposalRegisteredEvent(proposals.length - 1);
    }

    function getProposalsNumber() public view returns (uint) {
        return proposals.length;
    }

    function getProposalsDescription(uint index) public view returns (string memory) {
        return proposals[index].description;
    }

    function startVotingSession() public onlyAdmin onlyAfterProposalsRegistration {
        workflowStatus = WorkflowStatus.VotingSessionStarted;

        emit VotingSessionStartedEvent();
        emit WorkflowStatusChangeEvent(WorkflowStatus.ProposalsRegistrationEnded, workflowStatus);
    }

    function endVotingSession() public onlyAdmin onlyDuringVotingSession {
        workflowStatus = WorkflowStatus.VotingSessionEnded;

        emit VotingSessionEndedEvent();
        emit WorkflowStatusChangeEvent(WorkflowStatus.VotingSessionStarted, workflowStatus);
    }

    function vote(uint proposalId) onlyRegisteredVoter onlyDuringVotingSession public {
        require(!voters[msg.sender].hasVoted, "the caller has already voted");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;

        proposals[proposalId].voteCount += 1;

        emit VotedEvent(msg.sender, proposalId);
    }

    function tallyVotes() onlyAdmin onlyAfterVotingSession public {
        uint winningVoteCount = 0;
        uint winningProposalIndex = 0;

        for(uint i = 0; i < proposals.length; i++){
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalIndex = i;
            }
        }

        winningProposalId = winningProposalIndex;
        workflowStatus = WorkflowStatus.VotesTallied;

        emit VotesTalliedEvent();
        emit WorkflowStatusChangeEvent(WorkflowStatus.VotingSessionEnded, workflowStatus);
    }

    function getWinningProposalId() onlyAfterVotesTallied public view returns (uint) {
        return winningProposalId;
    }

    function getWinningProposalDescription() onlyAfterVotesTallied public view returns (string memory) {
        return proposals[winningProposalId].description;
    }

    function getWinningProposalVoteCounts() onlyAfterVotesTallied public view returns (uint) {
        return proposals[winningProposalId].voteCount;
    }

    function isRegisteredVoter(address _voterAddress) public view returns (bool) {
        return voters[_voterAddress].isRegistered;
    }

    function isAdmin(address _address) public view returns (bool) {
        return _address == admin;
    }

    function getWorkflowStatus() public view returns (WorkflowStatus) {
        return workflowStatus;
    }
}