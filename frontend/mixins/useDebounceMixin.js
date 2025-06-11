export default {
  data(){
    return{
      debounceTimeout: null,
    }
  },
  methods: {
    /**
     * This function is used to delay the execution of a function (debouncing).
     * Debouncing prevents calling a function repeatedly over a short period of time
     * by providing a time delay (delay) before the function is called.
     * 
     * @param {Function} callbackFunction - The function to be executed after the pause time is over.
     * @param {number} timeDelay - The delay time (in milliseconds) before execution of the callback function.
     * @param {Function} callbackTyping - what to do while typing (optional - if there will be no action while typing, leave the parameter blank)
     */
    useDebounce(callbackFunction, timeDelay, callbackTyping){
      clearTimeout(this.debounceTimeout);
      if(callbackTyping) callbackTyping();
      this.debounceTimeout = setTimeout(() => {
        callbackFunction();
      }, timeDelay);
    }
  }
}