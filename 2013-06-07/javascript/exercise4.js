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
		var color = [0.63, 0.31, 0.07];
		tri_1 = COLOR(color)(tri_1);
		//Drawing the triangle on the map
		DRAW(tri_1);
	}		
}

function tri_2(cp_2, i, j){
	if (i<(cp_2.length-1) && j<(cp_2.length-1)){
		var tri_2 = SIMPLICIAL_COMPLEX([cp_2[i][j], cp_2[i][j+1], cp_2[i+1][j+1]])([[0,1,2]]);
		var color = [0.63, 0.31, 0.07];
		tri_2 = COLOR(color)(tri_2);
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
The first FOR is for make the settlement variable, is very
important to execute it first because if not the settlement
flies on the mountain 
-------------------------------------------------------------*/
function draw_map_mountain(points){
	var max_value = 0;
	
	sample_settlements();									//Call to main samples
	
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
	
	var tree_numbers = 30;
	random_place(points, tree_numbers, max_value)	
	return max_value;
}

/*-------------------------------------------------------------
Call to settlement samples.
-------------------------------------------------------------*/
function sample_settlements(){
	var s1 = settlement_total(points,4,4,2,2);
	var p1 = populate_settlement(2,2,2,2,5);
	DRAW(p1);
	var s2 = settlement_total(points,10,10,6,6);	
	var p2 = populate_settlement(4,4,4,4,5);
	var p2 = T([0,1])([4,4])(p2);
	DRAW(p2);
}

/*-------------------------------------------------------------
Main planing function that planes the mountain 
urban regions.
-------------------------------------------------------------*/
function settlement_total(points,en_x,en_y,st_x,st_y){
	var settlement_end_point_x = en_x;					
	var settlement_end_point_y = en_y;
	
	var starting_pt_x = st_x;									//Starting point of the settlement
	var starting_pt_y = st_y;									//You can randomize the position of the settlement but it seems you need a control function that shures you from the overflow on the edges of the map!!!
	
	for (var k=starting_pt_x; k<settlement_end_point_x; k++) {
		for (var l=starting_pt_y; l<settlement_end_point_y; l++) {
			plane(points, k, l);
		}
	}			
}

/*-------------------------------------------------------------
Function that makes orizzontal a region selected.
-------------------------------------------------------------*/
function plane(cp_1, i, j,h){
	var tallness_of_the_settlement = 5;
	
	if (i<(cp_1.length-1) && j<(cp_1.length-1)){
	
		var c1_1 = cp_1[i][j];
		var c2_1 = cp_1[i+1][j];
		var c3_1 = cp_1[i+1][j+1];
		c1_1[2] = tallness_of_the_settlement;
		c2_1[2] = tallness_of_the_settlement;
		c3_1[2] = tallness_of_the_settlement;
		var tri_1 = SIMPLICIAL_COMPLEX([c1_1,c2_1,c3_1])([[0,1,2]]);
		DRAW(tri_1);
		
		var c1_2 = cp_1[i][j];
		var c2_2 = cp_1[i][j+1];
		var c3_2 = cp_1[i+1][j+1];
		c1_2[2] = tallness_of_the_settlement;
		c2_2[2] = tallness_of_the_settlement;
		c3_2[2] = tallness_of_the_settlement;
		var tri_2 = SIMPLICIAL_COMPLEX([c1_2,c2_2,c3_2])([[0,1,2]]);
		DRAW(tri_2);
	}		
	
	return tallness_of_the_settlement;
}

/*-------------------------------------------------------------
Function that makes a cuboid house.
-------------------------------------------------------------*/
function create_house(dims,trasl){
	var hs =  CUBOID([dims[0],dims[1],dims[2]]);
	hs = T([0,1,2])([trasl[0],trasl[1],trasl[2]])(hs);
	return hs;
}

/*-------------------------------------------------------------
Function that returns cuboid randoms dims.
-------------------------------------------------------------*/
function create_house_coo(){
	var rand_coo_x = Math.random();
	var rand_coo_y = Math.random();
	var rand_coo_z = Math.random();
	
	var rand = [(rand_coo_x+0.3)/2,(rand_coo_y+0.3)/2,(rand_coo_z+2)/2];
	
	return rand;
}

function populate_settlement(starting_pt_x,starting_pt_y,dim_s_x,dim_s_y,tall){
	var max_h = starting_pt_x + dim_s_x;
	var max_w = starting_pt_y + dim_s_y;
	var house = [];
	for(t=0;t<max_h;t++){
		for(y=0;y<max_w;y++){	
			var coo = create_house_coo();
			var h = create_house(coo,[coo[0]+y,coo[1]+t,tall]);
			h = T([0,1])([max_h,max_w])(h);
			house.push(h);
			
		}
	}
	houses = STRUCT(house);
	return houses;
}

points = tredify();						//Declaration of the Landscape matrix of points.
var max_val = draw_map_mountain(points);		//Draws all the points declared before.
make_lake(max_val)

