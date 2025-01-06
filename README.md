# 🗳️ Simple Voting DApp 🗳️

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

## project structure
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
