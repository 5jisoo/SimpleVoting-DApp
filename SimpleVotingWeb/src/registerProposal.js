var SimpleVoting;

window.startProposalsRegistration = startProposalsRegistration;
window.endProposalsRegistration = endProposalsRegistration;
window.registerProposal = registerProposal;

$.getJSON("/contracts/SimpleVoting.json", function (json) {
  SimpleVoting = TruffleContract(json); // ABI 및 배포 정보를 포함한 컨트랙트 불러오기

  SimpleVoting.setProvider(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );
});

function startProposalsRegistration() {
  $("#proposalsRegistrationMessage").html("");

  var adminAddress = $("#adminAddress").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isAdmin(adminAddress))
    .then((isAdministrator) => {
      if (isAdministrator) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus > 0)
              $("#proposalsRegistrationMessage").html(
                "The proposals registration session has already been started"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) =>
                  instance.startProposalsRegistration({
                    from: adminAddress,
                    gas: 200000,
                  })
                )
                .catch((e) => $("#proposalsRegistrationMessage").html(e));
            }
          });
      } else {
        $("#proposalsRegistrationMessage").html(
          "The given address does not correspond to the administrator"
        );
      }
    });
}

function endProposalsRegistration() {
  $("#proposalsRegistrationMessage").html("");

  var adminAddress = $("#adminAddress").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isAdmin(adminAddress))
    .then((isAdministrator) => {
      if (isAdministrator) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus < 1)
              $("#proposalsRegistrationMessage").html(
                "The proposals registration session has not started yet"
              );
            else if (workflowStatus > 1)
              $("#proposalsRegistrationMessage").html(
                "The proposals registration session has already been ended"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) =>
                  instance.endProposalsRegistration({
                    from: adminAddress,
                    gas: 200000,
                  })
                )
                .catch((e) => $("#proposalsRegistrationMessage").html(e));
            }
          });
      } else {
        $("#proposalsRegistrationMessage").html(
          "The given address does not correspond to the administrator"
        );
      }
    });
}

function registerProposal() {
  $("#proposalRegistrationMessage").html("");

  var voterAddress = $("#voterAddress").val();
  var proposalDescription = $("#proposalDescription").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isRegisteredVoter(voterAddress))
    .then((isRegisteredVoter) => {
      if (isRegisteredVoter) {
        return SimpleVoting.deployed()
          .then((instance) => instance.getWorkflowStatus())
          .then((workflowStatus) => {
            if (workflowStatus < 1)
              $("#proposalRegistrationMessage").html(
                "The proposal registration session has not started yet"
              );
            else if (workflowStatus > 1)
              $("#proposalRegistrationMessage").html(
                "The proposal registration session has already ended"
              );
            else {
              SimpleVoting.deployed()
                .then((instance) =>
                  instance.registerProposal(proposalDescription, {
                    from: voterAddress,
                    gas: 200000,
                  })
                )
                .catch((e) => $("#proposalRegistrationMessage").html(e));
            }
          });
      } else {
        $("#proposalRegistrationMessage").html(
          "You are not a registered voter. You cannot register a proposal."
        );
      }
    });
}
