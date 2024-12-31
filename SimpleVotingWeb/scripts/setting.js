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

window.onload = function () {
  // json을 가져온 뒤, 성공적으로 불러오면 두번째 인수로 제공된 콜백 함수 호출
  $.getJSON(
    "../SimpleVoting/build/contracts/SimpleVoting.json",
    function (json) {
      SimpleVoting = TruffleContract(json); // ABI 및 배포 정보를 포함한 컨트랙트 불러오기

      SimpleVoting.setProvider(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );

      /**
       * deployed() : 스마트 계약 인스턴스를 가져옴. Promise를 반환함.
       * .then() : Promise 완료 후 호출될 콜백 정의
       * VoterRegisteredEvent() 가 성공적으로 호출되면? voterRegisteredEventSubscription 반환
       * voterRegisteredEventSubscription : VoterRegisteredEvent 구독 객체
       */
      SimpleVoting.deployed()
        .then((instance) => instance.VoterRegisteredEvent())
        .then((voterRegisteredEventSubscription) => {
          // voterRegisteredEventSubscription 전달받음
          voterRegisteredEvent = voterRegisteredEventSubscription;

          /**
           * watch() : VoterRegisteredEvent가 발생할 때마다 호출되는 이벤트 리스너 설정
           * error : 이벤트 처리 중 오류 발생 시 해당 오류 전달
           * result : 이벤트 결과 데이터
           */
          voterRegisteredEvent.watch(function (error, result) {
            if (!error)
              $("#voterRegistrationMessage").html(
                "Voter successfully registered"
              );
            else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.ProposalsRegistrationStartedEvent())
        .then((proposalsRegistrationStartedEventSubscription) => {
          proposalsRegistrationStartedEvent =
            proposalsRegistrationStartedEventSubscription;

          proposalsRegistrationStartedEvent.watch(function (error, result) {
            if (!error)
              $("#proposalsRegistrationMessage").html(
                "The proposals registration session has started"
              );
            else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.ProposalsRegistrationEndedEvent())
        .then((proposalsRegistrationEndedEventSubscription) => {
          proposalsRegistrationEndedEvent =
            proposalsRegistrationEndedEventSubscription;

          proposalsRegistrationEndedEvent.watch(function (error, result) {
            if (!error)
              $("#proposalsRegistrationMessage").html(
                "The proposals registration session has ended"
              );
            else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.ProposalRegisteredEvent())
        .then((proposalRegisteredEventSubscription) => {
          proposalRegisteredEvent = proposalRegisteredEventSubscription;

          proposalRegisteredEvent.watch(function (error, result) {
            if (!error) {
              $("#proposalRegistrationMessage").html(
                "The proposal has been registered successfully"
              );
              loadProposalsTable();
            } else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.VotingSessionStartedEvent())
        .then((votingSessionStartedEventSubscription) => {
          votingSessionStartedEvent = votingSessionStartedEventSubscription;

          votingSessionStartedEvent.watch(function (error, result) {
            if (!error)
              $("#votingSessionMessage").html(
                "The voting session session has started"
              );
            else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.VotingSessionEndedEvent())
        .then((votingSessionEndedEventSubscription) => {
          votingSessionEndedEvent = votingSessionEndedEventSubscription;

          votingSessionEndedEvent.watch(function (error, result) {
            if (!error)
              $("#votingSessionMessage").html(
                "The voting session session has ended"
              );
            else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.VotedEvent())
        .then((votedEventSubscription) => {
          votedEvent = votedEventSubscription;

          votedEvent.watch(function (error, result) {
            if (!error)
              $("#voteConfirmationMessage").html("You have voted successfully");
            else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.VotesTalliedEvent())
        .then((votesTalliedEventSubscription) => {
          votesTalliedEvent = votesTalliedEventSubscription;

          votesTalliedEvent.watch(function (error, result) {
            if (!error) {
              $("#votingTallyingMessage").html("Votes have been tallied");
              loadResultsTable();
            } else console.log(error);
          });
        });

      SimpleVoting.deployed()
        .then((instance) => instance.WorkflowStatusChangeEvent())
        .then((workflowStatusChangeEventSubscription) => {
          workflowStatusChangeEvent = workflowStatusChangeEventSubscription;

          workflowStatusChangeEvent.watch(function (error, result) {
            if (!error) refreshWorkflowStatus();
            else console.log(error);
          });
        });

      refreshWorkflowStatus();
    }
  );
};

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

export { SimpleVoting };
