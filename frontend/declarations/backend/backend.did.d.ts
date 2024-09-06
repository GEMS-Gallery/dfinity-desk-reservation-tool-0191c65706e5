import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Desk {
  'x' : bigint,
  'y' : bigint,
  'id' : string,
  'isBlocked' : boolean,
  'number' : bigint,
}
export interface Floor {
  'id' : string,
  'map' : Uint8Array | number[],
  'name' : string,
}
export interface OccupancyReport {
  'date' : bigint,
  'totalDesks' : bigint,
  'occupiedDesks' : bigint,
}
export interface Reservation {
  'id' : string,
  'isRecurring' : boolean,
  'userId' : string,
  'date' : bigint,
  'deskId' : string,
  'recurringDays' : Array<bigint>,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addDesk' : ActorMethod<[string, bigint, bigint, bigint], Result_1>,
  'blockDesk' : ActorMethod<[string, boolean], Result_1>,
  'deleteFloorMap' : ActorMethod<[string], Result>,
  'getAllReservations' : ActorMethod<[], Array<Reservation>>,
  'getDesks' : ActorMethod<[], Array<Desk>>,
  'getFloors' : ActorMethod<[], Array<Floor>>,
  'getOccupancyReport' : ActorMethod<[bigint, bigint], Array<OccupancyReport>>,
  'getReservations' : ActorMethod<[string], Array<Reservation>>,
  'makeReservation' : ActorMethod<
    [string, bigint, boolean, Array<bigint>],
    Result_1
  >,
  'markPreferredDesk' : ActorMethod<[string], Result_1>,
  'uploadFloorMap' : ActorMethod<
    [string, string, Uint8Array | number[]],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
