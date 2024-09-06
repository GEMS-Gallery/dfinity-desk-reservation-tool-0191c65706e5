export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Reservation = IDL.Record({
    'id' : IDL.Text,
    'isRecurring' : IDL.Bool,
    'userId' : IDL.Text,
    'date' : IDL.Int,
    'deskId' : IDL.Text,
    'recurringDays' : IDL.Vec(IDL.Nat),
  });
  const Desk = IDL.Record({
    'x' : IDL.Nat,
    'y' : IDL.Nat,
    'id' : IDL.Text,
    'isBlocked' : IDL.Bool,
    'number' : IDL.Nat,
  });
  const Floor = IDL.Record({
    'id' : IDL.Text,
    'map' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
  });
  const OccupancyReport = IDL.Record({
    'date' : IDL.Int,
    'totalDesks' : IDL.Nat,
    'occupiedDesks' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addDesk' : IDL.Func([IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat], [Result_1], []),
    'blockDesk' : IDL.Func([IDL.Text, IDL.Bool], [Result_1], []),
    'getAllReservations' : IDL.Func([], [IDL.Vec(Reservation)], ['query']),
    'getDesks' : IDL.Func([], [IDL.Vec(Desk)], ['query']),
    'getFloors' : IDL.Func([], [IDL.Vec(Floor)], ['query']),
    'getOccupancyReport' : IDL.Func(
        [IDL.Int, IDL.Int],
        [IDL.Vec(OccupancyReport)],
        ['query'],
      ),
    'getReservations' : IDL.Func([IDL.Text], [IDL.Vec(Reservation)], ['query']),
    'makeReservation' : IDL.Func(
        [IDL.Text, IDL.Int, IDL.Bool, IDL.Vec(IDL.Nat)],
        [Result_1],
        [],
      ),
    'markPreferredDesk' : IDL.Func([IDL.Text], [Result_1], []),
    'uploadFloorMap' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Nat8)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
