# Simple Voting DApp

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

```shell
% cp SimpleVoting/build/contracts/SimpleVoting.json SimpleVotingWeb/contracts/SimpleVoting.json
% cd SimpleVotingWeb
% node webserver.js
```
