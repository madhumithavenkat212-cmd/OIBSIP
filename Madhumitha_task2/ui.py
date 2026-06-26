from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from voice_listener import listen
from assistant import execute_command
from playsound3 import playsound
import sys
import random


class AssistantUI(QWidget):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("AI Assistant")
        self.resize(1200, 700)

        self.status = "READY"

        self.particles = []

        for _ in range(80):
            self.particles.append({
                "x": random.randint(0, 1200),
                "y": random.randint(0, 700),
                "size": random.randint(2, 6),
                "speed": random.uniform(0.5, 2)
            })

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_animation)
        self.timer.start(30)

        self.mic_btn = QPushButton("🎤", self)
        self.mic_btn.setGeometry(540, 550, 120, 60)

        self.mic_btn.setStyleSheet("""
            QPushButton{
                background:#7d3cff;
                color:white;
                font-size:28px;
                border-radius:20px;
            }
            QPushButton:hover{
                background:#9b66ff;
            }
        """)

        self.mic_btn.clicked.connect(self.start_listening)

    def start_listening(self):

        self.status = "LISTENING"
        self.update()

        text = listen()

        self.status = "PROCESSING"
        self.update()

        execute_command(text)

        self.status = "READY"
        self.update()

    def update_animation(self):

        for p in self.particles:

            p["y"] -= p["speed"]

            if p["y"] < 0:
                p["y"] = 700
                p["x"] = random.randint(0, 1200)

        self.update()

    def paintEvent(self, event):

        painter = QPainter(self)

        gradient = QLinearGradient(
            0, 0,
            self.width(),
            self.height()
        )

        gradient.setColorAt(
            0,
            QColor(15, 10, 40)
        )

        gradient.setColorAt(
            1,
            QColor(0, 0, 0)
        )

        painter.fillRect(
            self.rect(),
            gradient
        )

        # Floating particles

        painter.setPen(Qt.PenStyle.NoPen)

        for p in self.particles:

            painter.setBrush(
                QColor(255, 215, 0, 180)
            )

            painter.drawEllipse(
                int(p["x"]),
                int(p["y"]),
                p["size"],
                p["size"]
            )

        # Center Orb

        center_x = self.width() // 2
        center_y = self.height() // 2

        painter.setBrush(
            QColor(130, 70, 255)
        )

        painter.drawEllipse(
            center_x - 70,
            center_y - 70,
            140,
            140
        )

        # Waves

        pen = QPen(
            QColor(180, 120, 255)
        )

        pen.setWidth(4)

        painter.setPen(pen)

        for i in range(1, 4):

            painter.drawEllipse(
                center_x - (90 + i * 25),
                center_y - (90 + i * 25),
                (90 + i * 25) * 2,
                (90 + i * 25) * 2
            )

        # Status

        painter.setPen(Qt.GlobalColor.white)

        font = QFont(
            "Segoe UI",
            18,
            QFont.Weight.Bold
        )

        painter.setFont(font)

        painter.drawText(
            self.rect(),
            Qt.AlignmentFlag.AlignCenter,
            self.status
        )