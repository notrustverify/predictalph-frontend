/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
} from "@alephium/web3";
import { default as PunterChoiceContractJson } from "../PunterChoice.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace PunterChoiceTypes {
  export type Fields = {
    predictionContractId: HexString;
    punterAddress: Address;
    epoch: bigint;
    side: bigint;
    amountBid: bigint;
    claimedByAnyoneAt: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getAddress: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getBid: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getAmountBid: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getRoundEpoch: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getClaimedByAnyone: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  PunterChoiceInstance,
  PunterChoiceTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as PunterChoiceTypes.Fields;
  }

  consts = { ErrorCodes: { InvalidCaller: BigInt(200) } };

  at(address: string): PunterChoiceInstance {
    return new PunterChoiceInstance(address);
  }

  tests = {
    getAddress: async (
      params: Omit<
        TestContractParamsWithoutMaps<PunterChoiceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(this, "getAddress", params);
    },
    getBid: async (
      params: Omit<
        TestContractParamsWithoutMaps<PunterChoiceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getBid", params);
    },
    getAmountBid: async (
      params: Omit<
        TestContractParamsWithoutMaps<PunterChoiceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getAmountBid", params);
    },
    getRoundEpoch: async (
      params: Omit<
        TestContractParamsWithoutMaps<PunterChoiceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getRoundEpoch", params);
    },
    getClaimedByAnyone: async (
      params: Omit<
        TestContractParamsWithoutMaps<PunterChoiceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getClaimedByAnyone", params);
    },
    destroy: async (
      params: TestContractParamsWithoutMaps<
        PunterChoiceTypes.Fields,
        { from: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "destroy", params);
    },
  };
}

// Use this object to test and deploy the contract
export const PunterChoice = new Factory(
  Contract.fromJson(
    PunterChoiceContractJson,
    "",
    "75f2d8bff475bcac7c2b6f3a6c7ecfffadcf7727e469f9001de2aadada85b12a"
  )
);

// Use this class to interact with the blockchain
export class PunterChoiceInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<PunterChoiceTypes.State> {
    return fetchContractState(PunterChoice, this);
  }

  methods = {
    getAddress: async (
      params?: PunterChoiceTypes.CallMethodParams<"getAddress">
    ): Promise<PunterChoiceTypes.CallMethodResult<"getAddress">> => {
      return callMethod(
        PunterChoice,
        this,
        "getAddress",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBid: async (
      params?: PunterChoiceTypes.CallMethodParams<"getBid">
    ): Promise<PunterChoiceTypes.CallMethodResult<"getBid">> => {
      return callMethod(
        PunterChoice,
        this,
        "getBid",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getAmountBid: async (
      params?: PunterChoiceTypes.CallMethodParams<"getAmountBid">
    ): Promise<PunterChoiceTypes.CallMethodResult<"getAmountBid">> => {
      return callMethod(
        PunterChoice,
        this,
        "getAmountBid",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getRoundEpoch: async (
      params?: PunterChoiceTypes.CallMethodParams<"getRoundEpoch">
    ): Promise<PunterChoiceTypes.CallMethodResult<"getRoundEpoch">> => {
      return callMethod(
        PunterChoice,
        this,
        "getRoundEpoch",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getClaimedByAnyone: async (
      params?: PunterChoiceTypes.CallMethodParams<"getClaimedByAnyone">
    ): Promise<PunterChoiceTypes.CallMethodResult<"getClaimedByAnyone">> => {
      return callMethod(
        PunterChoice,
        this,
        "getClaimedByAnyone",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends PunterChoiceTypes.MultiCallParams>(
    calls: Calls
  ): Promise<PunterChoiceTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      PunterChoice,
      this,
      calls,
      getContractByCodeHash
    )) as PunterChoiceTypes.MultiCallResults<Calls>;
  }
}
