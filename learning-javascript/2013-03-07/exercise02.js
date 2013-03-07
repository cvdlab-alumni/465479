fibonacci[0] = 0;
fibonacci[1] = 1;

function fibonacci(i){
	if (i>1)
		fibonacci[i] = fibonacci(i-1)+fibonacci(i-2);
	return fibonacci[i];
}

console.log("fibonacci(15) = "+fibonacci(15));
console.log("fibonacci(34) = "+fibonacci(34));