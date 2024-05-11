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
import { default as BidChoiceScriptJson } from "../BidChoice.ral.json";
import { default as BidMultipleChoiceScriptJson } from "../BidMultipleChoice.ral.json";
import { default as BidPriceScriptJson } from "../BidPrice.ral.json";
import { default as BoostRoundScriptJson } from "../BoostRound.ral.json";
import { default as BoostRoundChoiceScriptJson } from "../BoostRoundChoice.ral.json";
import { default as BoostRoundMultipleChoiceScriptJson } from "../BoostRoundMultipleChoice.ral.json";
import { default as DestroyPredictScriptJson } from "../DestroyPredict.ral.json";
import { default as DestroyRoundScriptJson } from "../DestroyRound.ral.json";
import { default as DestroyRoundChoiceScriptJson } from "../DestroyRoundChoice.ral.json";
import { default as DestroyRoundMultipleChoiceScriptJson } from "../DestroyRoundMultipleChoice.ral.json";
import { default as EndScriptJson } from "../End.ral.json";
import { default as EndChoiceScriptJson } from "../EndChoice.ral.json";
import { default as EndMultipleChoiceScriptJson } from "../EndMultipleChoice.ral.json";
import { default as NewIntervalScriptJson } from "../NewInterval.ral.json";
import { default as NewIntervalChoiceScriptJson } from "../NewIntervalChoice.ral.json";
import { default as StartScriptJson } from "../Start.ral.json";
import { default as StartChoiceScriptJson } from "../StartChoice.ral.json";
import { default as StartMultipleChoiceScriptJson } from "../StartMultipleChoice.ral.json";
import { default as WithdrawChoiceScriptJson } from "../WithdrawChoice.ral.json";
import { default as WithdrawMultipleChoiceScriptJson } from "../WithdrawMultipleChoice.ral.json";
import { default as WithdrawPriceScriptJson } from "../WithdrawPrice.ral.json";

export const BidChoice = new ExecutableScript<{
  predict: HexString;
  amount: bigint;
  side: boolean;
}>(Script.fromJson(BidChoiceScriptJson, "", []));

export const BidMultipleChoice = new ExecutableScript<{
  predict: HexString;
  amount: bigint;
  side: bigint;
}>(Script.fromJson(BidMultipleChoiceScriptJson, "", []));

export const BidPrice = new ExecutableScript<{
  predict: HexString;
  amount: bigint;
  side: boolean;
}>(Script.fromJson(BidPriceScriptJson, "", []));

export const BoostRound = new ExecutableScript<{
  predict: HexString;
  amount: bigint;
  epochToBoost: bigint;
}>(Script.fromJson(BoostRoundScriptJson, "", []));

export const BoostRoundChoice = new ExecutableScript<{
  predict: HexString;
  amount: bigint;
  epochToBoost: bigint;
}>(Script.fromJson(BoostRoundChoiceScriptJson, "", []));

export const BoostRoundMultipleChoice = new ExecutableScript<{
  predict: HexString;
  amount: bigint;
  epochToBoost: bigint;
}>(Script.fromJson(BoostRoundMultipleChoiceScriptJson, "", []));

export const DestroyPredict = new ExecutableScript<{ predict: HexString }>(
  Script.fromJson(DestroyPredictScriptJson, "", [])
);

export const DestroyRound = new ExecutableScript<{
  predict: HexString;
  arrayEpoch: HexString;
}>(Script.fromJson(DestroyRoundScriptJson, "", []));

export const DestroyRoundChoice = new ExecutableScript<{
  predict: HexString;
  arrayEpoch: HexString;
}>(Script.fromJson(DestroyRoundChoiceScriptJson, "", []));

export const DestroyRoundMultipleChoice = new ExecutableScript<{
  predict: HexString;
  arrayEpoch: HexString;
}>(Script.fromJson(DestroyRoundMultipleChoiceScriptJson, "", []));

export const End = new ExecutableScript<{
  predict: HexString;
  price: bigint;
  immediatelyStart: boolean;
}>(Script.fromJson(EndScriptJson, "", []));

export const EndChoice = new ExecutableScript<{
  predict: HexString;
  sideWon: boolean;
  immediatelyStart: boolean;
}>(Script.fromJson(EndChoiceScriptJson, "", []));

export const EndMultipleChoice = new ExecutableScript<{
  predict: HexString;
  sideWon: bigint;
  immediatelyStart: boolean;
}>(Script.fromJson(EndMultipleChoiceScriptJson, "", []));

export const NewInterval = new ExecutableScript<{
  predict: HexString;
  newRecurrence: bigint;
}>(Script.fromJson(NewIntervalScriptJson, "", []));

export const NewIntervalChoice = new ExecutableScript<{
  predict: HexString;
  newRecurrence: bigint;
}>(Script.fromJson(NewIntervalChoiceScriptJson, "", []));

export const Start = new ExecutableScript<{
  predict: HexString;
  price: bigint;
}>(Script.fromJson(StartScriptJson, "", []));

export const StartChoice = new ExecutableScript<{ predict: HexString }>(
  Script.fromJson(StartChoiceScriptJson, "", [])
);

export const StartMultipleChoice = new ExecutableScript<{ predict: HexString }>(
  Script.fromJson(StartMultipleChoiceScriptJson, "", [])
);

export const WithdrawChoice = new ExecutableScript<{
  predict: HexString;
  epochParticipation: HexString;
  addressToClaim: Address;
}>(Script.fromJson(WithdrawChoiceScriptJson, "", []));

export const WithdrawMultipleChoice = new ExecutableScript<{
  predict: HexString;
  epochParticipation: HexString;
  addressToClaim: Address;
}>(Script.fromJson(WithdrawMultipleChoiceScriptJson, "", []));

export const WithdrawPrice = new ExecutableScript<{
  predict: HexString;
  epochParticipation: HexString;
  addressToClaim: Address;
}>(Script.fromJson(WithdrawPriceScriptJson, "", []));
