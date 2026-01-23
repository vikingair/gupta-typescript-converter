export {};

declare global {
  let DATETIME_Null: Date;
  let DATE_RANGE: unknown;
  let FALSE: false;
  let FETCH_Ok: 0;
  let FETCH_EOF: 1;
  let FETCH_Null: 2;
  let GET_SAME: unknown;
  let NUMBER_Null: 0;
  let IDNO: unknown;
  let IDYES: unknown;
  let ROW_Selected: number;
  let ROW_Hidden: number;
  let ROW_Edited: number;
  let ROW_New: number;
  let ROW_MarkDeleted: number;
  let ROW_Unselectable: number;
  /**
   * To handle window lifecycles, validation, and user input.
   */
  let SAM_Click: number;
  /**
   * Fired immediately after a window or object is created, but before it becomes visible.
   */
  let SAM_Create: number;
  /**
   * Fired after the window and all its children are fully created and visible.
   */
  let SAM_CreateComplete: number;
  /**
   * Fired when the user tries to close the window (e.g., clicks the X).
   */
  let SAM_Close: number;
  /**
   * Fired immediately before the window is removed from memory.
   */
  let SAM_Destroy: number;
  /**
   * Fired when the cursor (focus) enters a field or window.
   */
  let SAM_SetFocus: number;
  /**
   * Fired when the cursor leaves a field (user tabs out or clicks elsewhere).
   */
  let SAM_KillFocus: number;
  /**
   * Fired just before SAM_KillFocus, but only if the user modified the data.
   */
  let SAM_Validate: number;
  /**
   * The user double-clicks an object.
   */
  let SAM_DoubleClick: number;
  /**
   * Fired every time the user types a character or deletes text in a field.
   */
  let SAM_AnyEdit: number;
  /**
   * The table needs to display a new row from the database.
   */
  let SAM_FetchRow: number;
  /**
   * The user clicks the small gray box to the left of a row.
   */
  let SAM_RowHeaderClick: number;
  /**
   * The very first message sent when the .exe is launched.
   */
  let SAM_AppStartup: number;
  /**
   * The application is about to terminate.
   */
  let SAM_AppExit: number;
  /**
   * It has no predefined behavior. It is the starting point for creating your own custom messages.
   */
  let SAM_User: number;
  /**
   * Fired repeatedly by SalTimerSet.
   */
  let SAM_Timer: number;
  let SqlDatabase: string;
  let STRING_Null: "";
  let TBL_FillAll: unknown;
  let TBL_Flag_SingleSelection: unknown;
  let TBL_Flag_SelectableCols: unknown;
  let TBL_MaxRow: number;
  let TBL_MinRow: number;
  let TBL_SortDescending: number;
  let TBL_SortIncreasing: number;
  let TRUE: true;
  let VALIDATE_Cancel: number;
  let VALIDATE_Ok: number;
  let VALIDATE_OkClearFlag: number;
  let Window_Normal: unknown;

  // SAL buildins (TODO: Find automatically all used Sal functions)
  let SalAppDisable: (...args: any[]) => any;
  let SalAppEnable: (...args: any[]) => any;

  let SalArrayGetUpperBound: (...args: any[]) => any;
  /**
   * Primary command for managing the memory and size of Dynamic Arrays.
   *
   * nDimension: The dimension you are resizing.
   *   For a standard list (1D array), this is always 1.
   *   For a grid (2D array), you can specify 1 (rows) or 2 (columns).
   *
   * nUpperBound: The index of the last element you want to exist.
   * Important: This is not the "Count". Since Gupta arrays are 0-based, the count is nUpperBound + 1.
   *
   * Special Value: -1 is used to completely clear/reset the array.
   */
  let SalArraySetUpperBound: (
    arr: unknown[],
    nDimension: number,
    nUpperBound: number,
  ) => void;

  let SalBringWindowToTop: (...args: any[]) => any;
  let SalCenterWindow: (...args: any[]) => any;
  let SalClearField: (...args: any[]) => any;
  let SalColorSet: (...args: any[]) => any;
  let SalCreateWindow: (...args: any[]) => any;

  let SalDateConstruct: (...args: any[]) => any;
  let SalDateCurrent: (...args: any[]) => any;
  let SalDateDay: (...args: any[]) => any;
  let SalDateMonth: (...args: any[]) => any;
  let SalDateWeekday: (...args: any[]) => any;
  let SalDateYear: (...args: any[]) => any;

  let SalDestroyWindow: (...args: any[]) => any;
  let SalDisableWindow: (...args: any[]) => any;
  let SalDlgSaveFile: (...args: any[]) => any;
  let SalEnableWindow: (...args: any[]) => any;
  /**
   * Parameters:
   * hWndDlg: The handle of the dialog (usually just hWndForm when called from inside the dialog code).
   * nReturnVal: The number you want to send back to the caller. This number becomes the result of the {@link SalModalDialog} function
   */
  let SalEndDialog: (hWndDlg: any, nReturnVal: number) => void;

  let SalFmtFieldToStr: (...args: any[]) => any;
  let SalFmtFormatDateTime: (...args: any[]) => any;
  /**
   * Formats a given number as string using the provided format string.
   *
   * Character	Description
   * \`0\`  Digit placeholder: Displays a digit or a zero if the number is zero.
   * \`#\`	Digit placeholder: Displays a digit or nothing (suppresses leading/trailing zeros).
   * \`.\`	Decimal placeholder: Defines the location of the decimal point.
   * \`,\`	Thousand separator: Inserts commas between thousands.
   * \`%\`	Percentage: Multiplies the value by 100 and appends a % sign.
   * \`;\`	Section separator: Used to define separate formats for positive, negative, and zero values.
   *
   * Example:
   * SalFmtFormatNumber( 1234.567, '#,##0.00' ) === "1,234.57"
   */
  let SalFmtFormatNumber: (nNumber: number, sFormat: string) => string;
  let SalFmtSetInputMask: (...args: any[]) => any;

  let SalGetFirstChild: (...args: any[]) => any;
  let SalGetItemName: (...args: any[]) => any;
  let SalGetType: (...args: any[]) => any;
  let SalGetWindowText: (...args: any[]) => any;

  let SalHideWindow: (...args: any[]) => any;
  let SalHideWindowAndLabel: (...args: any[]) => any;
  let SalInvalidateWindow: (...args: any[]) => any;
  let SalIsNull: (...args: any[]) => any;
  let SalIsWindowVisible: (...args: any[]) => any;

  let SalListAdd: (...args: any[]) => any;
  let SalListDelete: (...args: any[]) => any;
  let SalListInsert: (...args: any[]) => any;
  let SalListPopulate: (...args: any[]) => any;
  let SalListQueryCount: (...args: any[]) => any;
  let SalListQuerySelection: (...args: any[]) => any;
  let SalListSetSelect: (...args: any[]) => any;

  let SalMessageBeep: (...args: any[]) => any;
  let SalMessageBox: (...args: any[]) => any;

  /**
   * Used to create and display a Dialog Box that requires immediate user attention.
   *
   * The key characteristic of a "Modal" dialog is that it stops the execution of the code that called it and prevents the user from interacting with the parent window until the dialog is closed.
   *
   * Counter part: {@link SalEndDialog}.
   *
   * Parameters
   * templateName: The name of the Dialog Box object as defined in your Outline (e.g., dlgLogin or dlgSearch).
   * hWndOwner: The handle of the window opening the dialog (usually hWndForm). This ensures the dialog stays on top of the parent.
   * windowParameters: If your dialog is defined to accept parameters (strings, numbers, dates), you pass them here.
   *
   * Return Value
   * It returns an integer value sent by the dialog when it closes. This allows the dialog to answer "Yes", "No", or send back a specific ID.
   */
  let SalModalDialog: (
    templateName: any,
    hWndOwner: any,
    ...windowParameters: any[]
  ) => number;
  /**
   * Returns remainder of division.
   * Result: nNumber1 % nNumber2
   */
  let SalNumberMod: (nNumber1: number, nNumber2: number) => number;
  /**
   * Standard SalNumberToStr: Converts a number to a string using the Windows OS settings
   * (e.g., in Germany, it produces "12,50" with a comma).
   */
  let SalNumberToStrX: (nNumber: number, nDecimalPlaces: number) => string;
  let SalNumberToWindowHandle: (...args: any[]) => any;
  let SalParentWindow: (...args: any[]) => any;
  let SalPostMsg: (...args: any[]) => any;
  let SalQuit: (...args: any[]) => any;
  let SalReportPrint: (...args: any[]) => any;
  let SalReportSetDateTimeVar: (...args: any[]) => any;
  let SalReportSetNumberVar: (...args: any[]) => any;
  let SalReportSetStringVar: (...args: any[]) => any;
  let SetRptAllRecords: (...args: any[]) => any;
  let SetRptPreview: (...args: any[]) => any;

  let SalSendClassMessage: (...args: any[]) => any;
  /**
   * Used functions for inter-object communication. It sends a message to a specific window or object and waits for that object to process the message before returning.
   *
   * You can use it to:
   * 1. Simulate user actions (like clicking a button programmatically).
   * 2. Execute custom logic defined under User Defined Messages (like PM_UpdateCustomer).
   * 3. Request data from another window (since SalSendMsg can return a value).
   *
   * Parameters:
   * hWnd (Window Handle): The handle of the window or control you want to send the message to.
   * nMsg (Number): The ID of the message. This can be a system message (e.g., SAM_Click) or a user-defined message (e.g., SAM_User + 1).
   * nWParam (Number): The first parameter to pass to the message. If not needed, pass 0. You can retrieve this in the receiving window using the system variable wParam.
   * nLParam (Number): The second parameter to pass. If not needed, pass 0. You can retrieve this in the receiving window using the system variable lParam.
   *
   * Return Value
   * Number: The value returned by the window that processed the message. This allows the receiving window to send a "result" back to the sender.
   */
  let SalSendMsg: (
    hWnd: any,
    nMsg: number,
    nWParam: number,
    nLParam: number,
  ) => number;

  let SalSetFocus: (...args: any[]) => any;
  let SalSetDefButton: (...args: any[]) => any;
  let SalSetMaxDataLength: (...args: any[]) => any;
  let SalSetWindowText: (...args: any[]) => any;

  let SalShowWindow: (...args: any[]) => any;
  let SalStatusSetText: (...args: any[]) => any;

  /**
   * Returns substring from left part of given string.
   *
   * Standard (SalStrLeft): Counts Characters.
   * Extended (SalStrLeftX): Counts Bytes.
   *
   * Example:
   * SalStrLeftX( "foo", 2 ) === "fo"
   */
  let SalStrLeftX: (sInput: string, nLen: number) => string;
  let SalStrLength: (...args: any[]) => any;
  /**
   * Returns substring from right part of given string.
   *
   * Standard (SalStrRight): Counts Characters.
   * Extended (SalStrRightX): Counts Bytes.
   *
   * Example:
   * SalStrRightX( "bar", 2 ) === "ar"
   */
  let SalStrRightX: (...args: any[]) => any;
  /**
   * E.g. SalStrMidX( "ABC-1234-XYZ", 4, 4 ) === "1234"
   */
  let SalStrMidX: (sString: string, nStart: number, nLength: number) => string;
  /**
   * Example: SalStrRepeat( "A", 5 ) === "AAAAA"
   */
  let SalStrRepeatX: (sChar: string, nByteLength: number) => string;
  /**
   * Returns index where search string was found in source string.
   * Returns -1 if not found.
   *
   * 1. It is Case-Insensitive.
   * It does not distinguish between uppercase and lowercase.
   * SalStrScan( "Hello World", "world" ) returns 6.
   *
   * 2. It supports Wildcards (Important!)
   * This is the feature that trips up most developers. SalStrScan supports the same wildcards as a SQL LIKE clause:
   *
   * \`%\`: Matches any set of characters.
   * \`_\`: Matches any single character.
   */
  let SalStrScan: (sSourceString: string, sSearchString: string) => number;
  let SalStrTokenize: (...args: any[]) => any;
  let SalStrToNumber: (...args: any[]) => any;
  /**
   * Trims leading and trailing whitespaces.
   */
  let SalStrTrim: (sString: string) => string;
  /**
   * Very likely like SalStrTrim: Trims leading and trailing whitespaces.
   */
  let SalStrTrimX: (sString: string) => string;
  let SalStrUpperX: (...args: any[]) => any;

  /**
   * Returns TRUE if at least one row matches the flags provided.
   */
  let SalTblAnyRows: (
    hWndTbl: any,
    nFlags: number,
    nFlagsMask: number,
  ) => boolean;
  /**
   * Removes the row at index nRow and shifts subsequent rows up.
   * Key Note: If the deleted row was editable and had unsaved changes, those changes are discarded.
   */
  let SalTblDeleteRow: (hWndTbl: any, nRow: number) => void;
  /**
   * Iterates through the table starting after nRow to find a row where the flags match.
   * Common Use Case: iterating through all selected rows.
   */
  let SalTblFindNextRow: (
    hWndTbl: any,
    nRow: number,
    nFlags: number,
    nFlagsMask: number,
  ) => boolean;
  /**
   * Fetches the text content of column hWndCol at row nRow and places it into the variable sText.
   * Note: This works even if the column is not currently visible or if the row is not the context row.
   */
  let SalTblGetColumnText: (hWndCol: any, nRow: number, sText: string) => void;
  /**
   * Adds a row at the index specified by nRow. Existing rows are shifted down.
   * Special case: Passing TBL_MaxRow as the nRow argument appends the row to the very end of the table.
   * @returns index of newly inserted row.
   */
  let SalTblInsertRow: (hWndTbl: any, nRow: number) => number;
  /**
   * It automatically executes the SQL statement provided (or the one associated with the table if sSelect is null)
   * and fetches rows into the table.
   *
   * @param hSql The SQL handle to use.
   * @param sSelect The SELECT statement (if NULL, it uses the statement defined in the table's properties or tblSource).
   * @param nFlags Controls behavior (e.g., TBL_FillAll to fetch all rows immediately, or TBL_FillNormal to fetch as the user scrolls).
   * Returns true if no error
  let SalTblPopulate: (hWndTbl: any, hSql: any, sSelect: string, nFlags: number) => boolean;
  /**
   * Returns the row number that the table is currently "pointing" to.
   * (i.e., the row set by the last SalTblSetContext or user interaction)
   */
  let SalTblQueryContext: (hWndTbl: any) => number;
  /**
   * Removes all rows and data from the table window, effectively resetting it to an empty state.
   * It is often called before repopulating a table manually.
   * Important: This does not highlight the row visually (use SalTblSetRowFlags with ROW_Selected for that).
   */
  let SalTblReset: (hWndTbl: any) => void;
  let SalTblSetColumnText: (hWndTbl: any, nRow: number, sData: string) => void;
  /**
   * It makes the specified nRow the "current" row.
   * Any subsequent calls to get column values will retrieve data from this row.
   */
  let SalTblSetContext: (hWndTbl: any, nRow: number) => void;
  /**
   * Applies a state (like ROW_Selected or ROW_Edited) to every row in the table.
   * Use Case: A "Select All" button would call this with ROW_Selected and bSet = TRUE.
   */
  let SalTblSetFlagsAnyRows: (
    hWndTbl: any,
    nFlags: number,
    nFlagsMask: number,
    bSet: boolean,
  ) => void;
  /**
   * Moves the cursor and edit focus to the cell at the intersection of nRow and hWndCol.
   * nMin and nMax determine the text selection within the cell (e.g., passing 0, -1 selects all text in that cell).
   */
  let SalTblSetFocusCell: (
    hWndTbl: any,
    nRow: number,
    hWndCol: any,
    nMin: number,
    nMax: number,
  ) => void;
  /**
   * It allows you to manipulate row properties such as whether the row is selected, hidden, marked as edited, or marked as new.
   *
   * Examples of Flags:
   *
   * - ROW_Selected:	Highlights the row (visual selection). Used to multi-select or single-select rows via code.
   * - ROW_Hidden:	Hides the row from the user without removing it from memory.
   * - ROW_Edited:	Marks the row as "dirty" (modified). This is crucial for database updates; SalTblUpdate looks for this flag.
   * - ROW_New:	Marks the row as a newly inserted record (an INSERT rather than an UPDATE).
   * - ROW_MarkDeleted:	Marks the row to be deleted from the database when SalTblUpdate is called.
   * - ROW_Unselectable:	Prevents the user from selecting this specific row with the mouse or keyboard.
   */
  let SalTblSetRowFlags: (
    hWndTbl: any,
    nRow: number,
    nFlags: number,
    bSet: boolean,
  ) => boolean;
  /**
   * Turns specific table features on or off.
   *
   * Examples of Flags:
   * - TBL_Flag_SelectMultiple: Allows the user to select more than one row.
   * - TBL_Flag_SizableCols: Allows the user to resize column headers.
   */
  let SalTblSetTableFlags: (
    hWndTbl: any,
    nFlags: number,
    bSet: boolean,
  ) => boolean;
  /**
   * Unlike an SQL ORDER BY clause (which sorts data before it reaches your application),
   * this function sorts data that is already populated in the table.
   *
   * TBL_SortAscending (A to Z, 0 to 9)
   * TBL_SortDescending (Z to A, 9 to 0)
   */
  let SalTblSortRows: (hWndTbl: any, hWndCol: any, nFlags: number) => boolean;

  /**
   * Initializes a timer for a specific window object. Once set, the system sends a SAM_Timer message to that window every time the specified time interval elapses.
   *
   * hWnd: The handle of the window or object that will receive the timer messages
   * nIDEvent: A user-defined integer identifier for the timer. This is crucial if you have multiple timers running on the same window, as it allows you to distinguish which timer just fired.
   * nElapse: The time-out value in milliseconds. For example, 1000 equals 1 second.
   */
  let SalTimerSet: (hWnd: any, nIDEvent: number, nElapse: number) => boolean;
  /**
   * Is the direct counterpart to {@link SalTimerSet} to stop a started timer.
   */
  let SalTimerKill: (hWnd: any, nIDEvent: number) => boolean;
  let SalTrackPopupMenu: (...args: any[]) => any;
  let SalUpdateWindow: (...args: any[]) => any;
  let SalWaitCursor: (...args: any[]) => any;
  let SalWindowHandleToNumber: (...args: any[]) => any;

  // SQL functions
  /**
   * Breaks the link between the hSql handle and the database, releasing any resources (memory, cursors) associated with that handle.
   */
  let SqlDisconnect: (hSql: any) => boolean;
  /**
   * Commits the current transaction. Any INSERT, UPDATE, or DELETE operations performed since the last commit (or rollback) are made permanent in the database.
   */
  let SqlCommit: (hSql: any) => boolean;
  /**
   * Connects the specified SQL Handle (hSql) to the database currently defined in the system variable SqlDatabase.
   * Key Note: If the connection is successful, hSql becomes a live link to the database. You generally call this once at the start of a process or window.
   */
  let SqlConnect: (hSql: any) => boolean;
  /**
   * Runs the SQL statement that sits in the buffer from the last SqlPrepare call.
   */
  let SqlExecute: (hSql: any) => boolean;
  /**
   * It scans the provided SQL string (sSelect) and identifies all bind variables (items starting with a colon, like :sName). It populates the string array sBindVars with the names of these variables.
   * Use Case: This is an advanced function used for Dynamic SQL. If you are building a generic reporting tool or a query builder where you don't know the variable names at compile time, this function helps you identify what variables need to be bound before execution.
   */
  let SqlExtractArgs: (sSelect: string, sBindVars: string) => any;
  /**
   * After running a SELECT statement, this function grabs the next available row from the database cursor and puts the data into the Into Variables (bind variables) defined in your query.
   * Return: Returns TRUE if a row was fetched, and FALSE if the end of the result set is reached (No More Rows).
   *
   * nIntoFetch: Can become one of
   * - FETCH_Ok (0): A row was successfully fetched.
   * - FETCH_EOF (1): There are no more rows to fetch. You have reached the end of the result set.
   * - FETCH_Null (2): A row was fetched, but one or more of the columns contained a NULL value and you did not handle it (e.g., using nvl() in SQL or checking indicators).
   */
  let SqlFetchNext: (hSql: any, nIntoFetch: number) => boolean;
  /**
   * Sends the SQL string (sSelect) to the database to be parsed, syntax-checked, and compiled. It does not execute the data modification or query yet.
   * Use Case: useful when you want to compile a query once and then SqlExecute it multiple times with different bind variable values (performance optimization).
   */
  let SqlPrepare: (hSql: any, sSelect: string) => boolean;
  /**
   * This is a convenience function that combines SqlPrepare and SqlExecute into a single call.
   * Use Case: The most common way to run standard queries where you don't need the performance benefit of pre-compiling.
   */
  let SqlPrepareAndExecute: (hSql: any, sSelect: string) => boolean;
  /**
   * Used to bind (or re-bind) the "Into" variables (the output variables) for a compiled SQL statement.
   * Normally: SqlPrepare calls SqlVarSetup automatically behind the scenes.
   * Explicit Use: You call SqlVarSetup manually if you have Prepared a statement once (to save performance) but the memory addresses of your variables have changed before you SqlExecute.
   */
  let SqlVarSetup: (hSql: any) => boolean;

  // other global functions
  let fnGetText: (...args: any[]) => any;
  let HourGlass: (...args: any[]) => any;

  // Visual Toolchest - VTSTR.APL
  /**
   * Returns the index where the string was found in the array.
   * Returns -1 if nothing found.
   */
  let VisArrayFindString: (sStrings: string[], sSearchFor: string) => number;
  /**
   * VisStrChoose( bExpression, sTrue, sFalse ) === (bExpression ? sTrue : sFalse)
   */
  let VisStrChoose: (
    bExpression: boolean,
    sTrue: string,
    sFalse: string,
  ) => string;
  /**
   * VisStrSubstitute( sSource, sSearch, sReplace ) === sSource.replace(sSearch, sReplace)
   */
  let VisStrSubstitute: (
    sSource: string,
    sSearch: string,
    sReplace: string,
  ) => string;
  let VisWaitCursor: (...args: any[]) => any;

  // action triggers
  let PM_Create: any;
  let Task: any;

  // Message Box Flags
  let MB_DefButton1: number;
  let MB_DefButton2: number;
  let MB_IconExclamation: number;
  let MB_IconHand: number;
  let MB_IconQuestion: number;
  let MB_IconStop: number;
  let MB_Ok: number;
  let MB_OkCancel: number;
  let MB_YesNo: number;
  let MB_YesNoCancel: number;

  // "When" listeners
  let addListener: (event: string, cb: () => boolean) => void;
}
