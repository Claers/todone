// import type { Handle } from '@sveltejs/kit';

// export const handle: Handle = async ({ resolve, event }) => {
//     let cors = '*';

//     if(event.request.method === 'OPTIONS' && cors) {
//         return new Response(null, {
//         headers: {
//             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//             'Access-Control-Allow-Origin': cors,
//             'Access-Control-Allow-Headers': '*'
//         }
//     });
//     }

//     const response = await resolve(event);
//     response.headers.append('Access-Control-Allow-Origin', cors);
//     return response;
// };