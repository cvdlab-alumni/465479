 
//========================== UTILITIES ============================================================

T = function (dims) {
  dims = dims.map(function(item){
    return item-1;
  });
  return function (values) {
    return function (object) {
      return object.clone().translate(dims,values);
    };
  };
}

S = function (dims) {
  dims = dims.map(function(item){
    return item-1;
  });
    return function (values) {
      return function (object) {
        return object.clone().scale(dims, values);
      };
    };
  }

 R = function (dims) {
  dims = dims.map(function(item){
    return item-1;
  });
    return function (angle) {
      return function (object) {
        return object.clone().rotate(dims, angle);
      };
    };
  }

  S3 = S2;
  S2 = S1;
  S1 = S0;

  GRID = SIMPLEX_GRID

  VIEW = DRAW
//===================================================================================================


//SUPERFICIE TERRA
//definisco il pilastro circolare
var circPill = EXTRUDE([2.45])(DISK(0.125)(36));
var circPill_firstRow_0 = T([1])([0.125])(circPill);

//definisco il pilastro rettangolare
var squarePill = EXTRUDE([2.45])(CUBOID([0.25,0.25]));
squarePill = T([2])([-0.125])(squarePill);

//definisco blocchi di raccordo
var circJunction = EXTRUDE([0.25])(DISK(0.125)(36));
circJunction = T([1])([0.125])(circPill);
var squareJunction = EXTRUDE([0.25])(CUBOID([0.25,0.25]));
squareJunction = T([2])([-0.125])(squareJunction);

//pilastri esterni, prima riga

var traslation = T([1])([2.75]);
var external_pillars_0 = STRUCT(REPLICA(5)([circPill_firstRow_0, traslation]));
var external_junctions_0 = STRUCT(REPLICA(5)([T([3])([-0.25])(circJunction), traslation]));
external_pillars_0 = STRUCT([external_pillars_0,external_junctions_0]);

//pilastri interni, seconda riga
//prima i cilindrici
var circPill_secondRow_0 = T([2])([5.25])(circPill_firstRow_0);
//poi i quadrati
var squarePill_secondRow_0 = T([1])([2.75])(squarePill);
squarePill_secondRow_0 = T([2])([5.25])(squarePill_secondRow_0);
internal_pillars_0 = STRUCT([circPill_secondRow_0, STRUCT(REPLICA(3)([squarePill_secondRow_0,traslation]))]);

var pillars0 = STRUCT([external_pillars_0,internal_pillars_0]);



//PRIMO PIANO

var squarePill_short = EXTRUDE([2.25])(CUBOID([0.25,0.25]));
squarePill_short = T([2])([-0.125])(squarePill_short);
var circPill_short = EXTRUDE([2.25])(DISK(0.125)(36));
circPill_short = T([1])([0.125])(circPill_short);

//pilastri esterni, prima riga, primo piano
var squarePill_firstRow_1 = T([3])([2.70])(squarePill_short);
var external_pillars_1 = STRUCT(REPLICA(5)([squarePill_firstRow_1, traslation]));

//pilastri interni, seconda riga, primo piano
var squarePill_secondRow_1 = T([2])([5.25])(squarePill_firstRow_1);
var internal_pillars_1 = STRUCT(REPLICA(3)([squarePill_secondRow_1, traslation]));
var lastSquarePill_secondRow_1 = T([1])([11])(squarePill_secondRow_1);
//l'unico pilastro cilindrico
var third_circPill_secondoRow_1 = T([1,2,3])([8.25,5.25,2.70])(circPill_short);
internal_pillars_1 = STRUCT([internal_pillars_1, third_circPill_secondoRow_1, lastSquarePill_secondRow_1]);
//aggiungo i raccordi per col secondo piano
var squareJunction_firstRow_1 = T([3])([5.20-0.25])(squareJunction);
var external_Junction_firstRow_1 = STRUCT(REPLICA(3)([squareJunction_firstRow_1, traslation]));
var squareJunction_secondRow_1 = T([1,2,3])([2.75,5.25,5.20-0.25])(squareJunction);

var pillars1 = STRUCT([internal_pillars_1,external_pillars_1,external_Junction_firstRow_1,squareJunction_secondRow_1]);


//SECONDO PIANO

//pilastri interni, prima riga, secondo piano
var squarePill_firstRow_2 = T([3])([5.20])(squarePill_short);
var external_pillars_2 = STRUCT(REPLICA(3)([squarePill_firstRow_2, traslation]));
var lastSquarePill_firstRow_2 = T([1])([11])(squarePill_firstRow_2);
var external_pillars_2 = STRUCT([external_pillars_2, lastSquarePill_firstRow_2]);

//pilastri esterni, seconda riga, secondo piano
var squarePill_secondRow_2 = T([2,3])([5.25, 5.20])(squarePill_short);
var internal_pillars_2 = STRUCT(REPLICA(5)([squarePill_secondRow_2, traslation]));

//aggiungo i raccordi per col terzo piano
var squareJunction_firstRow_2 = T([1,3])([5.5,7.70-0.25])(squareJunction);

var pillars2 = STRUCT([external_pillars_2,internal_pillars_2,squareJunction_firstRow_2]);


//TERZO PIANO
//definisco il pilastro rettangolare per l'ultimo piano (più basso)
var squarePill_3 = EXTRUDE([2.30])(CUBOID([0.25,0.25]));
squarePill_3 = T([2])([-0.125])(squarePill_3);
var squarePill_small_3 = EXTRUDE([2.30])(CUBOID([0.125,0.125]));
squarePill_small_3 = T([2])([-0.125])(squarePill_small_3);

//pilastri esterni, prima
var squarePill1_firstRow_3 = T([1,3])([5.5,7.70])(squarePill_3);
var squarePill2_firstRow_3 = T([1])([5.5])(squarePill1_firstRow_3);
var external_pillars_3 = STRUCT([squarePill1_firstRow_3,squarePill2_firstRow_3]);

//pilastri interni, seconda 

var squarePill1_small_secondRow_3 = T([2,3])([5.375,7.70])(squarePill_small_3);
var squarePill2_small_secondRow_3 = T([1])([2.75])(squarePill1_small_secondRow_3);
var squarePills_small_secondRow_3 = STRUCT([squarePill1_small_secondRow_3,squarePill2_small_secondRow_3]);
//pilastri grande
var squarePill_secondRow_3 = T([1,2,3])([5.5,5.25,7.70])(squarePill_3);
var internal_pillars_3 = STRUCT(REPLICA(3)([squarePill_secondRow_3, traslation]));
internal_pillars_3 = STRUCT([internal_pillars_3, squarePills_small_secondRow_3]);

var pillars3 = STRUCT([external_pillars_3,internal_pillars_3]);



//EXERCISE 1
var prato = SIMPLEX_GRID([[11.25],[7+0.125],[0.05]]);
prato = COLOR([0,1,0])(prato);
prato = T([2,3])([-0.125,-0.25])(prato);

//Pavimento piano terra

var little_stairs_0 = SIMPLEX_GRID([[1.50],[-5.125,1.875],[0.25]]);

//cella centrale, piano terra
var central_cell_0 = SIMPLEX_GRID([[-1.5,7],[-2,5],[0.25]]);

//sx cell
var sx_cell_0 = SIMPLEX_GRID([[-1.5,-7,1.3],[-2,-2.1,2.9],[0.25]]);

//semicerchio destro
function annulus_sector (alpha, r, R) {
  var domain = DOMAIN([[0,alpha],[r,R]])([36,1]);
  var mapping = function (v) {
    var a = v[0];
    var r = v[1];
    return [r*COS(a), r*SIN(a)];
  }
  var model = MAP(mapping)(domain);
  return model;
}
var semicircle_0 = annulus_sector(PI, 0, 1.25 + 0.20);
semicircle_0 = R([1,2])([-PI/2])(semicircle_0);
semicircle_0 = T([1,2])([1.5+7+1.3,2+2.5+1.25 -0.2])(semicircle_0);
semicircle_0 = EXTRUDE([0.25])(semicircle_0);

//down micro cell
var dw_cell_0 = SIMPLEX_GRID([[-1.50,1],[-1,1],[0.25]]);

//semicerchio in basso
var little_semicirle_0 = annulus_sector(PI,0,0.5);
little_semicirle_0 = R([1,2])([PI])(little_semicirle_0);
little_semicirle_0 = T([1,2])([1.5+0.5,1])(little_semicirle_0);
little_semicirle_0 = EXTRUDE([0.25])(little_semicirle_0);

var ground_floor = STRUCT([little_stairs_0,central_cell_0,sx_cell_0,semicircle_0,dw_cell_0, little_semicirle_0])
ground_floor = T([3])([-0.25])(ground_floor);

//Pavimento primo piano
var floor_1_1 = SIMPLEX_GRID([[11.25],[5.50],[0.25]]);
var floor_2_1 = SIMPLEX_GRID([[4.95],[1.625],[0.25]]);
floor_2_1 = T([1,2])([6.30,5.50])(floor_2_1);
var floor_3_1 = SIMPLEX_GRID([[3.8],[1.875],[0.25]]);
floor_3_1 = T([1,2])([-1.5,5.25])(floor_3_1);
var floor_4_1 = SIMPLEX_GRID([[6.30],[0.25],[0.25]]);
floor_4_1 = T([2])([6.875])(floor_4_1);

var floor_1 = STRUCT([floor_1_1,floor_2_1,floor_3_1,floor_4_1]);
floor_1 = T([2,3])([-0.125,2.45])(floor_1);

//Pavimento secondo piano
var floor_1_2 = GRID([[5.75],[7],[0.25]]);
floor_1_2 = T([1])([5.5])(floor_1_2);
var floor_2_2 = GRID([[0.5],[1.5],[0.25]]);
floor_2_2 = T([1,2])([5,5.50])(floor_2_2);
var verts = [[5.5,0],[5.5,5.5],[5,5.5]];
var cells = [[0,1,2]];
var floor_3_2 = SIMPLICIAL_COMPLEX(verts)(cells);
floor_3_2 = EXTRUDE([0.25])(floor_3_2);
var floor_4_2 = GRID([[5],[0.25],[0.25]]);
//codice di Giovanni Pace 465479
floor_4_2 = T([1,2])([0.25,7-0.25])(floor_4_2);
var floor_5_2 = GRID([[0.25],[1.75],[0.25]]);
floor_5_2 = T([2])([5.25])(floor_5_2);

var floor_2 = STRUCT([floor_1_2,floor_2_2,floor_3_2,floor_4_2,floor_5_2]);
floor_2 = T([2,3])([-0.125,4.95])(floor_2);


//Pavimento terzo piano
//prima griglia a sinistra del terzo piano
var sx_cell_3 = SIMPLEX_GRID([[5.75],[7],[0.25]]);

//prima griglia a destra del terzo piano
var dx_cell_3 = SIMPLEX_GRID([[-5.75,3.125],[5.525],[0.25]]);

//seconda griglia a destra del terzo piano
var dx_second_cell_3 = SIMPLEX_GRID([[-5.75,-3,2.5],[5.4,1.6],[0.25]]);

var floor3 = STRUCT([sx_cell_3,dx_cell_3,dx_second_cell_3]);
floor3 = T([2,3])([-0.125,7.45])(floor3);


//QUARTO PIANO: Tetto
var sx_cell_4 = SIMPLEX_GRID([[5.625],[0.25,-5,1.75],[0.25]]);

//prima griglia a destra del terzo piano
var dx_cell_4 = SIMPLEX_GRID([[-5.625,5.625],[7],[0.25]]);
//contorno
var crosswalk = SIMPLEX_GRID([[0.25],[0.25,5],[0.25]]);

var floor4 = STRUCT([sx_cell_4,dx_cell_4,crosswalk]);
floor4 = T([2,3])([-0.125,9.75])(floor4);


floors = STRUCT([floor_1,floor_2,floor3,ground_floor,floor4]);


building = STRUCT([pillars0, pillars1, pillars2, pillars3, floors, prato]);
VIEW(building); 
