import { SimpleVoting } from "./setting.js";

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
