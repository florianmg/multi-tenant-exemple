import { NextRequest, NextResponse } from 'next/server'
import { getHostnameDataOrDefault } from './lib/db'

export const config = {
  matcher: ['/', '/about', '/_sites/:path*'],
}

const domain = process.env.NODE_ENV === "production" && process.env.VERCEL === "1" ? 'flodevlab.fr' : 'localhost:3000';

export default async function middleware(req: NextRequest) {
  console.log('\n[START MIDDLEWARE]');
  const url = req.nextUrl
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host')
  console.log("hostname: ", hostname);
  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "subdomain-3.localhost:3000", "localhost:3000" is the root URL)
  // process.env.NODE_ENV === "production" indicates that the app is deployed to a production environment
  // process.env.VERCEL === "1" indicates that the app is deployed on Vercel
  const currentHost = hostname?.replace(`.${domain}`, '');
  console.log('currentHost: ', currentHost);

  const data = await getHostnameDataOrDefault(currentHost);
  console.log('data: ', data);

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  // console.log('url', url)
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`
  } else if(currentHost !== hostname) {
    // console.log('URL 2', req.nextUrl.href)
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/_sites/${data?.subdomain}${url.pathname}`
  }
  console.log('[END MIDDLEWARE]');
  return NextResponse.rewrite(url)
}