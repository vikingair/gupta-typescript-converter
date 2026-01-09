export const guptaEnvDTS = `export {};
declare global {
  let DATETIME_Null: Date;
  let DATE_RANGE: unknown;
  let FALSE: false;
  let GET_SAME: unknown;
  let NUMBER_Null: 0;
  let IDNO: unknown;
  let IDYES: unknown;
  let ROW_MarkDeleted: number;
  let ROW_Selected: number;
  let SqlDatabase: string;
  let STRING_Null: "";
  let TBL_FillAll: unknown;
  let TBL_Flag_SingleSelection: unknown;
  let TBL_Flag_SelectableCols: unknown;
  let TRUE: true;
  let VALIDATE_Cancel: number;
  let VALIDATE_Ok: number;
  let VALIDATE_OkClearFlag: number;
  let Window_Normal: unknown;

  // SAL buildins (TODO: Find automatically all used Sal functions)
  let SalAppDisable: (...args: any[]) => any;
  let SalAppEnable: (...args: any[]) => any;

  let SalArrayGetUpperBound: (...args: any[]) => any;
  let SalArraySetUpperBound: (...args: any[]) => any;

  let SalBringWindowToTop: (...args: any[]) => any;
  let SalCenterWindow: (...args: any[]) => any;
  let SalClearField: (...args: any[]) => any;
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
  let SalEndDialog: (...args: any[]) => any;

  let SalFmtFieldToStr: (...args: any[]) => any;
  let SalFmtFormatDateTime: (...args: any[]) => any;
  let SalFmtSetInputMask: (...args: any[]) => any;

  let SalGetFirstChild: (...args: any[]) => any;
  let SalGetItemName: (...args: any[]) => any;
  let SalGetType: (...args: any[]) => any;
  let SalGetWindowText: (...args: any[]) => any;

  let SalHideWindow: (...args: any[]) => any;
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

  let SalModalDialog: (...args: any[]) => any;
  let SalNumberToStrX: (...args: any[]) => any;
  let SalNumberToWindowHandle: (...args: any[]) => any;
  let SalParentWindow: (...args: any[]) => any;
  let SalPostMsg: (...args: any[]) => any;
  let SalQuit: (...args: any[]) => any;
  let SalReportPrint: (...args: any[]) => any;
  let SetRptAllRecords: (...args: any[]) => any;
  let SetRptPreview: (...args: any[]) => any;

  let SalSendClassMessage: (...args: any[]) => any;
  let SalSendMsg: (...args: any[]) => any;

  let SalSetFocus: (...args: any[]) => any;
  let SalSetDefButton: (...args: any[]) => any;
  let SalSetMaxDataLength: (...args: any[]) => any;
  let SalSetWindowText: (...args: any[]) => any;

  let SalStatusSetText: (...args: any[]) => any;

  let SalStrLeftX: (...args: any[]) => any;
  let SalStrLength: (...args: any[]) => any;
  let SalStrRightX: (...args: any[]) => any;
  /**
   * E.g. SalStrMidX( "ABC-1234-XYZ", 4, 4 ) === "1234"
   */
  let SalStrMidX: (sString: string, nStart: number, nLength: number) => string;
  let SalStrRepeatX: (...args: any[]) => any;
  let SalStrScan: (...args: any[]) => any;
  let SalStrTokenize: (...args: any[]) => any;
  let SalStrToNumber: (...args: any[]) => any;
  let SalStrTrim: (...args: any[]) => any;
  let SalStrTrimX: (...args: any[]) => any;
  let SalStrUpperX: (...args: any[]) => any;

  /**
   * Returns TRUE if at least one row matches the flags provided.
   */
  let SalTblAnyRows: (hWndTbl: any, nFlags: number, nFlagsMask: number) => boolean;
  /**
   * Removes the row at index nRow and shifts subsequent rows up.
   * Key Note: If the deleted row was editable and had unsaved changes, those changes are discarded.
   */
  let SalTblDeleteRow: (hWndTbl: any, nRow: number) => void;
  /**
   * Iterates through the table starting after nRow to find a row where the flags match.
   * Common Use Case: iterating through all selected rows.
   */
  let SalTblFindNextRow: (hWndTbl: any, nRow: number, nFlags: number, nFlagsMask: number) => boolean;
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
  /**
   * It makes the specified nRow the "current" row.
   * Any subsequent calls to get column values will retrieve data from this row.
   */
  let SalTblSetContext: (hWndTbl: any, nRow: number) => void;
  /**
   * Applies a state (like ROW_Selected or ROW_Edited) to every row in the table.
   * Use Case: A "Select All" button would call this with ROW_Selected and bSet = TRUE.
   */
  let SalTblSetFlagsAnyRows: (hWndTbl: any, nFlags: number, nFlagsMask: number, bSet: boolean) => void;
  /**
   * Moves the cursor and edit focus to the cell at the intersection of nRow and hWndCol.
   * nMin and nMax determine the text selection within the cell (e.g., passing 0, -1 selects all text in that cell).
   */
  let SalTblSetFocusCell: (hWndTbl: any, nRow: number, hWndCol: any, nMin: number, nMax: number) => void;
  /**
   * Turns specific table features on or off.
   *
   * Examples of Flags:
   * - TBL_Flag_SelectMultiple: Allows the user to select more than one row.
   * - TBL_Flag_SizableCols: Allows the user to resize column headers.
   */
  let SalTblSetTableFlags: (hWndTbl: any, nFlags: number, bSet: boolean) => any;

  let SalTrackPopupMenu: (...args: any[]) => any;
  let SalUpdateWindow: (...args: any[]) => any;
  let SalWaitCursor: (...args: any[]) => any;

  // SQL functions
  let SqlDisconnect: (...args: any[]) => any;
  let SqlCommit: (...args: any[]) => any;
  let SqlConnect: (...args: any[]) => any;
  let SqlExecute: (...args: any[]) => any;
  let SqlExtractArgs: (...args: any[]) => any;
  let SqlFetchNext: (...args: any[]) => any;
  let SqlPrepare: (...args: any[]) => any;
  let SqlPrepareAndExecute: (...args: any[]) => any;

  // other global functions
  let fnGetText: (...args: any[]) => any;
  let HourGlass: (...args: any[]) => any;

  // Visual Toolchest - VTSTR.APL
  let VisStrChoose: (...args: any[]) => any;
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
`;
