import numpy as np
import random

def generate_shape(solution, num_shape=8):
    n = len(solution)
    queen_position = np.argwhere(solution == 1)
    queen_position = [tuple(pos) for pos in queen_position]
    
    shapes = []
    cell_assigned = set()

    assignment_grid = np.zeros((n, n), dtype=int)

    for i, queen_pos in enumerate(queen_position):
        queen_row, queen_col = queen_pos
        shape = [queen_pos]
        cell_assigned.add(queen_pos)
        assignment_grid[queen_row, queen_col] = 1

        row_range = np.clip(np.array([queen_row-1, queen_row+2]), 0, n)
        col_range = np.clip(np.array([queen_col-1, queen_col+2]), 0, n)

        neighbour_rows, neighbour_cols = np.meshgrid(
            np.arange(row_range[0], row_range[1]),
            np.arange(col_range[0], col_range[1]),
            indexing='ij'
        )
        neighbours = list(zip(
            neighbour_rows.flatten(),
            neighbour_cols.flatten()
        ))

        neighbours = [n for n in neighbours if n != queen_pos]

        random.shuffle(neighbours)

        for neighbor in neighbours:
            if neighbor not in cell_assigned:
                shape.append(neighbor)
                cell_assigned.add(neighbor)
                nr, nc = neighbor
                assignment_grid[nr, nc] = 1

                if len(shape) >= n:
                    break
        
        shapes.append(shape)
    unassigned_indices = np.argwhere(assignment_grid == 0)
    remaining_cells = [tuple(pos) for pos in unassigned_indices]
    random.shuffle(remaining_cells)

    shape_can_grow = list(range(len(shapes)))
    for cell in remaining_cells:
        row,col = cell

        adjacent_shapes = []

        for dr,dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            adj_row,adj_col = row+dr,col+dc

            if not (0<=adj_row < n and 0 <= adj_col < n):
                continue

            if(adj_row,adj_col) in cell_assigned:
                for shape_id,shape in enumerate(shapes):
                    if(adj_row,adj_col) in shape:
                        adjacent_shapes.append(shape_id)
                        break
            valid_adjacent_shapes = [s for s in adjacent_shapes if s in shape_can_grow]
            if valid_adjacent_shapes:
                shape_id = random.choice(valid_adjacent_shapes)
            else:
                shape_id = random.randint(0, len(shapes)-1)
        shapes[shape_id].append(cell)
        cell_assigned.add(cell)
        if len(shapes[shape_id]) >=n+2:
            if shape_id in shape_can_grow:
                shape_can_grow.remove(shape_id)

    json_shapes = []
    for shape in shapes:
        json_shape = [[int(pos[0]), int(pos[1])] for pos in shape]
        json_shapes.append(json_shape)
    return json_shapes