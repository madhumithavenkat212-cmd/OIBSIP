import sounddevice as sd
from scipy.io.wavfile import write
from faster_whisper import WhisperModel

model = WhisperModel("base", compute_type="int8")

def listen():
    fs = 16000

    print("Listening...")

    recording = sd.rec(
        int(8 * fs),
        samplerate=fs,
        channels=1,
        dtype="int16"
    )

    sd.wait()

    write("temp.wav", fs, recording)

    segments, _ = model.transcribe("temp.wav")

    text = ""

    for segment in segments:
        text += segment.text

    print("You said:", text)

    return text.lower()


if __name__ == "__main__":
    listen()