import { CrudService } from '../crud/crud.service';
import { createMap } from '../../../utils/array.utils';

export abstract class ListCrudService<
  D extends { id: string },
> extends CrudService<D[]> {
  dataMap: Record<any, D> = {};

  protected constructor() {
    super();
  }

  override get data(): D[] {
    return super.data || [];
  }

  override set data(value: D[]) {
    super.data = value;

    this.dataMap = createMap(this.data, 'id');
  }
}
