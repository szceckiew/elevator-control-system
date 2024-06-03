import { ElevatorSystem } from './system.js';

console.log('BUILDING JS');

// creating an object
var elevatorsAmountObj = document.getElementById('elevatorsAmount');
var floorsAmountObj = document.getElementById('floorsAmount');

if (
  elevatorsAmountObj.innerText.trim() == '' ||
  elevatorsAmountObj.innerText === null
) {
  elevatorsAmountObj.innerText = 3;
}
if (
  floorsAmountObj.innerText.trim() == '' ||
  floorsAmountObj.innerText === null
) {
  floorsAmountObj.innerText = 10;
}

if (parseInt(elevatorsAmountObj.innerText) < 1) {
  elevatorsAmountObj.innerText = 1;
}

if (parseInt(elevatorsAmountObj.innerText) > 16) {
  elevatorsAmountObj.innerText = 16;
}

if (parseInt(floorsAmountObj.innerText) < 1) {
  floorsAmountObj.innerText = 1;
}

if (parseInt(floorsAmountObj.innerText) > 100000) {
  floorsAmountObj.innerText = 100000;
}

let floorsAmount = parseInt(floorsAmountObj.innerText);
let elevatorsAmount = parseInt(elevatorsAmountObj.innerText);

let elevatorSystem = new ElevatorSystem(elevatorsAmount, floorsAmount);

//creating the "building"

for (var i = floorsAmount; i > 0; i--) {
  var row = document.createElement('div');
  row.className = 'row justify-content-center';
  row.innerHTML = `
        <div class="d-flex numbers align-items-center justify-content-center col col-md-2">
            ${i}
        </div>
        <div id="floorNumber${i}" class="floor col col-md-6">
            ◽
        </div>
        <div class="col col-md-2"></div>
    `;
  document.getElementById('rowsCreation').appendChild(row);
}

console.log('created');

elevatorSystem.elevators[0];

//listeners

function elevatorStatusGUIUpdate() {
  //call queue update
  var callQueue = document.getElementById('idCallQueue');
  var h4Element = document.querySelector('.classCallQueue h4');
  callQueue.innerHTML = '';
  h4Element.innerHTML = '';

  if (elevatorSystem.callQueue.length !== 0) {
    h4Element.innerHTML = 'Call Queue:';

    let { floor, direction } = elevatorSystem.callQueue[0];
    callQueue.innerHTML = direction == 1 ? floor + '🔼' : floor + '🔽';

    for (let i = 1; i < elevatorSystem.callQueue.length; i++) {
      let { floor, direction } = elevatorSystem.callQueue[i];
      callQueue.innerHTML =
        direction == 1
          ? callQueue.innerHTML + ', ' + floor + '🔼'
          : callQueue.innerHTML + ', ' + floor + '🔽';
    }
  }

  //building update
  for (let i = 1; i <= floorsAmount; i++) {
    let floor = document.getElementById(`floorNumber${i}`);
    floor.innerHTML = '';
  }

  for (let i = 1; i <= elevatorsAmount; i++) {
    let floor = document.getElementById(
      `floorNumber${elevatorSystem.elevators[i - 1].currentFloor}`
    );

    floor.innerHTML = floor.innerHTML + (i - 1) + ' ';
  }

  for (let i = 1; i <= floorsAmount; i++) {
    let floor = document.getElementById(`floorNumber${i}`);
    if (floor.innerHTML.trim() == '') {
      floor.innerHTML = '◽';
    }
  }
}

elevatorStatusGUIUpdate();

document.addEventListener('DOMContentLoaded', () => {
  const simulationStepButton = document.getElementById('simulationStepButton');
  if (simulationStepButton) {
    simulationStepButton.addEventListener('click', (e) => {
      e.preventDefault();

      elevatorSystem.step();

      elevatorStatusGUIUpdate();

      console.log(elevatorSystem.status());
    });
  }
});

//Pressing a button on a selected floor
document.addEventListener('DOMContentLoaded', () => {
  const floorButtonSubmit = document.getElementById('floorButtonSubmit');
  if (floorButtonSubmit) {
    var floor = document.getElementById('floorButtonInput');
    var radioButtons = document.getElementsByName('directions');
    var callQueue = document.getElementById('idCallQueue');
    var h4Element = document.querySelector('.classCallQueue h4');

    floorButtonSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      //validation
      floor.classList.remove('wrongInput');
      if (
        floor.value.trim() == '' ||
        floor.value == null ||
        floor.value > floorsAmount ||
        floor.value < 1
      ) {
        //floor number is wrong
        floor.classList.add('wrongInput');
      } else {
        //floor number is good
        //validated
        if (radioButtons[0].checked || radioButtons[1].checked) {
          let direction = radioButtons[0].checked ? 1 : -1;
          elevatorSystem.pickup(parseInt(floor.value), direction);
          // 🔼🔽
          if (callQueue.innerHTML.trim() == '') {
            h4Element.innerHTML = 'Call Queue:';
            callQueue.innerHTML =
              direction == 1 ? floor.value + '🔼' : floor.value + '🔽';
          } else {
            callQueue.innerHTML =
              direction == 1
                ? callQueue.innerHTML + ', ' + floor.value + '🔼'
                : callQueue.innerHTML + ', ' + floor.value + '🔽';
          }
          floor.value = '';
          radioButtons[0].checked = false;
          radioButtons[1].checked = false;
        }
      }
    });
  }
});

//Pressing a selected floor button on a selected elevator
document.addEventListener('DOMContentLoaded', () => {
  const elevatorButtonSubmit = document.getElementById('elevatorButtonSubmit');
  if (elevatorButtonSubmit) {
    var elevatorId = document.getElementById('elevatorButtonIdInput');
    var floor = document.getElementById('elevatorButtonFloorInput');

    elevatorButtonSubmit.addEventListener('click', (e) => {
      e.preventDefault();

      elevatorId.classList.remove('wrongInput');
      floor.classList.remove('wrongInput');

      //validation
      //elevatorId validation
      if (
        elevatorId.value.trim() == '' ||
        elevatorId.value.trim() == null ||
        elevatorId.value < 0 ||
        elevatorId.value > elevatorsAmount - 1
      ) {
        //elevatorId is wrong
        elevatorId.classList.add('wrongInput');
      }
      if (
        floor.value.trim() == '' ||
        floor.value.trim() == null ||
        floor.value < 1 ||
        floor.value > floorsAmount
      ) {
        //floor is wrong
        floor.classList.add('wrongInput');
      }
      if (
        !(
          elevatorId.classList.contains('wrongInput') ||
          floor.classList.contains('wrongInput')
        )
      ) {
        //validated
        elevatorSystem.updateInsideButtonPressed(
          parseInt(elevatorId.value),
          parseInt(floor.value)
        );
        elevatorId.value = '';
        floor.value = '';
        console.log(elevatorSystem.status());
      }
    });
  }
});
