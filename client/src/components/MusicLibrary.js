import React, { useCallback, useEffect, useState } from 'react'
import YouTube from 'react-youtube'
import { PLAYER_STATE } from './constants'
import {useGetPlaylistsQuery} from "../reducers/playlists";
import {Loader} from "./Loader";

const playerOptions = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        // fs: 0,
        modestbranding: 1,
        playlist: '',
        controls: 0,
        disablekb: 1,
        listType: 'playlist',
    },
}

export function MusicLibraryPage() {
    const [player, setPlayer] = useState()
    const [playerState, setPlayerState] = useState(-1)
    const [videoTitle, setVideoTitle] = useState('')
    const [volume, setVolume] = useState('33')
    const [mute, setMute] = useState(false)
    const [time, setTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const { data, isLoading } = useGetPlaylistsQuery()
    const playlists = data?.playlists


    const onReady = useCallback(({ target: player }) => {
        setPlayer(player)
        setVideoTitle(player.playerInfo.videoData.title)
        setMute(player.isMuted())
    }, [])

    const onStateChange = useCallback(
        ({ data: playerState }) => {
            const {
                playerInfo: {
                    videoData: { title },
                    duration,
                },
            } = player
            setPlayerState(playerState)
            if (playerState === PLAYER_STATE.PLAYING || playerState === PLAYER_STATE.PAUSED) {
                setVideoTitle(title)
            }
            setDuration(duration)
        },
        [player]
    )

    useEffect(() => {
        player && player.setVolume(Number(volume))
    }, [player, volume])

    useEffect(() => {
        if (player) {
            mute ? player.mute() : player.unMute()
        }
    }, [player, mute])

    useEffect(() => {
        if (player && playlists?.length > 0) {
            player.cuePlaylist(playlists[0])
        }
    }, [player, playlists])

    const seekTo = useCallback((time, force = false) => {
        if (!player) return
        player.seekTo(time, force)
        setTime(time)
    }, [player])

    const onSeekChange = useCallback(
        e => {
            const seekTime = e.target.valueAsNumber
            seekTo(seekTime, true)
        },
        [seekTo]
    )

    const onPlay = useCallback(() => {
        player?.playVideo()
        seekTo(0, true)
    }, [player, seekTo])

    const onStop = useCallback(() => {
        player.stopVideo()
    }, [player])

    const onPause = useCallback(() => {
        if (
            [
                PLAYER_STATE.UNSTARTED,
                PLAYER_STATE.ENDED,
                PLAYER_STATE.PAUSED,
                PLAYER_STATE.CUED,
            ].includes(playerState)
        ) {
            playerState !== PLAYER_STATE.PAUSED && seekTo(0, true)
            player.playVideo()
        } else {
            player.pauseVideo()
        }
    }, [player, playerState, seekTo])

    const onPrev = useCallback(() => {
        if (player) {
            player.previousVideo()
            seekTo(0)
            ![PLAYER_STATE.PAUSED, PLAYER_STATE.PLAYING].includes(playerState) &&
            player.stopVideo()
        }
    }, [player, playerState, seekTo])

    const onNext = useCallback(() => {
        if (player) {
            player.nextVideo()
            seekTo(0)
            ![PLAYER_STATE.PAUSED, PLAYER_STATE.PLAYING].includes(playerState) &&
            player.stopVideo()
        }
    }, [player, playerState, seekTo])

    const onCuePlaylist = useCallback((playlist) => {
        if (player) {
            player.cuePlaylist(playlist)
            player.stopVideo()
            seekTo(0, true)
        }
    }, [player, seekTo])

    return (
        isLoading ? <Loader /> : <div className="music-library">
            {videoTitle}
            <div style={{ pointerEvents: 'none' }}>
                <YouTube opts={playerOptions} onReady={onReady} onStateChange={onStateChange} />
            </div>
            <div>
                <button type="button" onClick={onPlay}>
                    Play
                </button>
                <button
                    type="button"
                    onClick={onPause}
                >
                    Pause
                </button>
                <button type="button" onClick={onStop}>
                    Stop
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={mute}
                    value={volume}
                    onChange={e => setVolume(e.target.value)}
                />
                <button type="button" onClick={() => setMute(!mute)}>
                    {mute ? 'Unmute' : 'Mute'}
                </button>
                <button
                    type="button"
                    onClick={onPrev}
                >
                    Prev
                </button>
                <button
                    type="button"
                    onClick={onNext}
                >
                    Next
                </button>
            </div>
            <div>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={time}
                    onChange={onSeekChange}
                />
            </div>
            <div>
                {playlists?.length > 0 && playlists.map((playlist) => <div key={playlist}>
                    <button
                        type="button"
                        onClick={() => onCuePlaylist(playlist)}
                    >
                        {playlist}
                    </button>
                </div>)}
            </div>
        </div>
    )
}
