from src.components.validation import validation
from src.components.game import game


def get_game():
    return game()

def get_data():
    return validation()