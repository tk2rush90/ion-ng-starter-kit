import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageUtil } from '../utils/local-storage-util';
import { ACCESS_TOKEN_KEY } from '../constants/storage-keys';

/**
 * Intercept request and set Authorization header.
 * @param req
 * @param next
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      setHeaders: {
        Authorization: LocalStorageUtil.get(ACCESS_TOKEN_KEY),
      },
    }),
  );
};
