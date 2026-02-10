"""
Audio Analysis Script for Lyric Timing
Uses OpenAI Whisper to transcribe audio and extract timestamps.
"""

import json
import os

def analyze_audio(audio_path: str, output_path: str):
    """
    Analyze audio file using Whisper and extract word-level timestamps.
    """
    try:
        import whisper
    except ImportError:
        print("Installing whisper...")
        os.system("pip install openai-whisper")
        import whisper
    
    print(f"Loading Whisper model (this may take a while on first run)...")
    model = whisper.load_model("base")  # Use "small" or "medium" for better accuracy
    
    print(f"Transcribing audio: {audio_path}")
    result = model.transcribe(
        audio_path,
        language="mr",  # Marathi
        word_timestamps=True,
        verbose=True
    )
    
    # Extract segments with timestamps
    segments = []
    for segment in result.get("segments", []):
        segments.append({
            "text": segment["text"].strip(),
            "start": round(segment["start"], 2),
            "end": round(segment["end"], 2)
        })
        print(f"[{segment['start']:.2f} - {segment['end']:.2f}] {segment['text']}")
    
    # Save to JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved {len(segments)} segments to {output_path}")
    return segments


def create_lyrics_json(segments: list, lyrics: list, output_path: str):
    """
    Match detected segments to provided lyrics and create lyrics.json
    """
    # This is a simplified matching - may need manual adjustment
    timed_lyrics = []
    
    for i, lyric in enumerate(lyrics):
        if i < len(segments):
            timed_lyrics.append({
                "line": lyric,
                "start": segments[i]["start"],
                "end": segments[i]["end"]
            })
        else:
            # Fallback timing
            prev_end = timed_lyrics[-1]["end"] if timed_lyrics else 0
            timed_lyrics.append({
                "line": lyric,
                "start": prev_end + 0.5,
                "end": prev_end + 5
            })
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(timed_lyrics, f, ensure_ascii=False, indent=2)
    
    print(f"Created lyrics.json with {len(timed_lyrics)} entries")
    return timed_lyrics


if __name__ == "__main__":
    audio_file = "c:/Users/nakul/OneDrive/Desktop/suno_ai/my-video/public/Maharashtrachi Rajdhani Mumbai.mp3"
    segments_output = "c:/Users/nakul/OneDrive/Desktop/suno_ai/my-video/detected_segments.json"
    
    segments = analyze_audio(audio_file, segments_output)
    
    print("\n" + "="*60)
    print("DETECTED SEGMENTS:")
    print("="*60)
    for seg in segments:
        print(f"[{seg['start']:6.2f}s - {seg['end']:6.2f}s] {seg['text']}")
