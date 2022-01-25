import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const playlistsApi = createApi({
    reducerPath: 'playlistsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/' }),
    endpoints: (builder) => ({
        getPlaylists: builder.query({
            query: () => 'playlists',
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPlaylistsQuery } = playlistsApi