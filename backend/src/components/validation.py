from flask import request, jsonify, session
import numpy as np

def is_safe(new_row, new_col, queen):
    for row, col in queen:
        if row == new_row or col == new_col or abs(row - new_row) == abs(col - new_col):
            return False
    return True

def validate_shape_constraint(row, col, position_to_shape, shapes_with_queens):
    position_key = f"{row},{col}"
    shape_id = position_to_shape.get(position_key)

    if shape_id is None:
        return False, 'Position does not belong to any shape'
    
    if shape_id in shapes_with_queens:
        return False, f"Shape {shape_id} already contains a queen"
    
    shapes_with_queens.add(shape_id)
    
    return True, ""

def is_position_valid(position_key, position_to_shape):
    return position_key in position_to_shape

def get_shape_for_position(position_key, position_to_shape):
     return position_to_shape.get(position_key)

def validation(n=8):
    if 'place_queen' not in session:
        session['place_queen'] = []
    
    if 'shapes_with_queens' not in session:
        session['shapes_with_queens'] = []
    
    if 'position_to_shape' not in session:
        session['position_to_shape'] = {}
    
    place_queen = session['place_queen']
    shapes_with_queens = set(session.get('shapes_with_queens', []))
    position_to_shape = session['position_to_shape']

    data = request.get_json()
    board = data.get('board')
    np_array = np.array(board)
    if not board:
        return jsonify({"success": False, "message": 'Board is required'}), 400
    
    new_pos = np.argwhere(np_array == 1)
    
    new_row, new_col = int(new_pos[0][0]), int(new_pos[0][1])
    if (new_row, new_col) in place_queen:
        return jsonify({'success': False, "message": 'Queen already placed at this position.'}), 400
    
    if not is_safe(new_row, new_col, place_queen):
        return jsonify({'success': False, "message": "Queen is attacking"}), 400
    
    shape_valid, shape_message = validate_shape_constraint(new_row, new_col, position_to_shape, shapes_with_queens)
    if not shape_valid:
        return jsonify({'success': False, "message": shape_message})
    
    place_queen.append((new_row, new_col))
    session['place_queen'] = place_queen
    session['shapes_with_queens'] = list(shapes_with_queens)
    
    if len(place_queen) == 8:
        session.pop('place_queen', None)
        session.pop('shapes_with_queens', None)
        return jsonify({'success': True, "message": 'All 8 queens are placed correctly!', "done": True})
    
    return jsonify({'success': True, "message": 'Queen placed successfully!', "done": False})