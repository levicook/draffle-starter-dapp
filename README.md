# dRaffle Starter dApp

The dRaffle Starter dApp is designed to let users fork, customize and
ship their own dRaffle frontend to a custom domain, ultra fast.

## About dRaffle

https://github.com/draffle-io/draffle

dRaffle is a decentralized raffle protocol built for and deployed on
Solana. You must **Do Your Own Research** on how this protocol is
implemented and decide whether it's safe for and appropriate to your use
case and regulatory constraints.

## About dRaffle Starter dApp

The dRaffle Starter dApp provides a starting point for you to implement
your own raffle, on your own domain.

### What can I expect form this project?

Absolutly nothing. There are no warranties expressed or implied. There
are no support promises. Use at your own risk and expect bugs and
limitations.

### How do you work this thing?

1. Create and manage raffles using the dRaffle command line interface (cli).
2. Fork this project
3. Clone your fork
4. Configure your fork to use a raffles from step 1
5. Customize the look, feel and behavior of your fork
6. Deploy your fork to your own domain

#### Creating and managing raffles

<!-- Visit https://github.com/draffle-io/draffle
Look for the cli folder
- review the documentation
- read and re-read the source
- chew the glass, on local or devnet, until you know how to:
  - create and show a raffle
  - add prizes
  - reveal winners
  - collect proceeds
  - close entrants
-->

Using the cli (command line interface):

`yarn run create-raffle`
`yarn run show-raffle`

yarn run add-prize

yarn run buy-tickets

yarn run claim-prize

yarn run collect-proceeds

yarn run reveal-winners

yarn run show-idl # TODO turn into cache-idl and have it save the idl json by program-id

* *TODO(levi):* provide a cli within this application?
* *TODO(levi):* provide examples?

<!-- 
#### Configure your fork to use a raffles from step 1
#### Customize the look, feel and behavior of your fork
#### Deploy your fork to your own domain
-->