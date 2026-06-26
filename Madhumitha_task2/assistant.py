from playsound3 import playsound
import pyttsx3
import webbrowser
import datetime
import psutil
import asyncio
import edge_tts
import os

engine = pyttsx3.init()
engine.setProperty("rate", 180)

def speak(text):

    async def tts():
        communicate = edge_tts.Communicate(
            text,
            voice="en-US-AriaNeural"
        )

        await communicate.save("voice.mp3")

    asyncio.run(tts())

    playsound("voice.mp3")
def execute_command(command):

    command = command.lower()

    if "google" in command:
        webbrowser.open("https://google.com")
        speak("Opening Google")

    elif "youtube" in command:
        webbrowser.open("https://youtube.com")
        speak("Opening YouTube")

    elif "time" in command:
        now = datetime.datetime.now().strftime("%I:%M %p")
        speak(f"The time is {now}")

    elif "date" in command:
        today = datetime.datetime.now().strftime("%d %B %Y")
        speak(f"Today is {today}")

    elif "battery" in command:
        battery = psutil.sensors_battery()

        if battery:
            speak(
                f"Battery is {battery.percent} percent"
            )

        else:
            speak("Command not found")