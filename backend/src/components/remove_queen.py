from flask import Flask, session, request, jsonify

def remove_queen():
    if 'place_queen' not in session:
        return jsonify({"success":False,'messgae':'No game in progress'}),400
    
    data = request.get_json()
    position = data.get('position')

    if not position or len(position) != 2:
        return jsonify({'success':False,"message":'Invalid postion'}),400
    
    row, col = position

    queens = session.get('place_queen',[])
    if(row,col) not in queens:
        return jsonify({"success":False,'message':'No queen at this position'}),400
    
    position_to_shape = session.get("position_to_shape",{})
    position_key = f'{row},{col}'
    shape_id = position_to_shape.get(position_key)

    updated_queens = [q for q in queens if q != (row,col)]
    session['place_queen'] = updated_queens

    shapes_with_queens = set(session.get("shapes_with_queens",[]))
    if shape_id in shapes_with_queens:
        shapes_with_queens.remove(shape_id)
        session['shapes_with_queens'] = list(shapes_with_queens)

    return jsonify({
        "success": True, 
        "message": "Queen removed successfully",
    })