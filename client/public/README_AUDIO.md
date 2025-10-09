# Background Music Setup

## Required File
- Place `Bg.mp3` in this directory (`/client/public/`)
- The file will be played on loop on the home page
- Recommended: Soft instrumental background music

## Note
Currently there is a `Bg.mp4` video file. If you want to use audio from this video:
1. Extract audio using: `ffmpeg -i Bg.mp4 -vn -acodec libmp3lame -q:a 2 Bg.mp3`
2. Or use an online converter to convert MP4 to MP3
3. Place the resulting Bg.mp3 file here

## Volume Control
- Default volume: 30% (0.3)
- Users can mute/unmute via controls
