
// import {
//   createRootRoute,
//   Outlet,
//   ScrollRestoration,
// } from '@tanstack/react-router'

// import {
//   Body,
//   Head,
//   Html,
//   Meta,
//   Scripts,
// } from '@tanstack/start'

// export const Route = createRootRoute({
//   component: RootComponent,
// })

// function RootComponent() {
//   return (
//     <Html>
//       <Head>
//         <Meta />
//       </Head>

//       <Body>
//         <Outlet />
//         <ScrollRestoration />
//         <Scripts />
//       </Body>
//     </Html>
//   )
// }



import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router'

import {
  Body,
  Head,
  Html,
  Meta,
  Scripts,
} from '@tanstack/start'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>

      <Body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}