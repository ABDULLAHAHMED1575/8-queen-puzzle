import numpy as np

def find_solution(n=8):
    all_solution = []
    def is_safe(board,row,col):
        if np.any(board[:row,col] == 1):
            return False
        
        i,j = row-1,col-1
        while i>=0 and j>=0:
            if board[i,j] == 1:
                return False
            i -= 1
            j-=1
        
        i,j = row-1,col+1
        while i>=0 and j<n:
            if board[i,j] == 1:
                return False
            i-=1
            j+=1
        return True
    
    def solve(board,row):
        if row >= n:
            solution = board.copy()
            all_solution.append(solution)
            return
        
        for col in range(n):
            if is_safe(board,row,col):
                board[row,col] = 1
                solve(board,row+1)
                board[row,col] = 0
    
    board = np.zeros((n,n),dtype=int)

    solve(board,0)

    return all_solution