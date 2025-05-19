export interface ListDataState<D> {
  data: D[];
  nextCursor: string | undefined;
  onceFetched: boolean;
}
