var SimpleVoting;

var voterRegisteredEvent;
var proposalsRegistrationStartedEvent;
var proposalsRegistrationEndedEvent;
var proposalRegisteredEvent;
var votingSessionStartedEvent;
var votingSessionEndedEvent;
var votedEvent;
var votesTalliedEvent;
var workflowStatusChangeEvent;

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

window.onload = function () {
  // json을 가져온 뒤, 성공적으로 불러오면 두번째 인수로 제공된 콜백 함수 호출

  $.getJSON("/contracts/SimpleVoting.json", function (json) {
    SimpleVoting = TruffleContract(json); // ABI 및 배포 정보를 포함한 컨트랙트 불러오기

    SimpleVoting.setProvider(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );

    refreshWorkflowStatus();
  });
};

window.refreshWorkflowStatus = refreshWorkflowStatus;
window.unlockAdmin = unlockAdmin;
window.unlockVoter = unlockVoter;
window.loadProposalsTable = loadProposalsTable;
window.loadResultsTable = loadResultsTable;

function refreshWorkflowStatus() {
  SimpleVoting.deployed()
    .then((instance) => instance.getWorkflowStatus())
    .then((workflowStatus) => {
      var workflowStatusDescription;

      switch (workflowStatus.toString()) {
        case "0":
          workflowStatusDescription = "Registering Voters";
          break;
        case "1":
          workflowStatusDescription = "Proposals registration Started";
          break;
        case "2":
          workflowStatusDescription = "Proposals registration Ended";
          break;
        case "3":
          workflowStatusDescription = "Voting session Started";
          break;
        case "4":
          workflowStatusDescription = "Voting session Ended";
          break;
        case "5":
          workflowStatusDescription = "Votes have been tallied";
          break;
        default:
          workflowStatusDescription = "Unknown status";
      }

      $("#currentWorkflowStatusMessage").html(workflowStatusDescription);
    });
}

function unlockAdmin() {
  $("#adminMessage").html("");

  var adminAddress = $("#adminAddress").val();
  var adminPassword = $("#adminPassword").val();

  var result = web3.personal.unlockAccount(adminAddress, adminPassword, 180); // unlock for 3 minutes
  if (result) $("#adminMessage").html("The account has been unlocked");
  else $("#adminMessage").html("The account has NOT been unlocked");
}

function unlockVoter() {
  $("#voterMessage").html("");

  var voterAddress = $("#voterAddress").val();
  var voterPassword = $("#voterPassword").val();

  var result = web3.personal.unlockAccount(voterAddress, voterPassword, 180); // unlock for 3 minutes
  if (result) $("#voterMessage").html("The account has been unlocked");
  else $("#voterMessage").html("The account has NOT been unlocked");
}

function loadProposalsTable() {
  SimpleVoting.deployed()
    .then((instance) => instance.getProposalsNumber())
    .then((proposalsNumber) => {
      var innerHtml =
        "<tr><td><b>Proposal Id</b></td><td><b>Description</b></td>";

      j = 0;
      for (var i = 0; i < proposalsNumber; i++) {
        getProposalDescription(i).then((description) => {
          innerHtml =
            innerHtml +
            "<tr><td>" +
            j++ +
            "</td><td>" +
            description +
            "</td></tr>";
          $("#proposalsTable").html(innerHtml);
        });
      }
    });
}

function loadResultsTable() {
  SimpleVoting.deployed()
    .then((instance) => instance.getWorkflowStatus())
    .then((workflowStatus) => {
      if (workflowStatus == 5) {
        var innerHtml = "<tr><td><b>Winning Proposal</b></td><td></td></tr>";

        SimpleVoting.deployed()
          .then((instance) => instance.getWinningProposalId())
          .then((winningProposalId) => {
            innerHtml =
              innerHtml +
              "<tr><td><b>Id:</b></td><td>" +
              winningProposalId +
              "</td></tr>";

            SimpleVoting.deployed()
              .then((instance) => instance.getWinningProposalDescription())
              .then((winningProposalDescription) => {
                innerHtml =
                  innerHtml +
                  "<tr><td><b>Description:</b></td><td>" +
                  winningProposalDescription +
                  "</td></tr>";

                SimpleVoting.deployed()
                  .then((instance) => instance.getWinningProposaVoteCounts())
                  .then((winningProposalVoteCounts) => {
                    innerHtml =
                      innerHtml +
                      "<tr><td><b>Votes count:</b></td><td>" +
                      winningProposalVoteCounts +
                      "</td></tr>";

                    $("#resultsTable").html(innerHtml);
                  });
              });
          });
      }
    });
}
