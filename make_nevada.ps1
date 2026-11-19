$sampleRate = 22050
$bpm = 124.0
$beatSec = 60.0 / $bpm
$barSec = $beatSec * 4.0
$duration = $barSec * 4.0 # 16 measures / 4-bar loop * 2 = ~15.5 seconds
$totalSamples = [int]($sampleRate * $duration)
$bytes = New-Object byte[] (44 + $totalSamples * 2)

# Write RIFF header
$enc = [System.Text.Encoding]::ASCII
[System.Array]::Copy($enc.GetBytes("RIFF"), 0, $bytes, 0, 4)
[System.BitConverter]::GetBytes([int](36 + $totalSamples * 2)).CopyTo($bytes, 4)
[System.Array]::Copy($enc.GetBytes("WAVE"), 0, $bytes, 8, 4)
[System.Array]::Copy($enc.GetBytes("fmt "), 0, $bytes, 12, 4)
[System.BitConverter]::GetBytes([int]16).CopyTo($bytes, 16)
[System.BitConverter]::GetBytes([int16]1).CopyTo($bytes, 20) # PCM
[System.BitConverter]::GetBytes([int16]1).CopyTo($bytes, 22) # Mono
[System.BitConverter]::GetBytes([int]$sampleRate).CopyTo($bytes, 24)
[System.BitConverter]::GetBytes([int]($sampleRate * 2)).CopyTo($bytes, 28)
[System.BitConverter]::GetBytes([int16]2).CopyTo($bytes, 32)
[System.BitConverter]::GetBytes([int16]16).CopyTo($bytes, 34)
[System.Array]::Copy($enc.GetBytes("data"), 0, $bytes, 36, 4)
[System.BitConverter]::GetBytes([int]($totalSamples * 2)).CopyTo($bytes, 40)

# Frequencies for Nevada (Key: C minor / Eb major)
# Chords: Cm, Ab, Eb, Bb
$chords = @(
    @(130.81, 155.56, 196.00, 261.63), # Cm
    @(103.83, 130.81, 155.56, 207.65), # Ab
    @(155.56, 196.00, 233.08, 311.13), # Eb
    @(116.54, 146.83, 174.61, 233.08)  # Bb
)
$bassFreqs = @(65.41, 51.91, 77.78, 58.27)

# Nevada Melodic sequence (16 beats)
# (pitch, duration_in_beats)
$melody = @(
    # Bar 1: Cm
    392.00, 523.25, 622.25, 587.33,
    # Bar 2: Ab
    523.25, 466.16, 392.00, 466.16,
    # Bar 3: Eb
    392.00, 523.25, 587.33, 622.25,
    # Bar 4: Bb
    698.46, 587.33, 466.16, 523.25
)

$pos = 44
for ($i = 0; $i -lt $totalSamples; $i++) {
    $t = $i / $sampleRate
    $barIdx = [Math]::Floor($t / $barSec) % 4
    $beatIdx = [Math]::Floor($t / $beatSec) % 16
    $beatFraction = ($t % $beatSec) / $beatSec

    # Sidechain pumping curve on every beat (4-on-the-floor EDM kick curve)
    $pump = [Math]::Pow($beatFraction, 0.4)

    # Chord Pad
    $currChord = $chords[$barIdx]
    $chordVal = ([Math]::Sin(6.283185 * $currChord[0] * $t) +
                 [Math]::Sin(6.283185 * $currChord[1] * $t) +
                 [Math]::Sin(6.283185 * $currChord[2] * $t) +
                 [Math]::Sin(6.283185 * $currChord[3] * $t)) * 0.16 * $pump

    # Rolling Bassline (8th notes)
    $bassT = ($t % ($beatSec / 2.0)) / ($beatSec / 2.0)
    $bassEnv = [Math]::Max(0.0, 1.0 - $bassT * 1.5)
    $currBass = $bassFreqs[$barIdx]
    $bassVal = [Math]::Sin(6.283185 * $currBass * $t) * 0.35 * $bassEnv

    # Nevada Iconic Lead Melody
    $leadFreq = $melody[$beatIdx]
    $leadEnv = [Math]::Max(0.0, 1.0 - ($beatFraction * 1.1))
    # Sawtooth-like bright lead harmonics
    $leadVal = ([Math]::Sin(6.283185 * $leadFreq * $t) +
                [Math]::Sin(6.283185 * ($leadFreq * 2.0) * $t) * 0.4 +
                [Math]::Sin(6.283185 * ($leadFreq * 3.0) * $t) * 0.2) * 0.32 * $leadEnv

    $combined = ($chordVal + $bassVal + $leadVal) * 0.75
    $clamped = [Math]::Max(-1.0, [Math]::Min(1.0, $combined))
    $shortVal = [int16]($clamped * 32000.0)

    $b = [System.BitConverter]::GetBytes($shortVal)
    $bytes[$pos] = $b[0]
    $bytes[$pos + 1] = $b[1]
    $pos += 2
}

$outPath = "C:\Users\Hp\.gemini\antigravity\scratch\hazzel-portfolio\nevada.wav"
[System.IO.File]::WriteAllBytes($outPath, $bytes)
Write-Output "Successfully generated nevada.wav ($($bytes.Length) bytes)!"
