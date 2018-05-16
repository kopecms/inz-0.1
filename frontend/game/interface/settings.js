const Settings = (() => {
  let useKeyboard = true;
  let useControler = false;
  return {
    useControler,
    useKeyboard,
    toggleInput() {
      keyboard = !keyboard;
      controler = !controler;
    }
  }
})();

export default Settings;