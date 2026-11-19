$sampleRate = 16000
$duration = 8 # 8 seconds
$totalSamples = $sampleRate * $duration
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

# Notes for 4 Lo-Fi Chords: Dm7 -> G7 -> Cmaj7 -> Am7
$chords = @(
    @(146.83, 174.61, 220.00, 261.63),
    @(98.00,  174.61, 246.94, 293.66),
    @(130.81, 164.81, 196.00, 246.94),
    @(110.00, 164.81, 220.00, 261.63)
)

$pos = 44
for ($i = 0; $i -lt $totalSamples; $i++) {
    $t = $i / $sampleRate
    $chordIdx = [Math]::Floor($t / 2.0) % 4
    $c = $chords[$chordIdx]
    $chordT = $t % 2.0
    $env = [Math]::Min(1.0, $chordT * 6.0) * [Math]::Max(0.2, (1.0 - ($chordT / 2.5)))

    # Chord harmonics
    $val = ([Math]::Sin(6.283185 * $c[0] * $t) +
            [Math]::Sin(6.283185 * $c[1] * $t) +
            [Math]::Sin(6.283185 * $c[2] * $t) +
            [Math]::Sin(6.283185 * $c[3] * $t)) * 0.18

    # Warm Bass
    $val += [Math]::Sin(6.283185 * ($c[0] * 0.5) * $t) * 0.35

    # Gentle Pluck
    $beatT = $t % 0.5
    $pEnv = [Math]::Max(0.0, 1.0 - ($beatT / 0.25))
    $arpFreq = $c[([Math]::Floor($t / 0.5) % 4)] * 2.0
    $val += [Math]::Sin(6.283185 * $arpFreq * $t) * 0.2 * $pEnv

    $shortVal = [int16]([Math]::Max(-32767.0, [Math]::Min(32767.0, $val * $env * 28000.0)))
    $b = [System.BitConverter]::GetBytes($shortVal)
    $bytes[$pos] = $b[0]
    $bytes[$pos + 1] = $b[1]
    $pos += 2
}

[System.IO.File]::WriteAllBytes("C:\Users\Hp\.gemini\antigravity\scratch\hazzel-portfolio\ambient_bgm.wav", $bytes)
Write-Output "Successfully wrote ambient_bgm.wav with size $($bytes.Length) bytes!"
