function Point2D(x, y)
{
	this.x = x;
	this.y = y;
}

function Edge(point1, point2)
{
	this.point1 = point1;
	this.point2 = point2;
}

var Edge = new Edge(new Point2D(1,1), new Point2D(3,3));

Edge;