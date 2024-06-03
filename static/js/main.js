console.log('MAIN JS');

document.addEventListener('DOMContentLoaded', () => {
  const amountsSelectButton = document.getElementById('amountsSelectButton');
  if (amountsSelectButton) {
    var elevatorsAmount = document.getElementById('amountsSelectElevators');
    var floorsAmount = document.getElementById('amountsSelectFloors');
    var elevatorsAmountErrorMessage = document.getElementById(
      'amountsSelectElevatorsErrorMessage'
    );
    var amountsSelectFloorsErrorMessage = document.getElementById(
      'amountsSelectFloorsErrorMessage'
    );

    function setWrongElevators() {
      elevatorsAmount.classList.add('wrongInput');
      elevatorsAmountErrorMessage.classList.remove('hiddenClass');
    }

    function setWrongFloors() {
      floorsAmount.classList.add('wrongInput');
      amountsSelectFloorsErrorMessage.classList.remove('hiddenClass');
    }

    function resetSetWrong() {
      elevatorsAmount.classList.remove('wrongInput');
      floorsAmount.classList.remove('wrongInput');
      elevatorsAmountErrorMessage.classList.add('hiddenClass');
      amountsSelectFloorsErrorMessage.classList.add('hiddenClass');
    }

    amountsSelectButton.addEventListener('click', (e) => {
      e.preventDefault();

      resetSetWrong();

      //validation
      if (elevatorsAmount.value.trim() == '' || elevatorsAmount.value == null) {
        //elevators amount is empty or null
        setWrongElevators();
        elevatorsAmountErrorMessage.innerText = 'This field cannot be empty';
      }
      if (floorsAmount.value.trim() == '' || floorsAmount.value == null) {
        //floors amount is empty or null
        setWrongFloors();
        amountsSelectFloorsErrorMessage.innerText =
          'This field cannot be empty';
      }
      if (parseInt(elevatorsAmount.value) <= 0) {
        //elevators amount is wrong
        setWrongElevators();
        elevatorsAmountErrorMessage.innerText =
          'There must be at least 1 elevator';
      } else if (parseInt(elevatorsAmount.value) > 16) {
        //elevators amount is wrong
        setWrongElevators();
        elevatorsAmountErrorMessage.innerText =
          "There can't be more then 16 elevators";
      }
      if (parseInt(floorsAmount.value) <= 0) {
        //floors amount is wrong
        setWrongFloors();
        amountsSelectFloorsErrorMessage.innerText =
          'There must be at least 1 floor';
      } else if (parseInt(floorsAmount.value) > Number.MAX_SAFE_INTEGER) {
        //floors amount is wrong
        setWrongFloors();
        amountsSelectFloorsErrorMessage.innerText = 'Floor amount is too high';
      }
      if (
        !(
          elevatorsAmount.classList.contains('wrongInput') ||
          floorsAmount.classList.contains('wrongInput')
        )
      ) {
        //valadation successful
        console.log('Redirecting');
        var url = `/${parseInt(elevatorsAmount.value)}/${parseInt(floorsAmount.value)}/`;
        window.location.href = url;
      }
    });
  }
});
