import { NextResponse ,NextRequest } from 'next/server'

export { default } from 'next-auth/middleware';
 import { getToken , GetTokenParams } from 'next-auth/jwt'


// This function can be marked `async` if using `await` inside
export  async function middleware(request: NextRequest) {
   

  const params: GetTokenParams<false> = {
    req: request,
    secret: 'khare', // Replace with your actual secret
    salt: 'salt' // Replace with your actual salt
  };
     const token = await getToken(params)
     const url = request.nextUrl

     if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/') 
     )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
     }
    

  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    'sign-up',
    '/',
    'dashboard/:path*',
    'verify/:path*',
  ],
}