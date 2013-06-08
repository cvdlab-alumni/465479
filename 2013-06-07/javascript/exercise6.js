/*-------------------------------------------------------------
V Function
-------------------------------------------------------------*/
function vertex(origin){
	var final_string = '';
	
	for (var i=0; i<origin.length; i++){
		var current_value = origin[i][2];									//Get the third element of the Vertex array, for the Obj standard we need to have [a,b,c] element and not [a,b].
		if (current_value===""){												//If is not set the current "z" value, set the "z" to 0.
			final_string+='v '+' '+origin[i][0]+' '+origin[i][1]+' '+origin[i][2]+'\n';
		}
		else{
			final_string+='v '+' '+origin[i][0]+' '+origin[i][1]+' 0 \n';
		}
	}
	return final_string;
}
	
/*-------------------------------------------------------------
FV Function
-------------------------------------------------------------*/
function facets(origin){
	var final_string = '';
	
	var l = origin.length;
	for(var i=0; i<l; i++){
		var k = origin[i].length;
		for(var j=0; j<k;j++){
			if(j == 0){final_string+='f '+origin[i][j]+' ';}					//Initialize the string
			else{
				if(j == k-1){final_string+=origin[i][j]+'\n';}					//If we are at the least - 1 element, print the least and break row
				else{
					final_string+=origin[i][j]+' ';									//Normal activation
				}
			}
 		}
	}
	return final_string;
}


/*-------------------------------------------------------------
Samples F,FV
-------------------------------------------------------------*/
fv = [[5,6,7,8],[0,5,8],[0,4,5],[1,2,4,5],[2,3,5,6],[0,8,7],[3,6,7],[1,2,3],[0,1,4]];
v = [[0,6],[0,0],[3,0],[6,0,4],[0,3,4],[3,3],[6,3],[6,6],[3,6]];

/*-------------------------------------------------------------
Regroupment of the functions
-------------------------------------------------------------*/
function main(v,fv){
	console.log(vertex(v));
	console.log(facets(fv));
}

/*-------------------------------------------------------------
Call to main Function
-------------------------------------------------------------*/
main(v,fv);