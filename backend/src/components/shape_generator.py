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


    for cell in remaining_cells:
        shape_id = random.randint(0, len(shapes)-1)
        shapes[shape_id].append(cell)
        cell_assigned.add(cell)

    json_shapes = []
    for shape in shapes:
        json_shape = [[int(pos[0]), int(pos[1])] for pos in shape]
        json_shapes.append(json_shape)
    print(json_shapes)
    return json_shapes