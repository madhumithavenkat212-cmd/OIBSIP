import sys
from PyQt6.QtWidgets import QApplication
from ui import AssistantUI

app = QApplication(sys.argv)

window = AssistantUI()
window.show()

sys.exit(app.exec())