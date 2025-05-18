from src.components.validation import validation
from src.components.game import game
from src.components.remove_queen import remove_queen


def get_game():
    return game()

def get_data():
    return validation()

def remove_game():
    return remove_queen()