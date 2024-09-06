import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor {
  type Desk = {
    id: Text;
    number: Nat;
    x: Nat;
    y: Nat;
    isBlocked: Bool;
  };

  type Reservation = {
    id: Text;
    deskId: Text;
    userId: Text;
    date: Int;
    isRecurring: Bool;
    recurringDays: [Nat];
  };

  type Floor = {
    id: Text;
    name: Text;
    map: Blob;
  };

  type PreferredDesk = {
    userId: Text;
    deskId: Text;
  };

  type OccupancyReport = {
    totalDesks: Nat;
    occupiedDesks: Nat;
    date: Int;
  };

  stable var floors : [Floor] = [];
  stable var desks : [(Text, Desk)] = [];
  stable var reservations : [(Text, Reservation)] = [];
  stable var preferredDesks : [PreferredDesk] = [];

  let desksMap = HashMap.fromIter<Text, Desk>(desks.vals(), 10, Text.equal, Text.hash);
  let reservationsMap = HashMap.fromIter<Text, Reservation>(reservations.vals(), 10, Text.equal, Text.hash);

  public func uploadFloorMap(id: Text, name: Text, map: Blob) : async Result.Result<Text, Text> {
    try {
      if (Blob.toArray(map).size() == 0) {
        return #err("Empty image file");
      };
      let newFloor : Floor = { id = id; name = name; map = map };
      floors := Array.append(floors, [newFloor]);
      #ok("Floor map uploaded successfully")
    } catch (e) {
      Debug.print("Error uploading floor map: " # Error.message(e));
      #err("An error occurred while uploading the floor map")
    }
  };

  public func addDesk(id: Text, number: Nat, x: Nat, y: Nat) : async Result.Result<(), Text> {
    let desk: Desk = {
      id = id;
      number = number;
      x = x;
      y = y;
      isBlocked = false;
    };
    desksMap.put(id, desk);
    #ok()
  };

  public func blockDesk(id: Text, isBlocked: Bool) : async Result.Result<(), Text> {
    switch (desksMap.get(id)) {
      case (null) { #err("Desk not found") };
      case (?desk) {
        let updatedDesk: Desk = {
          id = desk.id;
          number = desk.number;
          x = desk.x;
          y = desk.y;
          isBlocked = isBlocked;
        };
        desksMap.put(id, updatedDesk);
        #ok()
      };
    }
  };

  public shared(msg) func makeReservation(deskId: Text, date: Int, isRecurring: Bool, recurringDays: [Nat]) : async Result.Result<(), Text> {
    let userId = Principal.toText(msg.caller);
    switch (desksMap.get(deskId)) {
      case (null) { #err("Desk not found") };
      case (?desk) {
        if (desk.isBlocked or isReserved(deskId, date)) {
          #err("Desk is not available")
        } else {
          let reservationId = generateId();
          let reservation: Reservation = {
            id = reservationId;
            deskId = deskId;
            userId = userId;
            date = date;
            isRecurring = isRecurring;
            recurringDays = recurringDays;
          };
          reservationsMap.put(reservationId, reservation);
          #ok()
        }
      };
    }
  };

  public shared(msg) func markPreferredDesk(deskId: Text) : async Result.Result<(), Text> {
    let userId = Principal.toText(msg.caller);
    let preferredDesk : PreferredDesk = { userId = userId; deskId = deskId };
    preferredDesks := Array.append(preferredDesks, [preferredDesk]);
    #ok()
  };

  public query func getFloors() : async [Floor] {
    floors
  };

  public query func getDesks() : async [Desk] {
    Iter.toArray(desksMap.vals())
  };

  public query func getReservations(userId: Text) : async [Reservation] {
    Array.filter<Reservation>(Iter.toArray(reservationsMap.vals()), func(res) { res.userId == userId })
  };

  public query func getAllReservations() : async [Reservation] {
    Iter.toArray(reservationsMap.vals())
  };

  public query func getOccupancyReport(startDate: Int, endDate: Int) : async [OccupancyReport] {
    let totalDesks = desksMap.size();
    let daysInRange = Int.abs(endDate - startDate) / (24 * 60 * 60 * 1000000000);
    Array.tabulate<OccupancyReport>(Nat.fromInt(daysInRange), func(i) {
      let date = startDate + (i * 24 * 60 * 60 * 1000000000);
      let occupiedDesks = Array.filter<Reservation>(Iter.toArray(reservationsMap.vals()), func(res) { res.date == date }).size();
      {
        totalDesks = totalDesks;
        occupiedDesks = occupiedDesks;
        date = date;
      }
    })
  };

  func isReserved(deskId: Text, date: Int) : Bool {
    Array.find<Reservation>(Iter.toArray(reservationsMap.vals()), func(res) { res.deskId == deskId and res.date == date }) != null
  };

  func generateId() : Text {
    let now = Time.now();
    Int.toText(now)
  };

  system func preupgrade() {
    desks := Iter.toArray(desksMap.entries());
    reservations := Iter.toArray(reservationsMap.entries());
  };

  system func postupgrade() {
    desks := [];
    reservations := [];
  };
}
