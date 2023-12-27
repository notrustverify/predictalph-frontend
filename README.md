# [alph.bet](https://alph.bet)

[alph.bet](https://alph.bet) is a decentralized application developed on [Alephium](https://alephium.org).

The goal here is to find the sentiment of ALPH price, native token of Alephium. The player has two choices, Up or Down.
Voting up means after the end of the interval the bidder thinks that the price is going to be higher than it was at the beginning of the round. If the price at the end of the round is higher than it was at the beginning then all the bidders who bid Up will won (with a ratio) everything that the bidder who bid Down.

If price is equal as it was at the beginning it means the house won and there's no rewards for the bidders.


## Claim rewards

When you bid the bidder have to "lock" 1 ALPH, it's a feature developed by Alephium to limit what is stored on-chain. 
This 1 ALPH can be retrieved when the rewards are claimed even if the bidder didn't choose the right side.

There's another feature on this dApp is that **anyone can claimed the rewards of any address after a certain period of time.** This incentive the need to get the rewards back.

## How do you get the price

For now it's an off-chain process, we are using coingecko to fetch the price but everything is written on-chain so anyone can check the price
