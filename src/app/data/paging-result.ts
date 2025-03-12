export interface PagingResult<T> {
  /** Array of data */
  data: T[];

  /** Cursor to get next page */
  nextCursor?: string;

  /** Cursor to get previous page */
  previousCursor?: string;
}
