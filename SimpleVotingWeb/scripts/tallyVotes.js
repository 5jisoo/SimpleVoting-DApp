import { SimpleVoting } from "./setting";

function tallyVotes() {
  $("#votingTallyingMessage").html("");

  var adminAddress = $("#adminAddress").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isAdministrator(adminAddress))
    .then((isAdministrator) => {
      if (isAdministrator) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus < 4)
              $("#votingTallyingMessage").html(
                "The voting session has not ended yet"
              );
            else if (workflowStatus > 4)
              $("#votingTallyingMessage").html(
                "Votes have already been tallied"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) =>
                  instance.tallyVotes({ from: adminAddress, gas: 200000 })
                )
                .catch((e) => $("#votingTallyingMessage").html(e));
            }
          });
      } else {
        $("#votingTallyingMessage").html(
          "The given address does not correspond to the administrator"
        );
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
