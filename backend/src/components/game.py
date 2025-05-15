import random
from src.components.queen_solution import find_solution
from src.components.shape_generator import generate_shape
from flask import jsonify, session

solutions = []

def game():
    global solutions
    if not solutions:
        solutions = find_solution(8)
    
    session['place_queen'] = []
    session['shapes_with_queens'] = [] 
    session['game_id'] = random.randint(1000, 9999)
    
    solution_id = random.randint(0, len(solutions)-1)
    selected_solution = solutions[solution_id]
    current_shapes = generate_shape(selected_solution)
    print(selected_solution)
    position_to_shape = {}
    for shape_id, shape in enumerate(current_shapes):
        for position in shape:
            position_key = f'{position[0]},{position[1]}'
            position_to_shape[position_key] = shape_id
  
    session['position_to_shape'] = position_to_shape
    
    return jsonify({
        'success': True,
        'shapes': current_shapes,
        'position_to_shape': position_to_shape,
        'game_id': session.get('game_id'), 
    })