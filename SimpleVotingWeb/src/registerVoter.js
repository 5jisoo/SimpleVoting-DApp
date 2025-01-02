var SimpleVoting;

window.registerVoter = registerVoter;
window.checkVoterRegistration = checkVoterRegistration;

$.getJSON("/contracts/SimpleVoting.json", function (json) {
  SimpleVoting = TruffleContract(json); // ABI 및 배포 정보를 포함한 컨트랙트 불러오기

  SimpleVoting.setProvider(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );
});

function registerVoter() {
  $("#voterRegistrationMessage").html("");

  var adminAddress = $("#adminAddress").val();
  var voterToRegister = $("#voterAddress").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isAdmin(adminAddress))
    .then((isAdministrator) => {
      // 관리자 권한 확인
      if (isAdministrator) {
        return SimpleVoting.deployed()
          .then((instance) => instance.isRegisteredVoter(voterToRegister))
          .then((isRegisteredVoter) => {
            // 이미 등록된 유권자
            if (isRegisteredVoter)
              $("#voterRegistrationMessage").html(
                "The voter is already registered"
              );
            else {
              return SimpleVoting.deployed()
                .then((instance) => instance.getWorkflowStatus())
                .then((workflowStatus) => {
                  if (workflowStatus > 0)
                    $("#voterRegistrationMessage").html(
                      "Voters registration has already ended"
                    );
                  else {
                    SimpleVoting.deployed()
                      .then((instance) =>
                        instance.registerVoter(voterToRegister, {
                          from: adminAddress,
                          gas: 200000,
                        })
                      )
                      .catch((e) => $("#voterRegistrationMessage").html(e));
                  }
                });
            }
          });
      } else {
        $("#voterRegistrationMessage").html(
          "The given address does not correspond to the administrator"
        );
      }
    });
}

function checkVoterRegistration() {
  $("#registrationVerificationMessage").html("");

  var address = $("#address").val();

  SimpleVoting.deployed()
    .then((instance) => instance.isRegisteredVoter(address))
    .then((isRegisteredVoter) => {
      if (isRegisteredVoter)
        $("#registrationVerificationMessage").html(
          "This is a registered voter"
        );
      else
        $("#registrationVerificationMessage").html(
          "This is NOT a registered voter"
        );
    });
}
