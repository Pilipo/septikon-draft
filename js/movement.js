var legal_moves = [];
var original_roll = 0;
//show("Legal Moves (15,2,10): ");
//show(get_legal_move(15,2,10));
//get_legal_move(1,1,1);
function get_legal_move(spaces, original_x, original_y, prev_x, prev_y)
{
    //show ("spaces "+spaces);
    //show ("orig coords "+original_x + ", " + original_y + ":: prev coords "+prev_x + ", " +prev_y);
    //show ("orig coords wall value " + WALL_GRID[original_x][original_y]);
     
    var directions_available = [1,2,4,8],
    available_direction_to_axis_change = {
        '1':{'y': parseInt(-1)},
        '2':{'x': parseInt(1)},
        '4':{'y': parseInt(1)},
        '8':{'x': parseInt(-1)}
        };
    
    if(spaces == original_roll && LOCK_GRID[original_x][original_y] && !LOCK_GRID[prev_x][prev_y])
    {
        //show("found a lock with " + spaces + " spaces remaining! "+original_x+ ", " + original_y);
        //show(get_local_locks(original_x,original_y));
        var locks = get_local_locks(original_x,original_y);
        for(lock in locks)
        {
        if((locks[lock][0] != prev_x || locks[lock][1] != prev_y)) {
            
                if(spaces == 0){
                    //show("zero spaces left! orig "+original_x + ", " +original_y);
                    legal_moves.push([parseInt(locks[lock][0]),parseInt(locks[lock][1])]);
                }else{
                    get_legal_move(spaces,parseInt(locks[lock][0]),parseInt(locks[lock][1]),original_x,original_y);
                }
            }
        }
    }
    
    spaces--;
    
    for(direction in directions_available)
    {			
        if(parseInt(WALL_GRID[original_x][original_y] & directions_available[direction]) == 0)
        {
            //show("wall check on " + original_x + ", " + original_y + " for "+ directions_available[direction] + ":: "+parseInt(WALL_GRID[original_x][original_y] & directions_available[direction]));
            if(typeof available_direction_to_axis_change[directions_available[direction]].x != 'undefined'
            && original_x + available_direction_to_axis_change[directions_available[direction]].x != prev_x) {
                
                //show("X:: "+available_direction_to_axis_change[directions_available[direction]].x );
                //show("Y:: "+available_direction_to_axis_change[directions_available[direction]].y );
                if(spaces == 0){
                    legal_moves.push([original_x + available_direction_to_axis_change[directions_available[direction]].x,original_y]);
                }else{
                    get_legal_move(spaces,original_x + available_direction_to_axis_change[directions_available[direction]].x,original_y, original_x, original_y);
                    }
            }
            
            if(typeof available_direction_to_axis_change[directions_available[direction]].y != 'undefined'
            && original_y + available_direction_to_axis_change[directions_available[direction]].y != prev_y) {
                
                //show("Y:: "+available_direction_to_axis_change[directions_available[direction]].y );
                if(spaces == 0){
                    legal_moves.push([original_x,original_y + available_direction_to_axis_change[directions_available[direction]].y]);
                }else{
                    get_legal_move(spaces,original_x,original_y + available_direction_to_axis_change[directions_available[direction]].y, original_x, original_y);
                    }
            }
            //show(available_direction_to_axis_change[directions_available[direction]]);						
        }
    }
    return legal_moves;
}

function get_local_locks(this_lock_x,this_lock_y)
{
    if(LOCK_GRID[this_lock_x][this_lock_y] != 1)
        return 0;
        
    var return_obj = [];
    
    for(col in LOCK_GRID)
    {
        if((this_lock_x <15 && col > 15) || (this_lock_x >15 && col < 15)) 
            continue;
            
        for(row in LOCK_GRID[col])
        {
            if(LOCK_GRID[col][row]==1 && (this_lock_x != col || this_lock_y != row))
            {
                
                return_obj.push([col,row]);
            }
        }
    }
    
    return return_obj;
    
}