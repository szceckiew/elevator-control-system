console.log('SYSTEM JS');

export class ElevatorSystem {
  constructor(numElevators, numFloors) {
    this.waitTime = 2;
    this.stopCost = 1;
    this.numElevators = numElevators;
    this.numFloors = numFloors;
    this.elevators = new Array(numElevators).fill().map(() => ({
      currentFloor: 1,
      direction: 0,
      firstCallDirection: 0,
      floors: new Array(numFloors).fill(0),
      stopTime: 0,
      insideButtonPressedArray: [],
      insideButtonPressedSet: new Set(),
      isInsideButtonPressed: false,
    }));

    this.callQueue = [];
  }

  updateCurrentFloor(elevatorId, currentFloor) {
    if (currentFloor >= 1 && currentFloor <= this.numFloors) {
      this.elevators[elevatorId].currentFloor = currentFloor;
    } else {
      console.log('updateCurrentFloor: Invalid input.');
    }
  }

  updateDirection(elevatorId, direction) {
    if (direction >= -1 && direction <= 1) {
      this.elevators[elevatorId].direction = direction;
    } else {
      console.log('updateDirection: Invalid input.');
    }
  }

  updateFirstCallDirection(elevatorId, firstCallDirection) {
    if (firstCallDirection >= -1 && firstCallDirection <= 1) {
      this.elevators[elevatorId].firstCallDirection = firstCallDirection;
    } else {
      console.log('updateFirstCallDirection: Invalid input.');
    }
  }

  updateStopTime(elevatorId, stopTime) {
    if (stopTime >= 0) {
      this.elevators[elevatorId].stopTime = stopTime;
    } else {
      console.log('updateStopTime: Invalid input.');
    }
  }

  updateElevatorQueue(elevatorId, floor, state) {
    if ((state == 0 || state == 1) && floor >= 1 && floor <= this.numFloors) {
      this.elevators[elevatorId].floors[floor - 1] = state;
    } else {
      console.log('updateElevatorQueue: Invalid input.');
    }
  }

  updateInsideButtonPressed(elevatorId, floor) {
    if (
      floor >= 1 &&
      floor <= this.numFloors &&
      !this.elevators[elevatorId].insideButtonPressedSet.has(floor)
    ) {
      this.elevators[elevatorId].isInsideButtonPressed = true;
      this.elevators[elevatorId].insideButtonPressedArray.push(floor);
      this.elevators[elevatorId].insideButtonPressedSet.add(floor);
    } else {
      console.log('updateInsideButtonPressed: Invalid input.');
    }
  }

  pickup(floor, direction) {
    this.callQueue.push({ floor, direction });
  }

  _insideButtonPressedCheck(elevatorId) {
    if (this.elevators[elevatorId].direction == 0) {
      //elevator is not moving so it can take next inside request
      let floor = this.elevators[elevatorId].insideButtonPressedArray[0];
      this.elevators[elevatorId].insideButtonPressedSet.delete(floor);
      this.elevators[elevatorId].insideButtonPressedArray.splice(0, 1);

      let newDirection =
        this.elevators[elevatorId].currentFloor < floor ? 1 : -1;
      this.updateDirection(elevatorId, newDirection);
      this.updateElevatorQueue(elevatorId, floor, 1);

      this.elevators[elevatorId].isInsideButtonPressed = false;
    }

    // if elevator is moving
    if (this.elevators[elevatorId].direction == 1) {
      //if elevator is moving up
      for (
        let i = 0;
        i < this.elevators[elevatorId].insideButtonPressedArray.length;
        i++
      ) {
        let buttonPressed =
          this.elevators[elevatorId].insideButtonPressedArray[i];
        let destinationFloor = null;

        for (let j = this.numFloors - 1; j >= 0; j--) {
          if (this.elevators[elevatorId].floors[j] != 0) {
            destinationFloor = j;
          }
        }
        if (destinationFloor == null) {
          destinationFloor = Infinity;
          console.log(
            'Error: _insideButtonPressedCheck destinationFloor==Infinity'
          );
        }

        if (
          buttonPressed > this.elevators[elevatorId].currentFloor &&
          buttonPressed < destinationFloor
        ) {
          //inside needs to be higher then current and lower then destination floor
          //floor is on the way
          this.updateElevatorQueue(elevatorId, buttonPressed, 1);

          this.elevators[elevatorId].insideButtonPressedSet.delete(
            this.elevators[elevatorId].insideButtonPressedArray[i]
          );
          this.elevators[elevatorId].insideButtonPressedArray.splice(i, 1);
          i--;
        } else {
          //the request from inside of the elevator cannot be taken at this moment
          this.elevators[elevatorId].isInsideButtonPressed = true;
        }
      }
    } else {
      //if elevator is moving down
      for (
        let i = 0;
        i < this.elevators[elevatorId].insideButtonPressedArray.length;
        i++
      ) {
        let buttonPressed =
          this.elevators[elevatorId].insideButtonPressedArray[i];
        let destinationFloor = null;

        for (let j = 0; j < this.numFloors - 1; j++) {
          if (this.elevators[elevatorId].floors[j] != 0) {
            destinationFloor = j;
          }
        }
        if (destinationFloor == null) {
          destinationFloor = 0;
          console.log('Error: _insideButtonPressedCheck destinationFloor==0');
        }

        if (
          buttonPressed < this.elevators[elevatorId].currentFloor &&
          buttonPressed > destinationFloor
        ) {
          //inside needs to be lower then current and higher then destination floor
          //floor is on the way
          this.updateElevatorQueue(elevatorId, buttonPressed, 1);

          this.elevators[elevatorId].insideButtonPressedSet.delete(
            this.elevators[elevatorId].insideButtonPressedArray[i]
          );
          this.elevators[elevatorId].insideButtonPressedArray.splice(i, 1);
          i--;
        } else {
          //the request from inside of the elevator cannot be taken at this moment
          this.elevators[elevatorId].isInsideButtonPressed = true;
        }
      }
    }
  }

  step() {
    for (let elevatorId = 0; elevatorId < this.numElevators; elevatorId++) {
      let direction = this.elevators[elevatorId].direction;
      let stopTime = this.elevators[elevatorId].stopTime;

      if (stopTime > 0) {
        //elevator waits at the floor
        this.elevators[elevatorId].stopTime--;
        continue;
      }

      if (direction != 0) {
        //elevator is planned to move
        if (direction == 1) {
          //elevator is planned to move up
          this.elevators[elevatorId].currentFloor++;
          let currentFloor = this.elevators[elevatorId].currentFloor;

          if (this.elevators[elevatorId].floors[currentFloor - 1] == 1) {
            console.log('elevator is stopping');

            //delete from queue
            this.elevators[elevatorId].floors[currentFloor - 1] = 0;

            //setting stoptime
            this.elevators[elevatorId].stopTime = this.waitTime;

            //check if theres a stop ahead

            let stopFound = false;

            for (let i = currentFloor; i < this.numFloors; i++) {
              if (this.elevators[elevatorId].floors[i] != 0) {
                //theres a stop ahead
                stopFound = true;
                break;
              }
            }

            if (!stopFound) {
              this.elevators[elevatorId].direction = 0;
              this.elevators[elevatorId].firstCallDirection = 0;
            }
          }
        } else {
          //elevator is planned to move down
          this.elevators[elevatorId].currentFloor--;
          let currentFloor = this.elevators[elevatorId].currentFloor;

          if (this.elevators[elevatorId].floors[currentFloor - 1] == 1) {
            console.log('elevator is stopping');

            //delete from queue
            this.elevators[elevatorId].floors[currentFloor - 1] = 0;

            //setting stoptime
            this.elevators[elevatorId].stopTime = this.waitTime;

            //check if theres a stop ahead
            this.elevators[elevatorId].direction = 0;

            for (let i = currentFloor - 2; i >= 0; i--) {
              if (this.elevators[elevatorId].floors[i] != 0) {
                //theres a stop ahead
                this.elevators[elevatorId].direction = -1;
                break;
              }
            }
          }
        }
      }
    }

    for (let elevatorId = 0; elevatorId < this.numElevators; elevatorId++) {
      if (this.elevators[elevatorId].isInsideButtonPressed == true) {
        this._insideButtonPressedCheck(elevatorId);
      }
    }

    // Handle calls
    let notAssignedCalls = [];

    for (let call of this.callQueue) {
      let { floor, direction } = call;
      if (!this._assignElevator(floor, direction)) {
        notAssignedCalls.push(call);
      }
    }
    this.callQueue = notAssignedCalls;
  }

  status() {
    console.log(this.callQueue);
    return this.elevators.map((elevator, index) => [
      index,
      elevator.currentFloor,
      elevator.direction,
      elevator.firstCallDirection,
      elevator.floors,
      elevator.stopTime,
      elevator.insideButtonPressedArray,
      elevator.insideButtonPressedSet,
      elevator.isInsideButtonPressed,
    ]);
  }

  _assignElevator(floor, direction) {
    let bestElevator = null;
    let minDistance = Infinity;

    for (let i = 0; i < this.numElevators; i++) {
      if (this.elevators[i].direction == 0) {
        //elevator is not moving

        // console.log(i);
        // console.log("is stopped");
        // console.log(Math.abs(this.elevators[i].currentFloor - floor));

        if (Math.abs(this.elevators[i].currentFloor - floor) < minDistance) {
          //found better elevator
          bestElevator = i;
          minDistance = Math.abs(this.elevators[i].currentFloor - floor);
        }
        continue;
      }

      if (
        (this.elevators[i].firstCallDirection == 0
          ? true
          : this.elevators[i].firstCallDirection == direction &&
            this.elevators[i].direction == direction) &&
        (this.elevators[i].direction > 0
          ? floor > this.elevators[i].currentFloor
          : floor < this.elevators[i].currentFloor)
      ) {
        //only case when emoving elevator can stop on the way to the first request
        let callsSum = 0;
        for (let j = 0; j < this.numFloors; j++) {
          callsSum += this.elevators[i].floors[j];
        }

        // console.log(i);
        // console.log(Math.abs(this.elevators[i].currentFloor - floor) + callsSum * this.stopCost);

        if (
          Math.abs(this.elevators[i].currentFloor - floor) +
            callsSum * this.stopCost <
          minDistance
        ) {
          //found better elevator
          bestElevator = i;
          minDistance = Math.abs(this.elevators[i].currentFloor - floor);
        }
      }
    }

    if (bestElevator !== null) {
      let currFloor = this.elevators[bestElevator].currentFloor;
      if (currFloor == floor) {
        //elevator is already on this floor
        this.updateCurrentFloor(bestElevator, currFloor);
        this.updateStopTime(bestElevator, this.waitTime);
      } else {
        //elevator is not on this floor
        let newdirection = currFloor < floor ? 1 : -1;

        this.updateCurrentFloor(bestElevator, currFloor);
        this.updateDirection(bestElevator, newdirection);
        this.updateFirstCallDirection(
          bestElevator,
          this.elevators[bestElevator].firstCallDirection == 0
            ? direction
            : this.elevators[bestElevator].firstCallDirection
        );
        this.updateElevatorQueue(bestElevator, floor, 1);
      }
      return 1;
    }
    return 0;
  }
}
