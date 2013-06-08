/*-------------------------------------------------------------
Util Functions and declaration of initial values
-------------------------------------------------------------*/
var domain2D = DOMAIN([[0,1],[0,1]])([20,20]);
var map_dimension = 20;					//Main map dimension
var square_dim = 2;							//Square dimension

/*-------------------------------------------------------------
Function for randomizzation
-------------------------------------------------------------*/
function randomizer(z, off){
	var rand_number = off*Math.random() - (off/3);
	return z+rand_number;
}

/*-------------------------------------------------------------
Creation of points on the map.
-------------------------------------------------------------*/
function gen_points_in_map(map_dimension, square_dim){
	var p_on_map = [];
	var i = 0;
	for (x = 0; x<=map_dimension; x=x+square_dim){
		p_on_map[i] = [];
		for (y = 0; y<=map_dimension; y=y+square_dim){
			p_on_map[i].push([x,y,0]);
		}
		i++;
	}
	return p_on_map;
}


/*-------------------------------------------------------------
The Tredify function implements the third coordinate Z
on the selected point. The point is get by a scan onto the 
"gen_points_in_map" a long array containing all the 
coordinates of the landscape.
-------------------------------------------------------------*/
function tredify(){
	var mountains;
	var pt = gen_points_in_map(map_dimension, square_dim);
	for (var i=0; i<pt.length; i++){
		for (var j=0; j<pt[i].length; j++){
			var point_selected = pt[i][j];
			if (i===0 && j===0)
				//Initial point selected of the third coordinate, i declare the initial point.
				point_selected[2]=1;
			else{
				if (i===0) {
					point_selected[2] = randomizer(pt[i][j-1][2], 1.5);
				} 
				else{
					point_selected[2] = randomizer(pt[i-1][j][2], 1.5);
				}
			}
		}
	}
	return pt;
}


/*-------------------------------------------------------------
Declaration of the Coordinates of the triangles and
the drawing of the simplicial complexes.
-------------------------------------------------------------*/
function tri_1(cp_1, i, j){
	if (i<(cp_1.length-1) && j<(cp_1.length-1)){
		//Setting the start point (edges) of the new triangle to the end edge points of the triangle in where begin.
		var tri_1 = SIMPLICIAL_COMPLEX([cp_1[i][j], cp_1[i+1][j], cp_1[i+1][j+1]])([[0,1,2]]);
		//Drawing the triangle on the map
		DRAW(tri_1);
	}		
}

function tri_2(cp_2, i, j){
	if (i<(cp_2.length-1) && j<(cp_2.length-1)){
		var tri_2 = SIMPLICIAL_COMPLEX([cp_2[i][j], cp_2[i][j+1], cp_2[i+1][j+1]])([[0,1,2]]);
		DRAW(tri_2);
	}
}

/*-------------------------------------------------------------
Util function for get the max Height of the mountains
-------------------------------------------------------------*/
function max_h(cp_1, i, j){
	if (i<(cp_1.length-1) && j<(cp_1.length-1)){
		var value = cp_1[i][j][2];
		return value;
	}		
}

/*-------------------------------------------------------------
Creation of the lake like a parallelepypedus initialized
with the max width.
-------------------------------------------------------------*/
function make_lake(height){
	var lake = CUBOID([map_dimension,map_dimension,height/3]);
	var color = [0, 0, 0.5, 0.7];
	coloredLake = COLOR(color)(lake);
	DRAW(coloredLake);
}


/*-------------------------------------------------------------
Function that creates a Tree STRUCT. 
We can find 3 main variables, tallnes (the max highness
of the cone, the height is the main tallness of the trunk.
returns the complete structure.
-------------------------------------------------------------*/
function tree(coo){
	var tallness = 2
	var radius = 0.5
	var discr_value = 20;
	var height = 0.3;
	var domain = DOMAIN([[0,1],[0,2*PI]])([discr_value,discr_value]);
	var basement = CYL_SURFACE([0.1])([32]);

	var external_prof = BEZIER(S0)([[radius,0,height],[0,0,tallness]]);
	var mapping = ROTATIONAL_SURFACE(external_prof);
	var surface = MAP(mapping)(domain);
	
	//This disk closes the bottom of the tree
	var covering_bottom = T([2])([height])(DISK(radius)(32));
	
	var color_green = [0, 0.7, 0];
	surface = COLOR(color_green)(surface);
	covering_bottom = COLOR(color_green)(covering_bottom);
	
	var color_brown = [0, 0.7, 0.7];							//I don't know, i can't see colors!!!!!!!!!!!!!!!
	basement = COLOR(color_brown)(basement);
	
	var tree = STRUCT([surface,basement,covering_bottom]);
	tree = T([0,1,2])([coo[0],coo[1],coo[2]])(tree);
	return tree;
}

/*-------------------------------------------------------------
This functions gets random coordinates on the landscape
point matrix. This is useful for placing the trees 
OUTSIDE THE WATER!!!
-------------------------------------------------------------*/
function rand_c(cp_1,max){
		var rand_coo_x = Math.random() * 10;
		rand_coo_x = Math.floor(rand_coo_x);
		var rand_coo_y = Math.random() * 10;
		rand_coo_y = Math.floor(rand_coo_y);
		
		//var rand_coo = rand_coo_x + " " + rand_coo_y
		
		var value = cp_1[rand_coo_x][rand_coo_y];
		if(value[2]>=max/3 ){
			return value;
		}
		else{
			return false;
			}
		
}

/*-------------------------------------------------------------
Placing the trees in the mountain coordinates
-------------------------------------------------------------*/
function random_place(pt,num,max){
	for(k = 0;k<num;k++){
	
		var random_coo = rand_c(pt,max);
		if(random_coo != false){							//If false the coordinate is in the water.
			var random_tree = tree(random_coo);
			DRAW(random_tree);
		}
	}
}

/*-------------------------------------------------------------
Invocation of the Triangles scanning the coordinates
of the landscape matrix.
This function updated returns the MAX HEIGHT of
the mountains, useful for make the lake.
-------------------------------------------------------------*/
function draw_map_mountain(points){
	var max_value = 0;
	for (var k=0; k<points.length; k++) {
		for (var l=0; l<points[k].length; l++) {
			tri_1(points, k, l);
			tri_2(points, k, l);
			
			var curr_value = max_h(points, k, l);
			if(curr_value > max_value){
				max_value = curr_value;
			}
		}
	}		
	
	var tree_numbers = 50;
	random_place(points, tree_numbers, max_value)	
	return max_value;
}

points = tredify();						//Declaration of the Landscape matrix of points.
var max_val = draw_map_mountain(points);		//Draws all the points declared before.
make_lake(max_val)

