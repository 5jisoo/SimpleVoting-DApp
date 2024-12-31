import { SimpleVoting } from "./setting";

function startVotingSession() {
  $("#votingSessionMessage").html("");

  var adminAddress = $("#adminAddress").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isAdministrator(adminAddress))
    .then((isAdministrator) => {
      if (isAdministrator) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus < 2)
              $("#votingSessionMessage").html(
                "The proposals registration session has not ended yet"
              );
            else if (workflowStatus > 2)
              $("#votingSessionMessage").html(
                "The voting session has already been started"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) =>
                  instance.startVotingSession({
                    from: adminAddress,
                    gas: 200000,
                  })
                )
                .catch((e) => $("#votingSessionMessage").html(e));
            }
          });
      } else {
        $("#votingSessionMessage").html(
          "The given address does not correspond to the administrator"
        );
      }
    });
}

function endVotingSession() {
  $("#votingSessionMessage").html("");

  var adminAddress = $("#adminAddress").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isAdministrator(adminAddress))
    .then((isAdministrator) => {
      if (isAdministrator) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus < 3)
              $("#votingSessionMessage").html(
                "The voting session has not started yet"
              );
            else if (workflowStatus > 3)
              $("#votingSessionMessage").html(
                "The voting session has already ended"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) =>
                  instance.endVotingSession({ from: adminAddress, gas: 200000 })
                )
                .catch((e) => $("#votingSessionMessage").html(e));
            }
          });
      } else {
        $("#votingSessionMessage").html(
          "The given address does not correspond to the administrator"
        );
      }
    });
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

function getProposalDescription(proposalId) {
  return SimpleVoting.deployed().then((instance) =>
    instance.getProposalDescription(proposalId)
  );
}

function vote() {
  $("#voteConfirmationMessage").html("");

  var voterAddress = $("#voterAddress").val();
  var proposalId = $("#proposalId").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isRegisteredVoter(voterAddress))
    .then((isRegisteredVoter) => {
      if (isRegisteredVoter) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus < 3)
              $("#voteConfirmationMessage").html(
                "The voting session has not started yet"
              );
            else if (workflowStatus > 3)
              $("#voteConfirmationMessage").html(
                "The voting session has already ended"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) => instance.getProposalsNumber())
                .then((proposalsNumber) => {
                  if (proposalsNumber == 0) {
                    $("#voteConfirmationMessage").html(
                      "The are no registered proposals. You cannot vote."
                    );
                  } else if (parseInt(proposalId) >= proposalsNumber) {
                    $("#voteConfirmationMessage").html(
                      "The specified proposalId does not exist."
                    );
                  } else {
                    SimpleVoting.deployed()
                      .then((instance) =>
                        instance.vote(proposalId, {
                          from: voterAddress,
                          gas: 200000,
                        })
                      )
                      .catch((e) => $("#voteConfirmationMessage").html(e));
                  }
                });
            }
          });
      } else {
        $("#proposalRegistrationMessage").html(
          "You are not a registered voter. You cannot register a proposal."
        );
      }
    });
}
