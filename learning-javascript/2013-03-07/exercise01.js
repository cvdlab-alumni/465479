function identity(n){
	var matrice = new Array(); //Creo un primo vettore.
	for(var i = 0; i<n; i++){
		matrice[i] = []; //Creo un secondo vettore per avere una matrice.
		for (var j = 0; j<n; j++){
			if (i==j) matrice[i][j] = "1";
			else matrice[i][j] = "0";
		}
	}
	return matrice;
}

console.log(identity(4));