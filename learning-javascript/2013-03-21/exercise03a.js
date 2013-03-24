function Point2D(x, y)
{
	this.x = x;
	this.y = y;
}

function Edge(point1, point2)
{
	this.point1 = point1;
	this.point2 = point2;
	this.edgeLength = function()
		{
			var lunghezza;
			lunghezza = Math.sqrt(Math.pow((this.point1.x - this.point2.x), 2) + Math.pow((this.point1.y - this.point2.y), 2));
			return lunghezza;
		}
}

function Triangle(Edge1, Edge2, Edge3)
{
	this.Edge1 = Edge1;
	this.Edge2 = Edge2;
	this.Edge3 = Edge3;
}

var point1 = new Point2D(1,1);
var point2 = new Point2D(3,4);
var point3 = new Point2D(5,2);

var Edge1 = new Edge(point1, point2);
var Edge2 = new Edge(point1, point3);
var Edge3 = new Edge(point2, point3);

var Triangle = new Triangle(Edge1, Edge2, Edge3);

Triangle;