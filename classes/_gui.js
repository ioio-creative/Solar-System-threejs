export function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text === valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}

export function updateGui(gui) {
  // Iterate over all controllers
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }
}
