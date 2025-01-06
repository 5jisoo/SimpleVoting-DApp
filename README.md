# 🗳️ Simple Voting DApp 🗳️

<table>
  <tr>
    <th colspan="2">관리자 계정 잠금 해제 Unlock Admin Account</th>
  </tr>
  <tr>
    <td width="50%">
      <img
        src="https://github.com/user-attachments/assets/3213f6ff-d01e-4183-be6b-8b0d9788c399"
      />
    </td>
    <td width="50%"></td>
  </tr>
  <tr>
    <th colspan="2">유권자 등록 Register Voters</th>
  </tr>
  <tr>
    <td>
      <img
        src="https://github.com/user-attachments/assets/0df53484-8f2e-4ec7-ae55-e8eb41d3a929"
      />
    </td>
    <td>
      <img
        src="https://github.com/user-attachments/assets/c47234ee-d753-4134-b75f-4d203e71adad"
      />
    </td>
  </tr>
  <tr>
    <th colspan="2">제안서 등록 Register Proposals</th>
  </tr>
  <tr>
    <td>
      <img
        src="https://github.com/user-attachments/assets/5429dfbb-9432-4984-a655-a503e6bf73e4"
      />
    </td>
    <td>
      <img
        src="https://github.com/user-attachments/assets/e97a5cd4-9116-48af-a242-334bb2cb5f80"
      />
    </td>
  </tr>
  <tr>
    <td>
      <img
        src="https://github.com/user-attachments/assets/0bae4a13-0ee1-42cc-a219-327216aadc0c"
      />
    </td>
    <td>
      <img
        src="https://github.com/user-attachments/assets/24d83289-eb3b-412e-b98b-d1343d05a43b"
      />
    </td>
  </tr>
  <tr>
    <th colspan="2">투표 Vote</th>
  </tr>
  <tr>
    <td>
      <img
        src="https://github.com/user-attachments/assets/fb4ae1ee-953b-4669-912c-52fd3acde34d"
      />
    </td>
    <td>
      <img
        src="https://github.com/user-attachments/assets/addbce5f-2fc4-4945-a220-8507e79ca74c"
      />
    </td>
  </tr>
  <tr>
    <td>
      <img
        src="https://github.com/user-attachments/assets/d8085a3b-a391-4a21-9596-ff30042d0bef"
      />
    </td>
    <td>
      <img
        src="https://github.com/user-attachments/assets/af8a3a1e-7ec3-4fe3-bbcd-946b017d76a9"
      />
    </td>
  </tr>
</table>



## Installation
> terminal

- run geth console

```shell
% geth --datadir "data" \
--http  \
--http.addr "0.0.0.0" \
--http.port "8545" \
--http.api "web3,eth,personal,net" \
--http.corsdomain "*" \
--allow-insecure-unlock \
--nodiscover console
```

- execute migration

```shell
% cd SimpleVoting
% truffle migrate
```

> geth

- connect to blockchain

```shell
> miner.start()
> miner.stop()
```

> terminal

1. copy `json` file to `SimpleVotingWeb` project
2. move to root folder of `SimpleVotingWeb` project (`/SimpleVotingWeb`)
3. install npm dependencies
4. execute web project

```shell
% cp SimpleVoting/build/contracts/SimpleVoting.json SimpleVotingWeb/contracts/SimpleVoting.json
% cd SimpleVotingWeb
% npm install
% node webserver.js
```

## Structure
```
📦SimpleVoting
 ┣ 📂contracts
 ┃ ┗ 📜SimpleVoting.sol
 ┣ 📂migrations
 ┃ ┗ 📜1_deploy_contracts.js
 ┗ 📜truffle-config.js
📦SimpleVotingWeb
 ┣ 📂assets
 ┃ ┣ 📜admin.html
 ┃ ┗ 📜voter.html
 ┣ 📂contracts
 ┃ ┗ 📜SimpleVoting.json
 ┣ 📂src
 ┃ ┣ 📜registerProposal.js
 ┃ ┣ 📜registerVoter.js
 ┃ ┣ 📜tallyVotes.js
 ┃ ┣ 📜util.js
 ┃ ┗ 📜vote.js
 ┣ 📜index.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```
