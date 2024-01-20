/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { default as BidScriptJson } from "../Bid.ral.json";
import { default as BoostRoundScriptJson } from "../BoostRound.ral.json";
import { default as DestroyRoundScriptJson } from "../DestroyRound.ral.json";
import { default as EndScriptJson } from "../End.ral.json";
import { default as StartScriptJson } from "../Start.ral.json";
import { default as WithdrawScriptJson } from "../Withdraw.ral.json";
import { default as WithdrawAddressScriptJson } from "../WithdrawAddress.ral.json";

export const Bid = new ExecutableScript<{
  predictalph: HexString;
  amount: bigint;
  up: boolean;
}>(Script.fromJson(BidScriptJson));
export const BoostRound = new ExecutableScript<{
  predictalph: HexString;
  amount: bigint;
  epochToBoost: bigint;
}>(Script.fromJson(BoostRoundScriptJson));
export const DestroyRound = new ExecutableScript<{
  predictalph: HexString;
  arrayEpoch: HexString;
}>(Script.fromJson(DestroyRoundScriptJson));
export const End = new ExecutableScript<{
  predictalph: HexString;
  price: bigint;
  immediatelyStart: boolean;
}>(Script.fromJson(EndScriptJson));
export const Start = new ExecutableScript<{
  predictalph: HexString;
  price: bigint;
}>(Script.fromJson(StartScriptJson));
export const Withdraw = new ExecutableScript<{
  predictalph: HexString;
  epochParticipation: HexString;
}>(Script.fromJson(WithdrawScriptJson));
export const WithdrawAddress = new ExecutableScript<{
  predictalph: HexString;
  epochParticipation: HexString;
  addressToClaim: Address;
}>(Script.fromJson(WithdrawAddressScriptJson));