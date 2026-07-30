export interface IBaseFrame {
    /**
   * Returns wheter the screensaver is on or off as boolean
   */
    get onScreensaver(): boolean;

    /**
    * Is called in OnInit, everything you should put in OnInit Should be here instead
    */
    CalledOnInit(): any;


    /**
    * Is called in AfterInit, everything you should put in OnInit Should be here instead
    */
    CalledAfterViewInit(): any;

    /**
    * Called everytime iframe is clicken on 
    */
    CalledIFramClickHandeler(): any;


    /**
    * Called everytime a focus object is clicked in the ifram (Textbox, searchbox etc) 
    */
    CalledIFrameFocusHandler(): any;

    
}