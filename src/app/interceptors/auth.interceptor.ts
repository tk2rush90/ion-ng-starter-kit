import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SignedMemberService } from '../services/app/signed-member/signed-member.service';

/**
 * Intercept request and set Authorization header.
 * @param req
 * @param next
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const signedMemberService = inject(SignedMemberService);

  return next(
    req.clone({
      setHeaders: {
        Authorization: signedMemberService.member?.accessToken || '',
      },
    }),
  );
};
